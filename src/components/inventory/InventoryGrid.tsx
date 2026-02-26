"use client";

import React from 'react';
import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';
import styles from './InventoryBrowser.module.css';
import { useLanguage } from '@/context/LanguageContext';

interface InventoryGridProps {
    products: any[];
}

export default function InventoryGrid({ products }: InventoryGridProps) {
    const { t } = useLanguage();

    if (products.length === 0) {
        return (
            <div className={styles.emptyState}>
                <PackageSearch size={60} className={styles.subtitle} style={{ marginBottom: '1.5rem' }} />
                <h3 className={styles.emptyTitle}>{t('inventory.emptyTitle')}</h3>
                <p className={styles.emptyText}>{t('inventory.emptyText')}</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
