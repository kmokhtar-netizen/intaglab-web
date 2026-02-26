"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
    images: string[];
    title: string;
    fallbackImage?: string;
}

export default function ImageGallery({ images, title, fallbackImage }: ImageGalleryProps) {
    const effectiveImages = (images && images.length > 0) ? images : (fallbackImage ? [fallbackImage] : []);
    const [mainImage, setMainImage] = useState(effectiveImages[0]);

    if (effectiveImages.length === 0) {
        return (
            <div className={styles.mainImageContainer}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    No Image Available
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImageContainer}>
                <AnimatePresence mode="wait">
                    <motion.img
                        key={mainImage}
                        src={mainImage}
                        alt={title}
                        className={styles.mainImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>
            </div>

            {effectiveImages.length > 1 && (
                <div className={styles.thumbnailStrip}>
                    {effectiveImages.map((img, index) => (
                        <div
                            key={index}
                            className={`${styles.thumbnail} ${mainImage === img ? styles.active : ''}`}
                            onClick={() => setMainImage(img)}
                        >
                            <img src={img} alt={`${title} thumbnail ${index + 1}`} className={styles.thumbImage} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
