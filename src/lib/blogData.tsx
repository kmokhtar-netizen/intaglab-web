import { ReactNode } from "react";
import PricingSurplusArticle from "@/components/blog/PricingSurplusArticle";
import PricingMachineryArticle from "@/components/blog/PricingMachineryArticle";
import PricingOemArticle from "@/components/blog/PricingOemArticle";

export interface LocalizedString {
    en: string;
    ar: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: LocalizedString;
    excerpt: LocalizedString;
    publishDate: string;
    readTime: LocalizedString;
    author: LocalizedString;
    category: LocalizedString;
    contentComponent: ReactNode;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "how-to-price-surplus-inventory",
        title: {
            en: "How to Price Your Surplus Inventory for Quick Sale",
            ar: "إزاي تسعّر بواقي مصنعك وتبيعها بسرعة"
        },
        excerpt: {
            en: "Learn the secrets to liquidating dead stock quickly without leaving money on the table. Discover how to balance speed with value recovery.",
            ar: "اعرف إزاي تسيّل البضاعة المركونة بسرعة من غير ما تخسر فلوسك. إزاي توازن بين سرعة البيع وبين استرجاع قيمتها."
        },
        publishDate: "2024-04-12",
        readTime: { en: "4 min read", ar: "٤ دقايق" },
        author: { en: "Intaglab Insights", ar: "مدونة إنتاج لاب" },
        category: { en: "Surplus", ar: "بواقي مصانع" },
        contentComponent: <PricingSurplusArticle />
    },
    {
        id: "2",
        slug: "pricing-used-industrial-machinery",
        title: {
            en: "The Ultimate Guide to Pricing Used Industrial Machinery",
            ar: "الخلاصة في تسعير الماكينات والمعدات المستعملة"
        },
        excerpt: {
            en: "Pricing machinery isn't just about original cost. Understand how condition, market demand, and depreciation impact the true market value of your idle equipment.",
            ar: "تسعير الماكينات مش مجرد سعر الشرا. افهم إزاي الحالة، وطلب السوق، والإهلاك بيحددوا السعر الحقيقي للماكينة اللي راكنة عندك."
        },
        publishDate: "2024-04-15",
        readTime: { en: "6 min read", ar: "٦ دقايق" },
        author: { en: "Intaglab Insights", ar: "مدونة إنتاج لاب" },
        category: { en: "Machinery", ar: "معدات وماكينات" },
        contentComponent: <PricingMachineryArticle />
    },
    {
        id: "3",
        slug: "how-to-price-oem-subcontracting-services",
        title: {
            en: "How to Price OEM and Subcontracting Services",
            ar: "إزاي تسعّر شغل المصنعيات وخدمات التشغيل للغير"
        },
        excerpt: {
            en: "Master the art of pricing your idle production capacity. From calculating hourly machine rates to factoring in overhead and profit margins.",
            ar: "اتعلم إزاي تسعّر شغل الماكينات الفاضية عندك. من أول حساب ساعة الماكينة لحد ما تحسب المصاريف الثابتة ونسبة المكسب."
        },
        publishDate: "2024-04-18",
        readTime: { en: "5 min read", ar: "٥ دقايق" },
        author: { en: "Intaglab Insights", ar: "مدونة إنتاج لاب" },
        category: { en: "OEM Services", ar: "خدمات تصنيع" },
        contentComponent: <PricingOemArticle />
    }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug);
}
