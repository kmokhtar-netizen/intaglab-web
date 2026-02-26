"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import styles from './InventoryBrowser.module.css';

// Sub-components
import InventoryControls from './InventoryControls';
import InventoryFilters from './InventoryFilters';
import InventoryGrid from './InventoryGrid';

export default function InventoryBrowser() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [activeType, setActiveType] = useState('all');

    // Sync state with URL params
    useEffect(() => {
        const typeParam = searchParams.get('type');
        const categoryParam = searchParams.get('category');

        if (typeParam) {
            setActiveType(typeParam);
        } else {
            setActiveType('all');
        }

        if (categoryParam) {
            setCategoryFilter(categoryParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const q = query(
            collection(db, 'products'),
            where("status", "==", "approved"), // Only show approved products
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleTypeChange = (type: string) => {
        setActiveType(type);
        const params = new URLSearchParams(searchParams);
        if (type === 'all') {
            params.delete('type');
        } else {
            params.set('type', type);
        }
        router.push(`${pathname}?${params.toString()}#inventory`, { scroll: false });
    };

    const filteredProducts = products.filter(product => {
        // Map URL param to Firestore value
        // surplus -> Surplus, machinery -> Machinery, oem -> OEM
        let typeMatch = true;
        if (activeType !== 'all') {
            const map: Record<string, string> = {
                'surplus': 'Surplus',
                'machinery': 'Machinery',
                'oem': 'OEM'
            };
            const productType = product.listingType || 'Surplus';
            typeMatch = productType === map[activeType];
        }

        const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.location && product.location.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesYear = yearFilter === 'all' || (product.mfgDate && product.mfgDate.startsWith(yearFilter));
        const normalize = (val: string) => val ? val.toLowerCase().replace(/[\s-]/g, '_') : '';
        const matchesLocation = locationFilter === 'all' || normalize(product.location) === locationFilter;
        const matchesCategory = categoryFilter === 'all' || normalize(product.category) === categoryFilter;

        return typeMatch && matchesSearch && matchesYear && matchesLocation && matchesCategory;
    }).sort((a, b) => {
        // Sort featured listings first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Otherwise keep original order (which is createdAt desc from Firestore)
        return 0;
    });

    const years = Array.from(new Set(products.map(p => p.mfgDate?.split('-')[0]).filter(Boolean))).sort().reverse();

    // Dynamic strings based on activeType
    const sectionKey = ['surplus', 'machinery', 'oem'].includes(activeType) ? activeType : 'all';
    const sectionTitle = t(`inventory.sections.${sectionKey}.title`) || t('inventory.title');
    const sectionSubtitle = t(`inventory.sections.${sectionKey}.subtitle`) || t('inventory.subtitle');
    const searchPlaceholder = t(`inventory.sections.${sectionKey}.placeholder`) || t('inventory.searchPlaceholder');

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 className="animate-spin" size={40} />
                <p>{t('inventory.loading')}</p>
            </div>
        );
    }

    return (
        <div className={styles.container} id="inventory">
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h2 className={styles.title}>
                        {sectionTitle.split(' ')[0]} <span className="gradient-text">{sectionTitle.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className={styles.subtitle}>{sectionSubtitle}</p>
                </div>

                <InventoryControls
                    activeType={activeType}
                    onTypeChange={handleTypeChange}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={searchPlaceholder}
                />

                <div className={styles.controls}>
                    <InventoryFilters
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        locationFilter={locationFilter}
                        setLocationFilter={setLocationFilter}
                        yearFilter={yearFilter}
                        setYearFilter={setYearFilter}
                        years={years}
                    />
                </div>
            </div>

            <InventoryGrid products={filteredProducts} />
        </div>
    );
}
