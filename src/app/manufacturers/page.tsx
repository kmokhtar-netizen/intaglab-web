"use strict";
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Factory, Settings, PenTool, Database, Truck, Hammer, Zap, Activity,
    Scissors, Utensils, HardHat, FlaskConical, Stethoscope, Car, Cpu, Package, Armchair, Pickaxe, Wheat, Sprout, Anvil
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

// Helper to get an icon for a category (simple mapping for visual appeal)
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'textiles_garments': return <Scissors size={32} />;
        case 'food_beverage': return <Utensils size={32} />;
        case 'construction_building': return <HardHat size={32} />;
        case 'chemicals_petrochemicals': return <FlaskConical size={32} />;
        case 'pharmaceuticals_medical': return <Stethoscope size={32} />;
        case 'metal_steel': return <Anvil size={32} />; // fallback if Anvil not exists, check imports
        case 'plastic_rubber': return <Database size={32} />;
        case 'engineering_manufacturing': return <Settings size={32} />;
        case 'automotive_transportation': return <Truck size={32} />; // Car might be better
        case 'electronics_appliances': return <Cpu size={32} />;
        case 'energy_renewable': return <Zap size={32} />;
        case 'paper_packaging': return <Package size={32} />;
        case 'furniture_wood': return <Armchair size={32} />; // fallback
        case 'mining_quarrying': return <Pickaxe size={32} />;
        case 'agriculture_farming': return <Wheat size={32} />;
        default: return <Factory size={32} />;
    }
};

export default function ManufacturersPage() {
    const { t, isRTL } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                    {t('manufacturers.back')}
                </Link>
                <h1 className={styles.title}>
                    {t('manufacturers.title').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('manufacturers.title').split(' ').slice(-1)}</span>
                </h1>
                <p className={styles.subtitle}>
                    {t('manufacturers.subtitle')}
                </p>
            </div>

            <motion.div
                className={styles.grid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                    <Link
                        key={key}
                        href={`/?type=oem&category=${key}#inventory`}
                        className={styles.card}
                    >
                        <div className={styles.iconWrapper}>
                            {getCategoryIcon(key)}
                        </div>
                        <h3 className={styles.cardTitle}>{t(`categories.${key}`) || label}</h3>
                        <div className={styles.cardArrow}>
                            {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                        </div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
