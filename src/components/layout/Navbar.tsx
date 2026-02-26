"use strict";
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Package, Settings, Factory, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import NotificationsDropdown from '@/components/layout/NotificationsDropdown';
import Ripple from '@/components/common/Ripple';

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { user, userData, logout, loading } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const isRtl = language === 'ar';

    return (
        <>
            <nav dir="ltr" className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
                <Link href="/" className={styles.brand}>
                    <Box size={24} className={styles.logoIcon} />
                    <span className={styles.logoText}>INTAGLAB</span>
                </Link>

                <div className={styles.navLinks} dir={isRtl ? "rtl" : "ltr"}>
                    <Link
                        href="/"
                        className={`${styles.link} ${pathname === '/' ? styles.linkActive : ''}`}
                    >
                        {t('nav.home')}
                    </Link>

                    <div className={styles.dropdown}>
                        <button className={styles.dropdownTrigger}>
                            {t('nav.services')}
                            <ChevronDown size={14} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link href="/?type=surplus#inventory" className={styles.dropdownItem}>
                                <Package size={16} />
                                {t('nav.surplus')}
                            </Link>
                            <Link href="/?type=machinery#inventory" className={styles.dropdownItem}>
                                <Settings size={16} />
                                {t('nav.machinery')}
                            </Link>
                            <Link href="/?type=oem#inventory" className={styles.dropdownItem}>
                                <Factory size={16} />
                                {t('nav.oem')}
                            </Link>
                        </div>
                    </div>

                    <Link
                        href="/about"
                        className={`${styles.link} ${pathname === '/about' ? styles.linkActive : ''}`}
                    >
                        {t('nav.about')}
                    </Link>

                    <Link
                        href="/blog"
                        className={`${styles.link} ${pathname === '/blog' ? styles.linkActive : ''}`}
                    >
                        {t('nav.getInformed')}
                    </Link>
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={toggleLanguage}
                        className={styles.langBtn}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            marginRight: '0.5rem',
                            marginLeft: '0.5rem'
                        }}
                    >
                        {language === 'en' ? '🇺🇸' : '🇪🇬'}
                    </button>

                    {!loading && (
                        user ? (
                            <>
                                <NotificationsDropdown />
                                <div className={styles.profileContainer}>
                                    <button
                                        className={styles.profileBtn}
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    >
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || "User"} className={styles.avatar} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                <UserIcon size={18} />
                                            </div>
                                        )}
                                    </button>
                                    {showProfileMenu && (
                                        <div className={styles.profileMenu}>
                                            <div className={styles.menuHeader}>
                                                <p className={styles.userName}>{user.displayName}</p>
                                                <p className={styles.userEmail}>{user.email}</p>
                                            </div>
                                            <Link href="/profile" className={styles.menuItem} onClick={() => setShowProfileMenu(false)}>
                                                <UserIcon size={16} />
                                                Profile
                                            </Link>
                                            <button onClick={() => { logout(); setShowProfileMenu(false); }} className={styles.menuItem}>
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>

                                            {/* Admin Link */}
                                            {user && (userData?.role === 'admin') && (
                                                <Link href="/admin" className={styles.menuItem} style={{ color: '#6366f1', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.25rem', paddingTop: '0.75rem' }}>
                                                    <Settings size={16} />
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className={styles.signInBtn} style={{ position: 'relative', overflow: 'hidden' }}>
                                Sign In
                                <Ripple />
                            </button>
                        )
                    )}

                    <Link href="/sell" className={styles.cta} style={{ position: 'relative', overflow: 'hidden' }}>
                        {t('nav.listProduct')}
                        <Ripple />
                    </Link>
                </div>
            </nav >
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
