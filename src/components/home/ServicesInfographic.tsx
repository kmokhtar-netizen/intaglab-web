"use client";

import { motion } from "framer-motion";
import { Package, Settings, Factory, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ServicesInfographic.module.css";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" as const },
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.2 + 0.1, duration: 0.5, ease: "easeOut" as const },
    }),
};

const barGrow = {
    hidden: { width: "0%" },
    visible: (width: string) => ({
        width,
        transition: { delay: 0.5, duration: 1.2, ease: "easeOut" as const },
    }),
};

interface ServiceData {
    number: string;
    icon: React.ElementType;
    tagClass: string;
    nodeClass: string;
    checkClass: string;
    visualClass: string;
    iconWrapClass: string;
    barClass: string;
    barWidth: string;
    titleKey: string;
    descKey: string;
    tagLabelKey: string;
    features: string[];
    stats: { value: string; label: string }[];
    reverse: boolean;
}

export default function ServicesInfographic() {
    const { t } = useLanguage();

    const services: ServiceData[] = [
        {
            number: "01",
            icon: Package,
            tagClass: styles.serviceTagSurplus,
            nodeClass: styles.nodeNumberSurplus,
            checkClass: styles.featureCheckSurplus,
            visualClass: styles.visualCardSurplus,
            iconWrapClass: styles.visualIconSurplus,
            barClass: styles.visualBarSurplus,
            barWidth: "75%",
            titleKey: "features.surplusTitle",
            descKey: "features.surplusDesc",
            tagLabelKey: "nav.surplus",
            features: [
                t("services.surplusFeature1"),
                t("services.surplusFeature2"),
                t("services.surplusFeature3"),
            ],
            stats: [
                { value: "16+", label: t("services.statCategories") },
                { value: "40+", label: t("services.statCities") },
            ],
            reverse: false,
        },
        {
            number: "02",
            icon: Settings,
            tagClass: styles.serviceTagMachinery,
            nodeClass: styles.nodeNumberMachinery,
            checkClass: styles.featureCheckMachinery,
            visualClass: styles.visualCardMachinery,
            iconWrapClass: styles.visualIconMachinery,
            barClass: styles.visualBarMachinery,
            barWidth: "60%",
            titleKey: "features.machineryTitle",
            descKey: "features.machineryDesc",
            tagLabelKey: "nav.machinery",
            features: [
                t("services.machineryFeature1"),
                t("services.machineryFeature2"),
                t("services.machineryFeature3"),
            ],
            stats: [
                { value: "3", label: t("services.statConditions") },
                { value: "∞", label: t("services.statPotential") },
            ],
            reverse: true,
        },
        {
            number: "03",
            icon: Factory,
            tagClass: styles.serviceTagOem,
            nodeClass: styles.nodeNumberOem,
            checkClass: styles.featureCheckOem,
            visualClass: styles.visualCardOem,
            iconWrapClass: styles.visualIconOem,
            barClass: styles.visualBarOem,
            barWidth: "85%",
            titleKey: "features.oemTitle",
            descKey: "features.oemDesc",
            tagLabelKey: "nav.oem",
            features: [
                t("services.oemFeature1"),
                t("services.oemFeature2"),
                t("services.oemFeature3"),
            ],
            stats: [
                { value: "12+", label: t("services.statServices") },
                { value: t("services.statFast"), label: t("services.statMatching") },
            ],
            reverse: false,
        },
    ];

    return (
        <section className={styles.infographicSection}>
            {/* Header */}
            <motion.div
                className={styles.infographicHeader}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.infographicOverline}>{t("services.overline")}</div>
                <h2 className={styles.infographicTitle}>
                    {t("services.title")}
                </h2>
                <p className={styles.infographicSubtitle}>
                    {t("services.subtitle")}
                </p>
            </motion.div>

            {/* Steps */}
            <div className={styles.stepsContainer}>
                {services.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={idx}
                            className={`${styles.serviceRow} ${service.reverse ? styles.serviceRowReverse : ""}`}
                        >
                            {/* Content Side */}
                            <motion.div
                                className={styles.serviceContent}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                custom={0}
                            >
                                <div className={`${styles.serviceTag} ${service.tagClass}`}>
                                    <Icon size={14} />
                                    {t(service.tagLabelKey)}
                                </div>
                                <h3 className={styles.serviceTitle}>{t(service.titleKey)}</h3>
                                <p className={styles.serviceDesc}>{t(service.descKey)}</p>
                                <div className={styles.serviceFeatures}>
                                    {service.features.map((feat, fi) => (
                                        <motion.div
                                            key={fi}
                                            className={styles.serviceFeatureItem}
                                            variants={fadeUp}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            custom={fi + 1}
                                        >
                                            <span className={`${styles.featureCheck} ${service.checkClass}`}>
                                                <Check size={12} />
                                            </span>
                                            {feat}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Center Node */}
                            <motion.div
                                className={styles.nodeCenter}
                                variants={scaleIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                custom={0}
                            >
                                <div className={`${styles.nodeNumber} ${service.nodeClass}`}>
                                    {service.number}
                                    <span className={styles.nodePulse} style={{ color: "inherit" }} />
                                </div>
                            </motion.div>

                            {/* Visual Side */}
                            <motion.div
                                className={styles.serviceVisual}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                custom={1}
                            >
                                <div className={`${styles.visualCard} ${service.visualClass}`}>
                                    <div className={styles.visualCardInner}>
                                        <div className={`${styles.visualIconWrap} ${service.iconWrapClass}`}>
                                            <Icon size={28} />
                                        </div>
                                        <div className={styles.visualStats}>
                                            {service.stats.map((stat, si) => (
                                                <div key={si} className={styles.visualStat}>
                                                    <span className={styles.visualStatValue}>{stat.value}</span>
                                                    <span className={styles.visualStatLabel}>{stat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.visualBar}>
                                            <motion.div
                                                className={`${styles.visualBarFill} ${service.barClass}`}
                                                variants={barGrow}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                custom={service.barWidth}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
