"use client";

import Link from "next/link";
import { blogPosts, LocalizedString } from "@/lib/blogData";
import styles from "./blog.module.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogIndex() {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    const getLocalized = (field: LocalizedString) => field[language] || field.en;
    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <ConditionalNavbar />
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {isRtl ? "مدونة إنتاج لاب" : "Intaglab Insights"}
                    </h1>
                    <p className={styles.subtitle}>
                        {isRtl
                            ? "نصائح وإستراتيجيات تسعير وخبرات سوقية عشان تقدر تعظم الاستفادة من بضاعتك ومعداتك."
                            : "Expert advice, pricing strategies, and market knowledge to help you maximize the value of your industrial assets."}
                    </p>
                </div>

                <div className={styles.grid}>
                    {blogPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                            <div className={styles.category}>{getLocalized(post.category)}</div>
                            <h2 className={styles.cardTitle}>{getLocalized(post.title)}</h2>
                            <p className={styles.excerpt}>{getLocalized(post.excerpt)}</p>
                            <div className={styles.meta}>
                                <span>{getLocalized(post.readTime)}</span>
                                <span>{post.publishDate}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
