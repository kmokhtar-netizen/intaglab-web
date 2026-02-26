"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Users, TrendingUp, Award } from 'lucide-react';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={styles.title}>
                        {t('about.title').split(' ')[0]} <br />
                        <span className="gradient-text">{t('about.title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className={styles.subtitle}>
                        {t('about.subtitle')}
                    </p>
                </motion.div>
            </section>

            <section className={styles.section}>
                <div className={styles.missionGrid}>
                    <motion.div
                        className={styles.textBlock}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>{t('about.missionTitle')}</h2>
                        <p>
                            {t('about.missionP1')}
                        </p>
                        <p>
                            {t('about.missionP2')}
                        </p>
                    </motion.div>

                    <motion.div
                        className={styles.statsGrid}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>500+</div>
                            <div className={styles.statLabel}>{t('about.statSellers')}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>$2M+</div>
                            <div className={styles.statLabel}>{t('about.statValue')}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>50+</div>
                            <div className={styles.statLabel}>{t('about.statCountries')}</div>
                        </div>
                    </motion.div>
                </div>

                {/* OUR STORY SECTION */}
                <div className={styles.storySection}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={styles.sectionTitle}>{t('about.storyTitle')}</h2>
                        <div className={styles.storyContent}>
                            <p>{t('about.storyP1')}</p>
                            <p>{t('about.storyP2')}</p>
                        </div>
                    </motion.div>
                </div>

                {/* TEAM SECTION */}
                <div className={styles.teamSection}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={styles.sectionTitle}>{t('about.teamTitle')}</h2>
                        <div className={styles.teamGrid}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={styles.teamCard}>
                                    <div className={styles.teamAvatar}>
                                        <Users size={40} />
                                    </div>
                                    <h3>{t('about.teamMember')} {i}</h3>
                                    <p>{t('about.teamRole')}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>{t('about.valuesTitle')}</h2>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 4rem' }}>
                        {t('about.valuesSubtitle')}
                    </p>

                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.iconWrapper}>
                                <ShieldCheck size={30} />
                            </div>
                            <h3>{t('about.trust')}</h3>
                            <p>{t('about.trustDesc')}</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.iconWrapper}>
                                <Zap size={30} />
                            </div>
                            <h3>{t('about.speed')}</h3>
                            <p>{t('about.speedDesc')}</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.iconWrapper}>
                                <Globe size={30} />
                            </div>
                            <h3>{t('about.impact')}</h3>
                            <p>{t('about.impactDesc')}</p>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
