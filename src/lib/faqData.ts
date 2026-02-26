export type Language = 'en' | 'ar';

export interface FAQ {
    id: string;
    question: Record<Language, string>;
    answer: Record<Language, string>;
}

export const INTAGO_FAQS: FAQ[] = [
    {
        id: "what_is_intaglab",
        question: {
            en: "What is Intaglab?",
            ar: "إيه هو إنتاج لاب؟"
        },
        answer: {
            en: "Intaglab is a digital marketplace connecting industrial organizations. We help you buy and sell surplus inventory, idle machinery, and offer OEM manufacturing services to optimize resources.",
            ar: "إنتاج لاب هي منصة صناعية بتوصل المصانع والورش ببعض. بنساعدك تبيع وتشتري بواقي المصانع والماكينات المستعملة، وكمان تقدم خدمات تصنيع للغير."
        }
    },
    {
        id: "how_to_sell",
        question: {
            en: "How do I sell my surplus or machinery?",
            ar: "إزاي أبيع بواقي المصانع أو الماكينات؟"
        },
        answer: {
            en: "It's easy! Create an account, click 'List Product' in the top right, choose your category (Surplus, Machinery, or OEM), and fill out the details. Our team will review and approve your listing quickly.",
            ar: "الموضوع بسيط! اعمل حساب، ودوس على 'ضيف إعلان' فوق، واختار نوع الإعلان (بواقي، معدات، أو خدمات تصنيع)، واكتب التفاصيل. فريقنا هيراجع الإعلان وينزله بسرعة."
        }
    },
    {
        id: "is_it_safe",
        question: {
            en: "Are the sellers verified?",
            ar: "هل البياعين موثوقين؟"
        },
        answer: {
            en: "Yes, trust is our core value. We manually verify all users and review every single listing before it goes live on the platform to ensure a secure environment for your business.",
            ar: "أيوة، الثقة والأمان أهم حاجة عندنا. إحنا بنراجع كل الحسابات وكل الإعلانات قبل ما تنزل على المنصة عشان نضمن بيئة شغل أمنة ومضمونة."
        }
    },
    {
        id: "how_to_contact_seller",
        question: {
            en: "How do I contact a seller?",
            ar: "إزاي أتواصل مع بياع؟"
        },
        answer: {
            en: "Currently, you can view the seller's contact details (like phone number or email) directly on the product's detail page once you are logged into your verified account.",
            ar: "حالياً، تقدر تشوف تفاصيل التواصل مع البياع (زي رقم التليفون أو الإيميل) جوة صفحة تفاصيل المنتج أول ما تسجل دخول بحسابك الموثق."
        }
    },
    {
        id: "pricing",
        question: {
            en: "Is it free to list products?",
            ar: "هل تنزيل الإعلانات مجاني؟"
        },
        answer: {
            en: "Yes! Listing your surplus inventory, idle machinery, or OEM capacity is currently 100% free.",
            ar: "أيوة! رفع إعلانات بواقي المصانع، الماكينات، أو خدمات التصنيع مجاني 100% في الوقت الحالي."
        }
    }
];
