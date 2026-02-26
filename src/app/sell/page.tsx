"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductIntakeForm from '@/components/forms/ProductIntakeForm';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { Lock } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

export default function SellPage() {
    const { user, loading } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const { t } = useLanguage(); // Need to use hook here to access translations for selection cards

    useEffect(() => {
        if (!loading && !user) {
            setIsAuthModalOpen(true);
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '3rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        marginBottom: '1.5rem',
                        color: '#6366f1'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Authentication Required</h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '2rem',
                        lineHeight: '1.6'
                    }}>
                        Please sign in to list your industrial assets on Intaglab. Adding a listing requires a verified account.
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        style={{
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                    >
                        Sign In / Sign Up
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.5)',
                            border: 'none',
                            marginTop: '1rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Return to Home
                    </button>
                </div>
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        );
    }
    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
    };

    if (selectedType) {
        return (
            <div style={{ padding: '2rem 1rem' }}>
                <ProductIntakeForm
                    initialType={selectedType}
                    onBack={() => setSelectedType(null)}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {t('sell.selectTypeTitle')}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
                    {t('sell.selectTypeSubtitle')}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Surplus Card */}
                <div
                    onClick={() => handleTypeSelect('Surplus')}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#6366f1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                >
                    <div style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        padding: '1rem',
                        borderRadius: '16px',
                        color: '#38bdf8'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                            {t('sell.types.surplus')}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                            {t('sell.types.surplusDesc')}
                        </p>
                    </div>
                </div>

                {/* Machinery Card */}
                <div
                    onClick={() => handleTypeSelect('Machinery')}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#6366f1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                >
                    <div style={{
                        background: 'rgba(251, 146, 60, 0.1)',
                        padding: '1rem',
                        borderRadius: '16px',
                        color: '#fb923c'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                            {t('sell.types.machinery')}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                            {t('sell.types.machineryDesc')}
                        </p>
                    </div>
                </div>

                {/* OEM Card */}
                <div
                    onClick={() => handleTypeSelect('OEM')}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                >
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '1rem',
                        borderRadius: '16px',
                        color: '#10b981'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                            {t('sell.types.oem')}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                            {t('sell.types.oemDesc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
