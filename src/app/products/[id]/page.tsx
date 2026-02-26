"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ImageGallery from '@/components/product/ImageGallery';
import { MapPin, Box, Calendar, ShieldCheck, Truck, Mail, Info, Video } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';
import { CATEGORY_IMAGES } from '@/lib/constants';

import { useLanguage } from '@/context/LanguageContext';

export default function ProductPage() {
    const { language, t } = useLanguage();
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'products', id);
                console.log("Fetching product with ID:", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getLocalized = (field: string, fallback: string) => {
        if (language === 'ar' && product?.[`${field}_ar`]) {
            return product[`${field}_ar`];
        }
        return product?.[field] || fallback;
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div style={{ textAlign: 'center' }}>
                    <h2>{t('common.loading')}</h2>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.loading}>
                <div style={{ textAlign: 'center' }}>
                    <h2>{t('inventory.emptyTitle')}</h2>
                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>{t('inventory.emptyText')}</p>
                    <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', borderBottom: '1px solid #6366f1' }}>
                        {t('common.backHome')}
                    </Link>
                </div>
            </div>
        );
    }

    // Resolve enums
    const categoryLabel = t(`categories.${product.category}`) || product.category;
    const conditionLabel = t(`conditions.${product.condition}`) || product.condition;

    // Note: locations in DB are keys now (e.g. 'cairo'), but we don't have a structured translation object for them yet in `t`. 
    // We added CITIES object in constants, but translations.ts only has 'nav', 'hero', etc.
    // I should check if I added cities to translations.ts. I did NOT. 
    // I added categories and conditions. I should stick to displaying the key or adding city translations.
    // For now, let's just capitalize/format the key if it's missing in translations.
    const locationLabel = product.location ? (product.location.charAt(0).toUpperCase() + product.location.slice(1)).replace(/_/g, ' ') : '';

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Left Column: Images */}
                <div className={styles.gallerySection}>
                    <ImageGallery
                        images={product.images}
                        title={getLocalized('description', product.description)}
                        fallbackImage={CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.other}
                    />
                </div>

                {/* Right Column: Details */}
                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{getLocalized('description', product.description)}</h1>

                    <div className={styles.badges}>
                        {product.isVerified && (
                            <div className={`${styles.badge}`} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                                <ShieldCheck size={16} /> {language === 'ar' ? 'موثوق' : 'Verified'}
                            </div>
                        )}
                        {product.location && (
                            <div className={`${styles.badge} ${styles.locationBadge}`}>
                                <MapPin size={16} /> {locationLabel}
                            </div>
                        )}
                        {product.condition && (
                            <div className={`${styles.badge} ${styles.conditionBadge}`}>
                                <Info size={16} /> {conditionLabel}
                            </div>
                        )}
                        {product.category && (
                            <div className={styles.badge} style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <Box size={16} /> {categoryLabel}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>{t('sell.labels.description') || 'Specifications'}</h3>
                        <div className={styles.specsGrid}>
                            <div className={styles.specItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <Box size={14} color="#64748b" />
                                    <span className={styles.specLabel}>{t('sell.labels.quantity')}</span>
                                </div>
                                <span className={styles.specValue}>{product.quantity} {product.unitMetric}</span>
                            </div>
                            <div className={styles.specItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <Calendar size={14} color="#64748b" />
                                    <span className={styles.specLabel}>{t('sell.labels.mfgDate')}</span>
                                </div>
                                <span className={styles.specValue}>{product.mfgDate}</span>
                            </div>
                            <div className={styles.specItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <ShieldCheck size={14} color="#64748b" />
                                    <span className={styles.specLabel}>{t('sell.labels.warranty')}</span>
                                </div>
                                <span className={styles.specValue}>{getLocalized('warranty', product.warranty)}</span>
                            </div>
                            <div className={styles.specItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <Truck size={14} color="#64748b" />
                                    <span className={styles.specLabel}>{t('sell.labels.delivery')}</span>
                                </div>
                                <span className={styles.specValue}>{getLocalized('delivery', product.delivery)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>{t('sell.labels.terms')}</h3>
                        <p className={styles.description}>{getLocalized('terms', product.terms)}</p>
                    </div>

                    <div className={styles.ctaContainer}>
                        {product.videoUrl && (
                            <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.contactBtn} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
                                <Video size={20} /> {language === 'ar' ? 'شاهد فيديو الفحص' : 'Watch Verification Video'}
                            </a>
                        )}
                        <a href={`mailto:sales@intaglab.com?subject=Inquiry about ${product.description} (ID: ${product.id})`} className={styles.contactBtn}>
                            <Mail size={20} /> {t('common.contactSeller')}
                        </a>
                        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
                            Reference ID: {product.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
