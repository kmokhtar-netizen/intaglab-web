"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Package, Settings, Factory } from 'lucide-react';
import { Suspense } from 'react';
import InventoryBrowser from '@/components/inventory/InventoryBrowser';
import ServicesInfographic from '@/components/home/ServicesInfographic';
import AnimatedFeatures from '@/components/home/AnimatedFeatures';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import Ripple from '@/components/common/Ripple';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div className={styles.splitHero}>
        {/* LEFT SIDE: BUY / SOURCE */}
        <Link href="/?type=surplus#inventory" className={`${styles.splitSection} ${styles.buySection}`}>
          <div className={styles.splitContent}>
            <div className={styles.iconCircle}>
              <Package size={32} />
            </div>
            <h2 className={styles.splitOverline}>{t('hero.iWantTo')}</h2>
            <h1 className={styles.splitTitle}>{t('hero.buyTitle')}</h1>
            <p className={styles.splitDesc}>
              {t('hero.buyDesc')}
            </p>
            <div className={styles.splitBtn} style={{ position: 'relative', overflow: 'hidden' }}>
              {t('hero.browseInv')} <ArrowRight size={18} />
              <Ripple />
            </div>
          </div>
          <div className={styles.bgOverlay} />
        </Link>

        {/* RIGHT SIDE: PRODUCE / OEM */}
        <Link href="/manufacturers" className={`${styles.splitSection} ${styles.produceSection}`}>
          <div className={styles.splitContent}>
            <div className={styles.iconCircle}>
              <Factory size={32} />
            </div>
            <h2 className={styles.splitOverline}>{t('hero.iWantTo')}</h2>
            <h1 className={styles.splitTitle}>{t('hero.produceTitle')}</h1>
            <p className={styles.splitDesc}>
              {t('hero.produceDesc')}
            </p>
            <span className={styles.splitBtn} style={{ position: 'relative', overflow: 'hidden' }}>
              {t('hero.exploreMan')} <ArrowRight size={18} />
              <Ripple />
            </span>
          </div>
          <div className={styles.bgOverlay} />
        </Link>
      </div>

      <div className={styles.content}>
        <AnimatedFeatures />

        {/* OLD STATIC CARDS (Commented out for easy reversion)
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.features}
        >
          <Link href="/?type=surplus#inventory" className={styles.featureCard}>
            <Package className={styles.featureIcon} size={32} />
            <h3>{t('features.surplusTitle')}</h3>
            <p>{t('features.surplusDesc')}</p>
          </Link>
          <Link href="/?type=machinery#inventory" className={styles.featureCard}>
            <Settings className={styles.featureIcon} size={32} />
            <h3>{t('features.machineryTitle')}</h3>
            <p>{t('features.machineryDesc')}</p>
          </Link>
          <Link href="/?type=oem#inventory" className={styles.featureCard}>
            <Factory className={styles.featureIcon} size={32} />
            <h3>{t('features.oemTitle')}</h3>
            <p>{t('features.oemDesc')}</p>
          </Link>
        </motion.div>
        */}
      </div>

      <ServicesInfographic />

      <Suspense fallback={<div>Loading...</div>}>
        <InventoryBrowser />
      </Suspense>
    </>
  );
}
