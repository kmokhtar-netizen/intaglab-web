import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

// Note: Stripe requires raw body to verify the webhook signature
// In Next.js App Router, we just read the req.text()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-01-28.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message);
            return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
        }

        // Successfully verified event
        console.log(`✅ Webhook received: ${event.type}`);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            // Extract the metadata
            const metadata = session.metadata;
            const action = metadata?.action;
            const productId = metadata?.productId;

            if (action === 'boost_listing' && productId && adminDb) {
                try {
                    // Update the specific product in Firestore
                    const productRef = adminDb.collection('products').doc(productId);
                    const productDoc = await productRef.get();

                    if (productDoc.exists) {
                        await productRef.update({
                            isFeatured: true,
                            featuredAt: new Date(),
                            // Store the stripe session ID just for internal records
                            stripeSessionId: session.id,
                        });
                        console.log(`✅ Product ${productId} is now featured!`);
                    } else {
                        console.log(`❌ Product ${productId} not found in database.`);
                    }
                } catch (dbErr) {
                    console.error('Error updating Firestore:', dbErr);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error('Webhook error:', err);
        return NextResponse.json(
            { error: err.message || 'An error occurred processing webhook' },
            { status: 500 }
        );
    }
}
