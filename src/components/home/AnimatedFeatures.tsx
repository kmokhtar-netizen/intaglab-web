"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Settings, Factory, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './AnimatedFeatures.module.css';

const features = [
    {
        id: 'surplus',
        icon: Package,
        color: '#6366f1',
        link: '/?type=surplus#inventory'
    },
    {
        id: 'machinery',
        icon: Settings,
        color: '#8b5cf6',
        link: '/?type=machinery#inventory'
    },
    {
        id: 'oem',
        icon: Factory,
        color: '#ec4899',
        link: '/?type=oem#inventory'
    }
];

export default function AnimatedFeatures() {
    const { t, language } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const isRtl = language === 'ar';

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % features.length);
        }, 4000); // changes every 4 seconds

        return () => clearInterval(interval);
    }, [isHovered]);

    const activeFeature = features[activeIndex];
    const Icon = activeFeature.icon;

    return (
        <div
            className={styles.container}
            dir={isRtl ? "rtl" : "ltr"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.tabsContainer}>
                {features.map((feature, index) => {
                    const isActive = index === activeIndex;
                    const FeatureIcon = feature.icon;
                    return (
                        <button
                            key={feature.id}
                            className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
                            onClick={() => setActiveIndex(index)}
                            style={isActive ? { borderColor: feature.color, color: 'white' } : {}}
                        >
                            <FeatureIcon size={18} className={styles.tabIcon} style={{ color: isActive ? feature.color : 'inherit' }} />
                            <span className={styles.tabText}>{t(`features.${feature.id}Title`)}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className={styles.activeIndicator}
                                    style={{ background: feature.color }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className={styles.contentContainer}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                        className={styles.activeContent}
                    >
                        <div className={styles.iconWrapper} style={{ backgroundColor: `${activeFeature.color}15`, color: activeFeature.color }}>
                            <Icon size={48} strokeWidth={1.5} />
                            <motion.div
                                className={styles.iconPulse}
                                style={{ borderColor: activeFeature.color }}
                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        </div>

                        <div className={styles.textContent}>
                            <h3 className={styles.title}>{t(`features.${activeFeature.id}Title`)}</h3>
                            <p className={styles.description}>{t(`features.${activeFeature.id}Desc`)}</p>

                            <Link href={activeFeature.link} className={styles.actionBtn} style={{ background: activeFeature.color }}>
                                {isRtl ? "اكتشف المزيد" : "Explore"}
                                {isRtl ? <ArrowRight className={styles.rtlArrow} size={16} /> : <ArrowRight size={16} />}
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressTrack}>
                <motion.div
                    className={styles.progressBar}
                    style={{ background: activeFeature.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered ? "100%" : "100%" }}
                    transition={{ duration: isHovered ? 0 : 4, ease: "linear", repeat: isHovered ? 0 : Infinity }}
                    key={activeIndex + (isHovered ? "hovered" : "playing")}
                />
            </div>
        </div>
    );
}
