"use client";

import React from 'react';
import { Filter } from 'lucide-react';
import styles from './InventoryBrowser.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { CITIES, CATEGORIES } from '@/lib/constants';

interface InventoryFiltersProps {
    categoryFilter: string;
    setCategoryFilter: (val: string) => void;
    locationFilter: string;
    setLocationFilter: (val: string) => void;
    yearFilter: string;
    setYearFilter: (val: string) => void;
    years: string[];
}

export default function InventoryFilters({
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    yearFilter,
    setYearFilter,
    years
}: InventoryFiltersProps) {
    const { t } = useLanguage();

    return (
        <div className={styles.filterGroup}>
            <Filter size={18} className={styles.filterIcon} />
            <select
                className={styles.select}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <option value="all">{t('inventory.filters.category')}</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>{t(`categories.${key}`) || label}</option>
                ))}
            </select>
            <select
                className={styles.select}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
            >
                <option value="all">{t('inventory.filters.city')}</option>
                {Object.entries(CITIES).map(([key, label]) => (
                    <option key={key} value={key}>{t(`cities.${key}`) || label}</option>
                ))}
            </select>
            <select
                className={styles.select}
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
            >
                <option value="all">{t('inventory.filters.year')}</option>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
}
