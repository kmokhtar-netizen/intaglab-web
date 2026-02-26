"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Truck, ShieldCheck, ArrowRight, Box, MapPin, LayoutGrid } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORY_IMAGES } from '@/lib/constants';

interface ProductCardProps {
    product: {
        id: string;
        description: string;
        description_en?: string;
        description_ar?: string;
        mfgDate: string;
        warranty: string;
        warranty_en?: string;
        warranty_ar?: string;
        delivery: string;
        delivery_en?: string;
        delivery_ar?: string;
        quantity: string;
        unitMetric: string;
        condition: string; // key
        location: string; // key
        category: string; // key
        images: string[];
        terms: string;
        terms_en?: string;
        terms_ar?: string;
        status: string;
        price: string;
        currency: string;
        isVerified?: boolean;
        isFeatured?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { language, t } = useLanguage();

    const getLocalized = (field: string, fallback: string) => {
        // @ts-ignore
        if (language === 'ar' && product[`${field}_ar`]) {
            // @ts-ignore
            return product[`${field}_ar`];
        }
        // @ts-ignore
        return product[field] || fallback;
    };

    const normalizeKey = (val: string) => val ? val.toLowerCase().replace(/[\s-]/g, '_') : '';

    const normalizedCategory = normalizeKey(product.category);
    const normalizedCondition = normalizeKey(product.condition);
    const normalizedLocation = normalizeKey(product.location);

    const description = getLocalized('description', product.description);
    const categoryLabel = t(`categories.${normalizedCategory}`) || product.category;
    const conditionLabel = t(`conditions.${normalizedCondition}`) || product.condition;

    // Format location key to Title Case if not translated
    const locationLabel = t(`cities.${normalizedLocation}`) || product.location;
    // Fallback title casing if translation missing (e.g. manual entry)
    const displayLocation = locationLabel === product.location && product.location
        ? (product.location.charAt(0).toUpperCase() + product.location.slice(1)).replace(/_/g, ' ')
        : locationLabel;

    const mfgDateYear = product.mfgDate ? new Date(product.mfgDate).getFullYear() : 'N/A';

    return (
        <Link href={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.imageContainer}>
                    <img
                        src={(product.images && product.images.length > 0) ? product.images[0] : (CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.other)}
                        alt={description}
                        className={styles.image}
                    />
                    <div className={styles.badge}>
                        {mfgDateYear}
                    </div>
                    {product.condition && (
                        <div className={`${styles.conditionBadge} ${styles[product.condition.toLowerCase()] || ''}`}>
                            {conditionLabel}
                        </div>
                    )}
                    {product.isVerified && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(16, 185, 129, 0.95)', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                            <ShieldCheck size={14} />
                            {language === 'ar' ? 'موثوق' : 'Verified'}
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.description}>{description}</h3>

                    <div className={styles.details}>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <Box size={14} className={styles.detailIcon} />
                                <span className="truncate">{product.quantity} {product.unitMetric}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <LayoutGrid size={14} className={styles.detailIcon} />
                                <span className="truncate">{categoryLabel}</span>
                            </div>
                        </div>

                        <div className={styles.detailGrid} style={{ marginTop: '0.5rem' }}>
                            <div className={styles.detailItem}>
                                <MapPin size={14} className={styles.detailIcon} />
                                <span className="truncate">{displayLocation}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Calendar size={14} className={styles.detailIcon} />
                                <span>{product.mfgDate}</span>
                            </div>
                        </div>

                        <div className={styles.detailItem}>
                            <ShieldCheck size={14} className={styles.detailIcon} />
                            <span className="truncate">{t('sell.labels.warranty')}: {getLocalized('warranty', product.warranty)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <Truck size={14} className={styles.detailIcon} />
                            <span className="truncate">{getLocalized('delivery', product.delivery)}</span>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.status}>{product.status}</span>
                        <div className={styles.viewBtn}>
                            {t('common.viewDetails') || 'Details'} <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
