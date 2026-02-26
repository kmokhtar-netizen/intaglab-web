"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPostBySlug, LocalizedString } from "@/lib/blogData";
import styles from "../blog.module.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function BlogPostPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : '';
    const post = getPostBySlug(slug);

    const { language } = useLanguage();
    const isRtl = language === 'ar';

    useEffect(() => {
        if (post) {
            document.title = `${post.title[language] || post.title.en} | Intaglab Insights`;
        }
    }, [post, language]);

    if (!post) {
        notFound();
    }

    const getLocalized = (field: LocalizedString) => field[language] || field.en;

    return (
        <div dir={isRtl ? "rtl" : "ltr"}>
            <ConditionalNavbar />
            <main className={styles.container}>
                <article className={styles.articleContainer}>
                    <Link href="/blog" className={styles.backLink}>
                        {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                        {isRtl ? "الرجوع للمقالات" : "Back to Articles"}
                    </Link>

                    <h1 className={styles.articleTitle}>{getLocalized(post.title)}</h1>

                    <div className={styles.articleMeta}>
                        <span>{isRtl ? "بقلم " : "By "}{getLocalized(post.author)}</span>
                        <span>{post.publishDate}</span>
                        <span>{getLocalized(post.readTime)}</span>
                    </div>

                    <div className={styles.articleContent}>
                        {post.contentComponent}
                    </div>
                </article>
            </main>
        </div>
    );
}
