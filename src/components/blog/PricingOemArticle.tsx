"use client";

import React from 'react';
import styles from './blogComponents.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function PricingOemArticle() {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    if (isRtl) {
        return (
            <>
                <p>
                    إنك تبيع خدمة تصنيع—زي شغل الـ CNC، أو حقن البلاستيك، أو تشكيل الصاج—بيختلف عن إنك تبيع منتج جاهز. إنت هنا بتبيع <em>وقت</em> من ماكيناتك، و<em>خبرة</em> الصنايعية والمهندسين اللي شغالين عليها، والالتزام بتنفيذ مواصفات العميل بالحرف.
                </p>

                <p>
                    لما عميل يكلمك على إنتاج لاب عشان توردله شغل مصنعيات (طاقة تشغيل للغير)، إزاي تسعر الشغلانة عشان تاخد الأوردر من غير ما تدفع من جيبك؟
                </p>

                <h2>الركائز الأربعة لتسعير الورش والمصانع</h2>
                <p>
                    أي تسعير مظبوط لشغلانة بيتقسم لأربع حاجات أساسية. وتجاهل أي واحدة فيهم هو أكتر سبب بيخلي الورش الصغيرة تخسر فلوس في الطلبيات الكبيرة.
                </p>

                <div className={styles.pieChartContainer} dir="ltr">
                    <div className={styles.pieCircle}>
                        <div className={styles.pieHole}>Quote</div>
                    </div>
                    <div className={styles.pieLegend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.c1}`}></div>
                            <span className={styles.legendText}>خامات</span>
                            <span className={styles.legendValue}>~40%</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.c2}`}></div>
                            <span className={styles.legendText}>مصنعيات</span>
                            <span className={styles.legendValue}>~30%</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.c3}`}></div>
                            <span className={styles.legendText}>مصاريف ثابتة</span>
                            <span className={styles.legendValue}>~15%</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.c4}`}></div>
                            <span className={styles.legendText}>هامش ربح</span>
                            <span className={styles.legendValue}>~15%</span>
                        </div>
                    </div>
                </div>

                <br />
                <h3>١. الخامات الأول</h3>
                <p>
                    دي أسهل حاجة تتصلصل. إيه التكلفة المباشرة للألومنيوم، أو الصلب، أو بلاستيك الـ ABS اللي محتاجه الشغل؟
                    <strong>نقطة محورية:</strong> دايماً اعمل حساب <em>نسبة الهالك والخردة</em>. لو بتأكل من بلوك ألومنيوم عالمخرطة، إنت بتحاسب على البلوك كله، مش وزن القطعة النهائية بس. اتأكد إن تسعيرك بيغطي وزن الرايش اللي هتكنسه من على الأرض.
                </p>

                <h3>٢. المصنعية المباشرة ووقت التجهيز</h3>
                <p>
                    التشغيل مش بس وقت دوران الماكينة. ده بيشمل المهندس اللي بيكتب الـ G-code، والعامل اللي بيركب الشواكيش والدلايل، ومراقب الجودة اللي بيقيس السماحات.
                    لو هياخد منك ساعتين تجهيز للماكينة عشان تركب استمبة بتعمل ١٠ حتت، الساعتين دول تكلفتهم بتتوزع أسهل بكتير لو هتعمل ١٠,٠٠٠ حتة. عشان كده لازم تحدد <strong>حد أدنى للكمية (MOQ)</strong>.
                </p>

                <h3>٣. المصاريف الثابتة / الهالك الخفي (Overhead)</h3>
                <p>
                    ماكيناتك بتسحب كهربا، مخزنك لتدفع إيجار، وعدد القطع بتتاكل وعايزة تتغير. دي كلها مصاريف غير مباشرة. معظم الورش الكبيرة بتحسب <em>"ساعة التشغيل في الورشة"</em> اللي بتلم فيها المصاريف دي على كل ساعة الماكينة شغالة فيها بتنتج.
                    لو الفريزة הـ 5-axis بتاعتك بتكلفك ٤٠ دولار في الساعة إيجار وكهربا وعدد عشان بس تفضل مكانها، لازم تحمّل الـ ٤٠ دولار دول عالساعة عشان بس تغطي مصاريفك، من قبل ما تحسب أي مكسب.
                </p>

                <h3>٤. هامش الربح</h3>
                <p>
                    بمجرد ما تحسب الخامات والمصنعيات والمصاريف الثابتة، إنت كده وصلت لـ <strong>نقطة التعادل (Break-Even)</strong>. كل قرش بعد كده هو هامش ربحك.
                    هوامش التصنيع بتختلف جداً حسب الصناعة، بس عادة بتكون من <strong>١٠٪ لـ ٢٥٪</strong>. لو شغال في قطع غيار طيران معقدة وفيها سماحات دقيقة جداً، الربح لازم يكون أعلى كتير عشان يغطي مخاطرة إن قطعة غالية تبوظ. بس لو بتشكّل صاج عادي، ربحك هيبقى أقرب للـ ١٠٪ عشان تفضل منافس في السوق.
                </p>

                <h2>اعرض خدماتك على إنتاج لاب</h2>
                <p>
                    استخدم قسم خدمات التصنيع أو الـ OEM عشان تعرض إمكانيات ورشتك. خليك صريح ومحدد في أبعاد الماكينات القصوى والسماحات اللي تقدر تجيبها. ولما عميل يتواصل معاك، استخدم نظام الـ ٤ ركائز ده عشان تديله تسعيرة احترافية ومكسبة في أسرع وقت!
                </p>
            </>
        );
    }

    return (
        <>
            <p>
                Selling a manufacturing service—like CNC machining, injection molding, or sheet metal fabrication—is different from selling a physical product. You are selling <em>time</em> on your machines, the <em>expertise</em> of your operators, and exactly matching a customer's requested specifications.
            </p>

            <p>
                When a buyer on Intaglab approaches you for a subcontracting quote, how do you determine a price that wins the bid without digging into your own pockets?
            </p>

            <h2>The Four Pillars of Job Shop Pricing</h2>
            <p>
                A standard job quote is broken down into four distinct categories. Missing one of these is the most common reason small shops lose money on big orders.
            </p>

            <div className={styles.pieChartContainer} dir="ltr">
                <div className={styles.pieCircle}>
                    <div className={styles.pieHole}>Quote</div>
                </div>
                <div className={styles.pieLegend}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.c1}`}></div>
                        <span className={styles.legendText}>Materials</span>
                        <span className={styles.legendValue}>~40%</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.c2}`}></div>
                        <span className={styles.legendText}>Labor</span>
                        <span className={styles.legendValue}>~30%</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.c3}`}></div>
                        <span className={styles.legendText}>Overhead</span>
                        <span className={styles.legendValue}>~15%</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.c4}`}></div>
                        <span className={styles.legendText}>Profit Margin</span>
                        <span className={styles.legendValue}>~15%</span>
                    </div>
                </div>
            </div>

            <br />
            <h3>1. Materials First</h3>
            <p>
                This is the easiest to calculate. What is the raw cost of the aluminum, steel, or ABS plastic required to fulfill the order?
                <strong>Crucial Step:</strong> Always factor in <em>scrap rates</em>. If you are milling a block of aluminum, you are paying for the whole block, not just the finished part. Ensure your quote covers the weight of the material you will sweep off the floor as chips.
            </p>

            <h3>2. Direct Labor & Setup Time</h3>
            <p>
                Labor isn't just the time the machine is running. It includes the engineer programming the G-code, the operator setting up the jigs and fixtures, and the QA inspector verifying tolerances.
                If it takes 2 hours to set up a machine for a run of 10 parts, that setup cost is spread thinly compared to a run of 10,000 parts. This is why you must establish a <strong>Minimum Order Quantity (MOQ)</strong>.
            </p>

            <h3>3. Overhead (The Hidden Killer)</h3>
            <p>
                Your machines consume electricity, your warehouse requires rent, and your cutting tools wear down and need replacing. These are indirect costs. Most shops calculate an <em>"Hourly Shop Rate"</em> that absorbs these costs into every hour a machine runs.
                If your 5-axis mill costs $40/hour in rent, power, and tooling wear to sit there, you must charge $40/hour just to break even on the machine's existence.
            </p>

            <h3>4. Profit Margin</h3>
            <p>
                Once you calculate Materials, Labor, and Overhead, you have found your <strong>Break-Even Point</strong>. Everything above that is your profit margin.
                Standard manufacturing margins vary wildly by industry, but typically range from <strong>10% to 25%</strong>. If you are doing highly complex aerospace work with tight tolerances, your margin should be much higher to account for the risk of scrapping an expensive part. If you bend standard sheet metal brackets, your margin will be closer to 10% to stay competitive.
            </p>

            <h2>Listing Your Services on Intaglab</h2>
            <p>
                Use the OEM section of Intaglab to list your shop's capabilities. Be specific about your machine envelopes (max part size) and tolerances. When a buyer reaches out, use this 4-pillar framework to generate a professional, profitable quote quickly!
            </p>
        </>
    );
}
