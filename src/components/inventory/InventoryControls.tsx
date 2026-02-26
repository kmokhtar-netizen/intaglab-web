"use client";

import React from 'react';
import { Search } from 'lucide-react';
import styles from './InventoryBrowser.module.css';
import { useLanguage } from '@/context/LanguageContext';

interface InventoryControlsProps {
    activeType: string;
    onTypeChange: (type: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    placeholder?: string;
}

export default function InventoryControls({
    activeType,
    onTypeChange,
    searchTerm,
    onSearchChange,
    placeholder
}: InventoryControlsProps) {
    const { t } = useLanguage();

    const tabs = [
        { id: 'all', label: t('inventory.tabs.all') },
        { id: 'surplus', label: t('inventory.tabs.surplus') },
        { id: 'machinery', label: t('inventory.tabs.machinery') },
        { id: 'oem', label: t('inventory.tabs.oem') }
    ];

    return (
        <>
            <div className={styles.typeTabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tabBtn} ${activeType === tab.id ? styles.tabBtnActive : ''}`}
                        onClick={() => onTypeChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={placeholder || t('inventory.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </>
    );
}
