"use client";

import React from 'react';
import styles from './blogComponents.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function PricingSurplusArticle() {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    if (isRtl) {
        return (
            <>
                <p>
                    لو إنت صاحب مصنع، أكيد عارف الإحباط لما تلاقي عندك <strong>بواقي مصانع</strong> أو خامات زيادة. سواء كانت مواد خام مبقتش محتاجها، أو قطع غيار لماكينة بعتها، أو حتى ستوك زيادة من طلبية اتلغت—كل ده بياخد مساحة غالية في المخزن وبيجمّد سيولة المصنع.
                </p>

                <p>
                    بس الخبر الحلو: اللي إنت شايفه بضاعة راكدة ممكن يكون هو بالظبط اللي مصنع تاني بيدور عليه عشان خط إنتاجه ميقفش. السر في إنك تحرك البضاعة دي بسرعة هو <strong>تسعيرها صح</strong>.
                </p>

                <h2>القاعدة الذهبية في تسعير البواقي</h2>
                <p>
                    لما تيجي تسعر بواقي مصنعك، لازم تقرر إيه الأهم لشغلك دلوقتي: <em>استرجاع أكبر قيمة مالية</em> ولا <em>سرعة البيع والتسييل</em>.
                </p>

                {/* Infographic: Speed vs Value Scale */}
                <div className={styles.infographicBox}>
                    <h4 className={styles.infoTitle}>مؤشر تسعير البواقي</h4>
                    <div className={styles.scaleContainer}>
                        <div className={styles.scaleEnd}>
                            <span className={styles.scaleIcon}>⚡</span>
                            <strong>تسييل سريع</strong>
                            <small>تفضية المخزن فوراً</small>
                        </div>
                        <div className={styles.scaleTrack}>
                            <div className={styles.scaleNodes}>
                                <div className={`${styles.node} ${styles.selected}`}>
                                    <div className={styles.nodeLabelPrice}>-٦٠٪ لـ -٨٠٪</div>
                                    <div className={styles.nodePoint}></div>
                                    <div className={styles.nodeLabel}>تجار خردة وشروة</div>
                                </div>
                                <div className={styles.node}>
                                    <div className={styles.nodeLabelPrice}>-٤٠٪ لـ -٥٠٪</div>
                                    <div className={styles.nodePoint}></div>
                                    <div className={styles.nodeLabel}>تجار جملة</div>
                                </div>
                                <div className={styles.node}>
                                    <div className={styles.nodeLabelPrice}>-١٠٪ لـ -٣٠٪</div>
                                    <div className={styles.nodePoint}></div>
                                    <div className={styles.nodeLabel}>مصنع مباشر (مستخدم نهائي)</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.scaleEnd}>
                            <span className={styles.scaleIcon}>💰</span>
                            <strong>أقصى قيمة</strong>
                            <small>وقت انتظار أطول</small>
                        </div>
                    </div>
                </div>

                <h2>استراتيجيات تسعير بضاعتك</h2>

                <h3>١. استهدف المستخدم النهائي عشان تكسب أكتر</h3>
                <p>
                    لو عندك استعداد تستنى المشتري الصح، منصة زي إنتاج لاب بتوصلك بالمصانع التانية مباشرة. ولإنك بتشيل الوسطاء (اللي بيشتروا شروة وتجار الخردة)، ممكن تسعر بضاعتك بـ <strong>٧٠٪ لـ ٩٠٪ من سعر جملتها الأصلي</strong>.
                </p>

                <h3>٢. خصم "شيلة بيلة" (البيع بالكمية)</h3>
                <p>
                    عندك ٥٠٠ رمان بلي من مقاس معين؟ مع إنك ممكن تبيعهم عشرات وتكسب فيهم هامش أعلى، بس هتلاقي نفسك بتدير إعلانات وتشحن علب لشهور. بدال كده، اعمل خصم كبير <strong>٤٠٪</strong> بس اشترط إن المشتري ياخد اللوط كله على بعضه. ده بيشجع التجار الصغيرين اللي عاوزين يملوا رفوفهم باسعار منافسة.
                </p>

                <h3>٣. اعمل حساب تكلفة التخزين</h3>
                <p>
                    وإنت بتسعر، افتكر إن المساحة اللي واخدها الصنف ده بتكلفك فلوس كل شهر (إيجار، كهربا، تأمين). أحياناً، إنك تبيع الحاجة بخصم ٥٠٪ النهاردة بيطلع أحسن بالورقة والقلم من إنك تبيعها بـ ٨٠٪ من قيمتها كمان سنتين.
                </p>

                <h2>الخلاصة</h2>
                <p>
                    متسيبش بواقي الإنتاج تترب في المخزن. جمّع قوائم الجرد بتاعتك، صور أرقام القطع واضحة، ونزلها على إنتاج لاب. سعرها بخصم عادل مقارنة بالسعر الجديد، وهتلاقي نفسك بتحوّل البضاعة الراكدة دي لسيولة شغالة بسرعة.
                </p>
            </>
        );
    }

    return (
        <>
            <p>
                As a manufacturer, finding out you have excess or <strong>surplus inventory</strong> is frustrating. Whether it’s raw materials you no longer need, spare parts for a machine you sold, or overstock from a canceled order—it takes up valuable warehouse floor space and ties up your capital.
            </p>

            <p>
                But here's the good news: what is dead stock to you might be exactly what another factory is desperately searching for to prevent a line stoppage. The secret to moving this inventory quickly is <strong>pricing it right</strong>.
            </p>

            <h2>The Golden Rule of Surplus</h2>
            <p>
                When it comes to surplus, you have to decide what matters more to your business right now: <em>Value Recovery</em> or <em>Speed of Sale</em>.
            </p>

            {/* Infographic: Speed vs Value Scale */}
            <div className={styles.infographicBox}>
                <h4 className={styles.infoTitle}>The Surplus Pricing Scale</h4>
                <div className={styles.scaleContainer}>
                    <div className={styles.scaleEnd}>
                        <span className={styles.scaleIcon}>⚡</span>
                        <strong>Fast Liquidation</strong>
                        <small>Clear Space Now</small>
                    </div>
                    <div className={styles.scaleTrack}>
                        <div className={styles.scaleNodes}>
                            <div className={`${styles.node} ${styles.selected}`}>
                                <div className={styles.nodeLabelPrice}>-60% to -80%</div>
                                <div className={styles.nodePoint}></div>
                                <div className={styles.nodeLabel}>Scrap/Bulk Buyers</div>
                            </div>
                            <div className={styles.node}>
                                <div className={styles.nodeLabelPrice}>-40% to -50%</div>
                                <div className={styles.nodePoint}></div>
                                <div className={styles.nodeLabel}>Wholesale Dist.</div>
                            </div>
                            <div className={styles.node}>
                                <div className={styles.nodeLabelPrice}>-10% to -30%</div>
                                <div className={styles.nodePoint}></div>
                                <div className={styles.nodeLabel}>Direct Factory (End User)</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.scaleEnd}>
                        <span className={styles.scaleIcon}>💰</span>
                        <strong>Max Value</strong>
                        <small>Longer Wait Time</small>
                    </div>
                </div>
            </div>

            <h2>Strategies for Pricing Your Surplus</h2>

            <h3>1. Target End-Users for Maximum Return</h3>
            <p>
                If you are willing to wait for the right buyer, platforms like Intaglab connect you directly with other factories. Because you are cutting out the middleman (liquidators and scrap dealers), you can often price your goods at <strong>70% to 90% of their original wholesale cost</strong>.
            </p>

            <h3>2. The "Take-It-All" Discount</h3>
            <p>
                Do you have 500 bearings of a specific size? While you could sell them in packs of 10 for a higher margin, you will be managing listings and shipping boxes for months. Instead, offer a steep <strong>40% discount</strong> but require the buyer to take the entire lot. This appeals to smaller distributors looking to stock their own shelves.
            </p>

            <h3>3. Account for Storage Costs</h3>
            <p>
                When pricing, remember that the physical space the item occupies costs you money every month (rent, electricity, insurance). Sometimes, selling an item for 50% off today is mathematically better than selling it for 80% of its value in two years.
            </p>

            <h2>Conclusion</h2>
            <p>
                Don't let surplus inventory gather dust. Gather your inventory lists, take clear photos of the part numbers, and post them on Intaglab. Price them at a fair discount compared to buying new, and you'll quickly turn that dead stock back into working capital.
            </p>
        </>
    );
}
