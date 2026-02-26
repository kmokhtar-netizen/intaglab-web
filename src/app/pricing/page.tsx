"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';

export default function PricingPage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (tier: string) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            // Note: In a real app, you would pass the specific Price ID for this tier
            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tier })
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned", data);
                alert("Failed to initialize checkout. Please try again.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred. Please try again later.");
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Loading plans...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: '6rem 1rem', background: '#0a0a0a', color: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-1px'
                    }}>
                        Unlock Your Selling Potential
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '1.25rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Get access to thousands of industrial buyers across the globe. Liquidate your surplus and idle machinery today.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                    // For mobile, this flexWrap will stack them
                }}>
                    {/* Basic Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            padding: '3rem 2.5rem',
                            flex: '1',
                            minWidth: '300px',
                            maxWidth: '400px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#a5b4fc' }}>Standard Vendor</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.95rem' }}>Perfect for occasional surplus liquidation.</p>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-2px' }}>$49</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>/month</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['List up to 10 active items', 'Standard marketplace visibility', 'Direct buyer messaging', 'Basic verified badge'].map((feature, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', padding: '0.2rem', marginTop: '2px' }}>
                                        <Check size={14} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe('standard')}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'transparent',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            {isLoading ? 'Processing...' : 'Subscribe Standard'}
                        </button>
                    </motion.div>

                    {/* Pro Tier (Highlighted) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.5)',
                            borderRadius: '24px',
                            padding: '3.5rem 2.5rem',
                            flex: '1.1',
                            minWidth: '320px',
                            maxWidth: '430px',
                            position: 'relative',
                            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                            zIndex: 10
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
                            Most Popular
                        </div>

                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>Enterprise Partner</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '0.95rem' }}>For OEM contract manufacturers and bulk liquidators.</p>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '4rem', fontWeight: '800', letterSpacing: '-2px' }}>$199</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>/month</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Unlimited active listings', 'Priority showcase placement', 'Dedicated account manager', 'Premium OEM badge', 'Advanced analytics dashboard'].map((feature, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', fontWeight: i < 2 ? '600' : 'normal' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', borderRadius: '50%', padding: '0.2rem', marginTop: '2px' }}>
                                        <Check size={14} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe('premium')}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.4)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)'; }}
                        >
                            {isLoading ? 'Processing...' : 'Go Unlimited'}
                        </button>
                    </motion.div>
                </div>

                <div style={{ marginTop: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Lock size={14} /> Secure payments powered by Stripe
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
