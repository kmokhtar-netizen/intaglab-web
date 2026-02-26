"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./page.module.css";
import Ripple from "@/components/common/Ripple";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function OnboardingPage() {
    const { user, userData, loading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [role, setRole] = useState<'company' | 'individual'>('company');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form Fields
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [taxId, setTaxId] = useState("");
    const [countryAddress, setCountryAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [preferUsername, setPreferUsername] = useState(false);

    // Shared fields
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [productInterests, setProductInterests] = useState("");

    useEffect(() => {
        // Redirect if already completed
        if (!loading && userData?.profileCompleted) {
            router.push('/');
        }
        // Redirect to home (which shows auth modal) if not logged in
        if (!loading && !user) {
            router.push('/');
        }

        // Pre-fill names if available from OAuth
        if (user?.displayName && !fullName) {
            setFullName(user.displayName);
        }
    }, [user, userData, loading, router, fullName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);

            const profileData: any = {
                profileCompleted: true,
                accountType: role,
                phone,
                // If they checked the box, save their username preference
                preferUsername: role === 'company' ? preferUsername : true,
                username: role === 'company' && !preferUsername ? null : username,
                displayName: role === 'individual' ? fullName : (preferUsername && username ? username : companyName),
            };

            if (role === 'company') {
                profileData.companyName = companyName;
                profileData.industry = industry;
                profileData.taxId = taxId;
                profileData.countryAddress = countryAddress;
            } else {
                profileData.fullName = fullName;
                profileData.productInterests = productInterests;
            }

            await updateDoc(userRef, profileData);

            // Force a reload or redirect to update AuthContext state
            // Normally onAuthStateChanged listener handles some changes, but context might need manual trigger or page refresh
            window.location.href = "/";

        } catch (err: any) {
            console.error("Error saving profile", err);
            setError("Failed to save profile. Please try again.");
            setIsLoading(false);
        }
    };

    if (loading || !user || userData?.profileCompleted) {
        return <div className={styles.container}>Loading...</div>; // Minimal loader for redirect state
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('onboarding.title')}</h1>
                    <p className={styles.subtitle}>{t('onboarding.subtitle')}</p>
                </div>

                {error && (
                    <div className={styles.error}>
                        <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                        {error || t('onboarding.error')}
                    </div>
                )}

                <div className={styles.roleToggle}>
                    <button
                        className={`${styles.roleBtn} ${role === 'company' ? styles.roleBtnActive : ''}`}
                        onClick={() => setRole('company')}
                        type="button"
                    >
                        {t('onboarding.roles.company')}
                    </button>
                    <button
                        className={`${styles.roleBtn} ${role === 'individual' ? styles.roleBtnActive : ''}`}
                        onClick={() => setRole('individual')}
                        type="button"
                    >
                        {t('onboarding.roles.individual')}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {role === 'company' ? (
                        <>
                            <div className={styles.inputGroup}>
                                <label htmlFor="companyName">{t('onboarding.labels.companyName')} {t('onboarding.required')}</label>
                                <input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder={t('onboarding.placeholders.companyName')} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="industry">{t('onboarding.labels.industry')} {t('onboarding.required')}</label>
                                <input id="industry" value={industry} onChange={e => setIndustry(e.target.value)} required placeholder={t('onboarding.placeholders.industry')} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="countryAddress">{t('onboarding.labels.countryAddress')} {t('onboarding.required')}</label>
                                <input id="countryAddress" value={countryAddress} onChange={e => setCountryAddress(e.target.value)} required placeholder={t('onboarding.placeholders.countryAddress')} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="taxId">{t('onboarding.labels.taxId')} {t('onboarding.optional')}</label>
                                <input id="taxId" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder={t('onboarding.placeholders.taxId')} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">{t('onboarding.labels.phone')} {t('onboarding.required')}</label>
                                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder={t('onboarding.placeholders.phone')} dir="ltr" />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="preferUsername"
                                    checked={preferUsername}
                                    onChange={e => setPreferUsername(e.target.checked)}
                                />
                                <label htmlFor="preferUsername">{t('onboarding.labels.preferUsername')}</label>
                            </div>

                            {preferUsername && (
                                <motion.div className={styles.inputGroup} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label htmlFor="username">{t('onboarding.labels.username')} {t('onboarding.required')}</label>
                                    <input id="username" value={username} onChange={e => setUsername(e.target.value)} required={preferUsername} placeholder={t('onboarding.placeholders.username')} dir="ltr" />
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className={styles.inputGroup}>
                                <label htmlFor="fullName">{t('onboarding.labels.fullName')} {t('onboarding.required')}</label>
                                <input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder={t('onboarding.placeholders.fullName')} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="username">{t('onboarding.labels.username')} {t('onboarding.required')}</label>
                                <input id="username" value={username} onChange={e => setUsername(e.target.value)} required placeholder={t('onboarding.placeholders.username')} dir="ltr" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="productInterests">{t('onboarding.labels.productInterests')} {t('onboarding.required')}</label>
                                <textarea id="productInterests" value={productInterests} onChange={e => setProductInterests(e.target.value)} required placeholder={t('onboarding.placeholders.productInterests')} style={{ minHeight: '80px', resize: 'vertical' }} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">{t('onboarding.labels.phone')} {t('onboarding.required')}</label>
                                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder={t('onboarding.placeholders.phone')} dir="ltr" />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        {isLoading ? t('onboarding.saving') : t('onboarding.submit')}
                        {!isLoading && <Ripple />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
