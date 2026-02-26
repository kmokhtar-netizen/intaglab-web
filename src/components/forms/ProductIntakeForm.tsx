"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, Loader2, Shield } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CITIES, CATEGORIES, MANUFACTURING_SERVICES, MATERIALS, EGYPT_CITIES_LIST, CATEGORIES_LIST, MATERIALS_LIST } from '@/lib/constants';
import styles from './ProductIntakeForm.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Ripple from '@/components/common/Ripple';

interface ProductImage {
    file: File;
    preview: string;
}

interface ProductIntakeFormProps {
    initialType?: string;
    onBack?: () => void;
}

export default function ProductIntakeForm({ initialType = 'Surplus', onBack }: ProductIntakeFormProps) {
    const { t } = useLanguage();
    const { isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        listingType: initialType, // 'Surplus', 'Machinery', 'OEM'
        description: '',
        videoUrl: '',
        mfgDate: '',
        warranty: '',
        terms: '',
        delivery: '',
        quantity: '',
        unitMetric: 'Pieces', // For assets
        condition: 'unused',
        location: 'cairo',
        category: 'heavy_machinery', // For assets
        serviceType: 'CNC Machining', // For OEM
        price: '',
        currency: 'EGP',
        capabilities: '',
        materials: '', // Comma separated for now
        certifications: '',
        capacity: '', // e.g. 500 units/week
        moq: '',
        leadTime: '',
    });
    const [images, setImages] = useState<ProductImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeSelect = (type: string) => {
        setFormData(prev => ({
            ...prev,
            listingType: type,
            // Reset strict fields based on type if needed, but keeping state is usually fine
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (formRef.current && !formRef.current.checkValidity()) {
            setError(t('sell.validationError') || 'Please fill out all required fields.');
            formRef.current.reportValidity();
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // 1. Upload Images
            const imageUrls = await Promise.all(
                images.map(async (img) => {
                    const storageRef = ref(storage, `products/${Date.now()}_${img.file.name}`);
                    const snapshot = await uploadBytes(storageRef, img.file);
                    return await getDownloadURL(snapshot.ref);
                })
            );

            // 2. Auto-Translate Text Fields
            // Helper to translate a field if it exists
            const translateField = async (text: string, currentLang: string = 'en') => {
                if (!text) return { en: '', ar: '' };
                const targetLang = currentLang === 'en' ? 'ar' : 'en';
                try {
                    const res = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text, targetLang })
                    });
                    const data = await res.json();
                    if (data.translatedText) {
                        return {
                            [currentLang]: text,
                            [targetLang]: data.translatedText
                        };
                    }
                } catch (err) {
                    console.error("Translation failed", err);
                }
                // Fallback: both are same
                return { en: text, ar: text };
            };

            const descriptionTrans = await translateField(formData.description);
            const termsTrans = await translateField(formData.terms);
            const warrantyTrans = await translateField(formData.warranty);
            const deliveryTrans = await translateField(formData.delivery);

            // 3. Prepare Payload based on Type
            const payload: any = {
                listingType: formData.listingType,
                videoUrl: formData.videoUrl,
                isVerified: !!formData.videoUrl,

                // Store localized fields
                description_en: descriptionTrans.en,
                description_ar: descriptionTrans.ar,
                terms_en: termsTrans.en,
                terms_ar: termsTrans.ar,
                warranty_en: warrantyTrans.en,
                warranty_ar: warrantyTrans.ar,
                delivery_en: deliveryTrans.en,
                delivery_ar: deliveryTrans.ar,

                // Fallbacks for backward compatibility / simple display
                description: descriptionTrans.en,
                terms: termsTrans.en,
                warranty: warrantyTrans.en,
                delivery: deliveryTrans.en,

                location: formData.location, // Normalized key or En val
                images: imageUrls,
                createdAt: serverTimestamp(),
                status: isAdmin ? 'approved' : 'pending', // Auto-approve for admins
                price: formData.price,
                currency: formData.currency,
            };

            if (formData.listingType === 'OEM') {
                // Service Specific Fields
                payload.serviceType = formData.serviceType;
                payload.capabilities = formData.capabilities;
                // For simplified demo, duplicating capabilities if not translated
                payload.capabilities_en = formData.capabilities;
                payload.capabilities_ar = formData.capabilities;

                payload.materials = formData.materials;
                payload.certifications = formData.certifications;
                payload.capacity = formData.capacity;
                payload.moq = formData.moq;
                payload.leadTime = formData.leadTime;
            } else {
                // Asset Specific Fields
                payload.category = formData.category; // Ensure this is the KEY
                payload.mfgDate = formData.mfgDate;
                payload.condition = formData.condition; // Ensure this is the KEY
                payload.quantity = formData.quantity;
                payload.unitMetric = formData.unitMetric;
            }

            // 4. Save to Firestore
            await addDoc(collection(db, 'products'), payload);

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({
                    listingType: 'Surplus',
                    description: '',
                    videoUrl: '',
                    mfgDate: '',
                    warranty: '',
                    terms: '',
                    delivery: '',
                    quantity: '',
                    unitMetric: 'Pieces',
                    condition: 'unused', // Default key
                    location: 'cairo', // Default key
                    category: 'heavy_machinery', // Default key
                    serviceType: 'CNC Machining',
                    price: '',
                    currency: 'EGP',
                    capabilities: '',
                    materials: '',
                    certifications: '',
                    capacity: '',
                    moq: '',
                    leadTime: '',
                });
                setImages([]);
            }, 3000);

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong. Please check your Firebase configuration and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.container}
                style={{ textAlign: 'center', padding: '4rem 2rem' }}
            >
                <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
                <h2 className={styles.title}>{t('sell.successTitle')}</h2>
                <p className={styles.subtitle}>{t('sell.successDesc')}</p>
            </motion.div>
        );
    }

    const isOEM = formData.listingType === 'OEM';

    return (
        <div className={styles.container}>
            {onBack && (
                <button
                    onClick={onBack}
                    className={styles.backButton}
                    style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    ← {t('common.backHome') || 'Back'}
                </button>
            )}
            <h1 className={`${styles.title} gradient-text`}>{t('sell.title')}</h1>
            <p className={styles.subtitle}>{t('sell.subtitle')}</p>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* LISTING TYPE SELECTOR */}
                <div className={styles.typeSelector}>
                    {['Surplus', 'Machinery', 'OEM'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={`${styles.typeBtn} ${formData.listingType === type ? styles.typeBtnActive : ''}`}
                            onClick={() => handleTypeSelect(type)}
                        >
                            {type === 'OEM' ? t('sell.types.oem') : type === 'Machinery' ? t('sell.types.machinery') : t('sell.types.surplus')}
                        </button>
                    ))}
                </div>

                <div className={styles.section}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            {isOEM ? t('sell.labels.serviceDesc') : t('sell.labels.description')}
                            <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                        </label>
                        <textarea
                            name="description"
                            className={styles.textarea}
                            placeholder={isOEM ? t('sell.placeholders.serviceDesc') : t('sell.placeholders.description')}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {isOEM ? (
                        /* OEM SPECIFIC FIELDS */
                        <>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.serviceType')}
                                        <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                    </label>
                                    <select
                                        name="serviceType"
                                        className={styles.select}
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {Object.entries(MANUFACTURING_SERVICES).map(([key, label]) => (
                                            <option key={key} value={key}>{t(`services.${key}`) || label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.materials')}
                                        <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="materials"
                                        className={styles.input}
                                        placeholder={t('sell.placeholders.materials')}
                                        value={formData.materials}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>
                                    {t('sell.labels.capabilities')}
                                    <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                </label>
                                <textarea
                                    name="capabilities"
                                    className={styles.textarea}
                                    placeholder={t('sell.placeholders.capabilities')}
                                    value={formData.capabilities}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.capacity')}
                                        <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="capacity"
                                        className={styles.input}
                                        placeholder={t('sell.placeholders.capacity')}
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.certifications')}
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="certifications"
                                        className={styles.input}
                                        placeholder={t('sell.placeholders.certifications')}
                                        value={formData.certifications}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.moq')}
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="moq"
                                        className={styles.input}
                                        placeholder={t('sell.placeholders.moq')}
                                        value={formData.moq}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.leadTime')}
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="leadTime"
                                        className={styles.input}
                                        placeholder={t('sell.placeholders.leadTime')}
                                        value={formData.leadTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ASSET SPECIFIC FIELDS */
                        <>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.category')}
                                        <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                    </label>
                                    <select
                                        name="category"
                                        className={styles.select}
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {Object.entries(CATEGORIES).map(([key, label]) => (
                                            <option key={key} value={key}>{t(`categories.${key}`) || label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.mfgDate')}
                                        {formData.listingType === 'Machinery' ? (
                                            <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                        ) : (
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                                        )}
                                    </label>
                                    <input
                                        type="date"
                                        name="mfgDate"
                                        className={styles.input}
                                        value={formData.mfgDate}
                                        onChange={handleInputChange}
                                        required={formData.listingType === 'Machinery'}
                                    />
                                </div>
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.quantity')}
                                        <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="number"
                                            name="quantity"
                                            className={styles.input}
                                            placeholder={t('sell.placeholders.quantity')}
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <select
                                            name="unitMetric"
                                            className={styles.select}
                                            value={formData.unitMetric}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Pieces">{t('sell.units.pieces')}</option>
                                            <option value="KG">{t('sell.units.kg')}</option>
                                            <option value="Tons">{t('sell.units.tons')}</option>
                                            <option value="Hours">{t('sell.units.hours')}</option>
                                            <option value="Job">{t('sell.units.job')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>
                                        {t('sell.labels.condition')}
                                        <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                                    </label>
                                    <select
                                        name="condition"
                                        className={styles.select}
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="unused">{t('conditions.unused')}</option>
                                        <option value="used">{t('conditions.used')}</option>
                                        <option value="refurbished">{t('conditions.refurbished')}</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* COMMON FIELDS START */}
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {isOEM ? t('sell.labels.rate') : t('sell.labels.price')}
                                <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    name="price"
                                    className={styles.input}
                                    placeholder={t('sell.placeholders.price')}
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select
                                    name="currency"
                                    className={styles.select}
                                    style={{ width: '80px' }}
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                >
                                    <option value="EGP">{t('currencies.EGP') || "EGP"}</option>
                                    <option value="USD">{t('currencies.USD') || "USD"}</option>
                                    <option value="EUR">{t('currencies.EUR') || "EUR"}</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t('sell.labels.location')}
                                <span style={{ color: '#ef4444' }}>{t('sell.labels.required')}</span>
                            </label>
                            <select
                                name="location"
                                className={styles.select}
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            >
                                {Object.entries(CITIES).map(([key, label]) => (
                                    <option key={key} value={key}>{t(`cities.${key}`) || label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {isOEM ? t('sell.labels.serviceGuarantee') : t('sell.labels.warranty')}
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                            </label>
                            <input
                                type="text"
                                name="warranty"
                                className={styles.input}
                                placeholder={isOEM ? t('sell.placeholders.serviceGuarantee') : t('sell.placeholders.warranty')}
                                value={formData.warranty}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t('sell.labels.delivery')}
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                            </label>
                            <input
                                type="text"
                                name="delivery"
                                className={styles.input}
                                placeholder={t('sell.placeholders.delivery')}
                                value={formData.delivery}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            {t('sell.labels.terms')}
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.labels.optional')}</span>
                        </label>
                        <input
                            type="text"
                            name="terms"
                            className={styles.input}
                            placeholder={t('sell.placeholders.terms')}
                            value={formData.terms}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    {!isOEM && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px dashed rgba(99, 102, 241, 0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#a5b4fc' }}>
                                <Shield size={20} />
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{t('sell.labels.videoRequirementsTitle')}</h4>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '1.25rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                                {t('sell.labels.videoRequirementsDesc')}
                            </p>
                            <div className={styles.inputGroup} style={{ margin: 0 }}>
                                <input
                                    type="url"
                                    name="videoUrl"
                                    className={styles.input}
                                    placeholder="https://youtube.com/..."
                                    value={formData.videoUrl}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}

                    <label className={styles.label}>
                        {t('sell.labels.images')}
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', fontWeight: 'normal' }}>{t('sell.optional')}</span>
                    </label>
                    <div
                        className={styles.uploadZone}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className={styles.uploadIcon} size={40} />
                        <p>{t('sell.placeholders.upload')}</p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>

                    <AnimatePresence>
                        {images.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={styles.previewGrid}
                            >
                                {images.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={styles.previewItem}
                                    >
                                        <img src={img.preview} alt="Preview" className={styles.previewImage} />
                                        <button
                                            type="button"
                                            className={styles.removeImage}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" style={{ marginRight: '0.5rem', display: 'inline' }} />
                            {t('sell.submitting')}
                        </>
                    ) : t('sell.submit')}
                    <Ripple />
                </button>
            </form>
        </div>
    );
}
