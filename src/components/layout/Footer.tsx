"use client";

import React from 'react';
import Link from 'next/link';
import { Box, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <footer className={styles.footer} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={styles.container}>
                {/* Column 1: Brand */}
                <div className={styles.brandColumn}>
                    <Link href="/" className={styles.brand}>
                        <Box size={24} className={styles.logoIcon} />
                        <span className={styles.logoText}>INTAGLAB</span>
                    </Link>
                    <p className={styles.mission}>
                        {isRtl
                            ? "مهمتنا: تقليل الهادر الصناعي وتحقيق أقصى استفادة من الماكينات."
                            : "Mission: Reducing industrial waste and optimizing machinery utility."}
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div className={styles.column}>
                    <h4>{isRtl ? "روابط سريعة" : "Quick Links"}</h4>
                    <ul className={styles.links}>
                        <li><Link href="/?type=surplus#inventory" className={styles.linkItem}>{isRtl ? "المخزون الفائض" : "Surplus Inventory"}</Link></li>
                        <li><Link href="/?type=machinery#inventory" className={styles.linkItem}>{isRtl ? "المعدات المتاحة" : "Idle Machinery"}</Link></li>
                        <li><Link href="/?type=oem#inventory" className={styles.linkItem}>{isRtl ? "خدمات التصنيع" : "OEM Services"}</Link></li>
                        <li><Link href="/sell" className={styles.linkItem}>{isRtl ? "أضف معداتك" : "List Your Equipment"}</Link></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div className={styles.column}>
                    <h4>{isRtl ? "الدعم" : "Support"}</h4>
                    <ul className={styles.links}>
                        <li><Link href="#" className={styles.linkItem}>{isRtl ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
                        <li><Link href="#" className={styles.linkItem}>{isRtl ? "شروط الخدمة" : "Terms of Service"}</Link></li>
                        <li><Link href="#" className={styles.linkItem}>{isRtl ? "الأسئلة الشائعة" : "FAQ"}</Link></li>
                        <li><Link href="#" className={styles.linkItem}>{isRtl ? "اتصل بنا" : "Contact Us"}</Link></li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div className={styles.column + " " + styles.newsletterColumn}>
                    <h4>{isRtl ? "النشرة البريدية" : "Newsletter"}</h4>
                    <p>{isRtl ? "اشترك ليصلك أحدث الأخبار والفرص" : "Subscribe to get the latest updates and opportunities."}</p>
                    <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder={isRtl ? "البريد الإلكتروني" : "Email address"}
                            className={styles.input}
                            required
                        />
                        <button type="submit" className={styles.joinBtn}>
                            {isRtl ? "انضم" : "Join"}
                        </button>
                    </form>
                </div>
            </div>

            <div className={styles.bottomRow}>
                <p>
                    {isRtl
                        ? "© ٢٠٢٦ إنتاج لاب. جميع الحقوق محفوظة."
                        : "© 2026 IntagLab. All rights reserved."}
                </p>
                <div className={styles.socialIcons}>
                    <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                        <Linkedin size={20} />
                    </a>
                    <a href="#" className={styles.socialIcon} aria-label="Twitter">
                        <Twitter size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
