"use client";

import React from 'react';
import styles from './blogComponents.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function PricingMachineryArticle() {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    if (isRtl) {
        return (
            <>
                <p>
                    بيع ماكينة صناعية مستعملة بيفرق كتير عن بيع عربية أو تليفزيون مستعمل. مخرطة الـ CNC أو ماكينة حقن البلاستيك دي أصول بتجيب فلوس. عشان كده، سعرها مش بس معتمد على إنت اشتريتها بكام—سعرها معتمد على القيمة اللي لسة هتدخلها للمالك الجديد.
                </p>

                <p>
                    سواء بتحدث معداتك، بتصفي المصنع، أو بس عاوز تفضي مساحة، هنا هنقولك إزاي تفكر في تسعير الماكينات اللي راكنة عندك عشان تجيب بيها مشترين جادين على <strong>إنتاج لاب</strong>.
                </p>

                <h2>الركائز التلاتة لتقييم الماكينات</h2>

                <p>قبل ما تضرب أي رقم في الهوا، قيم ماكينتك على الأساسيات دي:</p>

                <div className={styles.gaugeContainer} dir="ltr">
                    <div className={`${styles.gaugeCard} ${styles.excellent}`}>
                        <div className={styles.gaugeTitle}>Age & Brand</div>
                        <div className={styles.gaugeValue}>Base</div>
                        <div className={styles.gaugeDesc}>البراندات المعروفة بتحافظ على سعرها</div>
                    </div>
                    <div className={`${styles.gaugeCard} ${styles.good}`}>
                        <div className={styles.gaugeTitle}>Condition</div>
                        <div className={styles.gaugeValue}>+ / -</div>
                        <div className={styles.gaugeDesc}>شغالة وبتتجرب؟ ولا مركونة في الشارع؟</div>
                    </div>
                    <div className={`${styles.gaugeCard} ${styles.fair}`}>
                        <div className={styles.gaugeTitle}>Current Demand</div>
                        <div className={styles.gaugeValue}>Multiplier</div>
                        <div className={styles.gaugeDesc}>مواعيد تسليم الجديد متأخرة؟</div>
                    </div>
                </div>

                <br /><br />

                <h3>١. العمر، الماركة، وسعر الشرا (الأساس)</h3>
                <p>
                    كقاعدة عامة لحسبة السوق، معظم الماكينات الصناعية بتفقد <strong>١٠٪ لـ ١٥٪ من قيمتها في أول سنة</strong>، وبعدين تقريباً <strong>٥٪ لـ ٨٪ كل سنة بعد كده</strong>. بس منحنى الإهلاك ده بيتغير تماماً حسب الماركة. مخرطة ألماني أو ياباني محترمة ممكن تحتفظ بـ ٦٠٪ من قيمتها بعد عشر سنين، في حين إن ماركة اقتصادية ممكن تتباع خردة في نفس المدة.
                </p>

                <h3>٢. الحالة الفنية والملحقات</h3>
                <p>
                    الماكينة اللي ممكن المعاينة تشوفها <em>"شغالة وتحت الكهربا"</em> (يعني متوصلة وتقدر تطلع حتة قدام المشتري) دايماً سعرها بيبقى أعلى—غالباً <strong>٢٠٪ لـ ٣٠٪ أكتر</strong> من ماكينة مركونة في مخزن ضلمة وكابلاتها مفصولة.
                </p>
                <p>
                    <strong>نصيحة صنايعي:</strong> هل هتبيع معاها العِدة، الكتالوجات، الشيلر، أو كمبروسر الهوا اللي بيشغلها؟ بيعهم كباكدج. نظام "شغل على طول" بيبقى مغري جداً لمشتري عايز يبدأ إنتاج فوراً من غير ما يلف على الملحقات.
                </p>

                <h3>٣. توفر البديل في السوق (الضربية)</h3>
                <p>
                    وقت أزمات سلاسل التوريد والاستيراد، الماكينة <em>الجديدة</em> من الوكيل ممكن تقعد ٨ لـ ١٢ شهر عشان توصل. لو عندك ماكينة بحالة كويسة وموجودة <em>النهاردة</em>، إنت اللي معاك الكارت الكسبان. في الظروف دي، ممكن تسعر ماكينة عمرها ٣ سنين بـ ٨٥٪ لـ ٩٠٪ من سعر الجديد لمجرد إن المشتري بيدفع عشان ينجز وميستناش الطابور.
                </p>

                <h2>إستراتيجية إنتاج لاب</h2>
                <p>
                    لما تنزل الماكينة بتاعتك على إنتاج لاب، الوضوح هو أحسن بياع ليك.
                </p>
                <ul>
                    <li><strong>حط سعر منطقي:</strong> بلاش "السعر بعد المعاينة" أو "أعلى سعر". المشترين بيتجاهلوا الإعلانات اللي من غير أسعار.</li>
                    <li><strong>صور التفاصيل:</strong> ارفع صور واضحة للوحة التحكم (عشان تبين عدد ساعات التشغيل)، ومن جوه الكابينة، وفيديو وهي شغالة.</li>
                    <li><strong>خليك صريح في العيوب:</strong> لو موتور محور الـ Z فيه رعشة، قول كده. المشترين متوقعين إن الاستعمال فيه استهلاك. الصراحة بتمنع فشل البيعة بعد ما المشتري يسافر عشان يعاين.</li>
                </ul>
            </>
        );
    }

    return (
        <>
            <p>
                Selling used industrial machinery is vastly different from selling a used car or consumer electronics. A CNC machine or an injection molding press is an income-producing asset. Therefore, its price isn't just about what you paid for it—it's about the value it can still generate for the next owner.
            </p>

            <p>
                Whether you are upgrading your equipment, liquidating a facility, or just clearing floor space, here is how you should think about pricing your idle machinery to attract serious buyers on <strong>Intaglab</strong>.
            </p>

            <h2>The Three Pillars of Machinery Valuation</h2>

            <p>Before you pick a number out of thin air, evaluate your machine across these three criteria:</p>

            <div className={styles.gaugeContainer}>
                <div className={`${styles.gaugeCard} ${styles.excellent}`}>
                    <div className={styles.gaugeTitle}>Age & Brand</div>
                    <div className={styles.gaugeValue}>Base</div>
                    <div className={styles.gaugeDesc}>Reputable Brands hold their value longer.</div>
                </div>
                <div className={`${styles.gaugeCard} ${styles.good}`}>
                    <div className={styles.gaugeTitle}>Condition</div>
                    <div className={styles.gaugeValue}>+ / -</div>
                    <div className={styles.gaugeDesc}>Maintained under power? Or stored outside?</div>
                </div>
                <div className={`${styles.gaugeCard} ${styles.fair}`}>
                    <div className={styles.gaugeTitle}>Current Demand</div>
                    <div className={styles.gaugeValue}>Multiplier</div>
                    <div className={styles.gaugeDesc}>Are wait times for new models long?</div>
                </div>
            </div>

            <br /><br />

            <h3>1. Age, Brand, and Original Cost (The Base)</h3>
            <p>
                As a general rule of thumb, most standard industrial machinery depreciates by <strong>10% to 15% in year one</strong>, and then roughly <strong>5% to 8% each year after</strong>. However, this curve changes wildly based on the brand. A highly respected German or Japanese CNC mill might hold 60% of its value ten years later, while a budget brand might be worth scrap metal in the same timeframe.
            </p>

            <h3>2. Technical Condition and Tooling</h3>
            <p>
                A machine that can be inspected <em>"under power"</em> (meaning it is hooked up to electricity and can be demonstrated) will always command a premium—often <strong>20% to 30% more</strong> than a machine sitting in a dark, unconnected warehouse.
            </p>
            <p>
                <strong>Pro Tip:</strong> Are you including the tooling, manuals, chillers, or air compressors that the machine needs to run? Bundle them. A "Plug-and-Play" system is highly attractive to a buyer who wants to start production immediately.
            </p>

            <h3>3. Market Availability (The Multiplier)</h3>
            <p>
                During supply chain crunches, the lead time to buy a <em>new</em> machine from the manufacturer might be 8 to 12 months. If you have a decent used machine available <em>today</em>, you temporarily hold the power. In these conditions, you can often price a 3-year-old machine at 85% to 90% of a new model's cost simply because the buyer is paying to skip the waiting line.
            </p>

            <h2>The Intaglab Strategy</h2>
            <p>
                When you list your machinery on Intaglab, transparency is your best salesperson.
            </p>
            <ul>
                <li><strong>List a Fair Asking Price:</strong> Don't list it as "Make Offer". Buyers ignore listings without prices.</li>
                <li><strong>Provide Media:</strong> Upload clear photos of the control panel (showing operating hours), the inside of the cabinet, and a video of it running.</li>
                <li><strong>Be Honest About Faults:</strong> If the Z-axis motor is shaky, say so. Buyers expect used equipment to have wear. Honesty prevents canceled deals after the buyer travels to inspect it.</li>
            </ul>
        </>
    );
}
