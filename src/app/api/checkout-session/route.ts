import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, productTitle } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
        }

        // Get the host for the success/cancel URLs
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseURL = `${protocol}://${host}`;

        // Create Checkout Sessions for one-time payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Boost Listing: ${productTitle || 'Featured Ad'}`,
                            description: 'Highlights your listing on the homepage and promotes it across our social media platforms.',
                        },
                        unit_amount: 1500, // $15.00 one-time fee
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                productId: productId,
                action: 'boost_listing'
            },
            success_url: `${baseURL}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseURL}/profile?canceled=true`,
        });

        if (!session.url) {
            throw new Error('Failed to create checkout session URL');
        }

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json(
            { error: err.message || 'An error occurred during checkout initialization.' },
            { status: 500 }
        );
    }
}
