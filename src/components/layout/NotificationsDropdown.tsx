"use client";

import React, { useState, useEffect, useRef } from "react";
import { collection, query, where, orderBy, onSnapshot, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Bell, CheckCircle, XCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import styles from "./NotificationsDropdown.module.css";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Notification {
    id: string;
    userId: string;
    type: "post_approved" | "post_rejected" | "system";
    title: string;
    message: string;
    read: boolean;
    createdAt: any;
    link?: string;
}

export default function NotificationsDropdown() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Listen for outside clicks to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Fetch real-time notifications for the authenticated user
    useEffect(() => {
        if (!user?.uid) {
            setNotifications([]);
            return;
        }

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Notification[];

            // Sort locally to avoid needing a composite index
            notifsData.sort((a, b) => {
                const aTime = a.createdAt?.toMillis() || 0;
                const bTime = b.createdAt?.toMillis() || 0;
                return bTime - aTime;
            });

            setNotifications(notifsData);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Mark all as read
    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            const batch = writeBatch(db);
            notifications.forEach((notif) => {
                if (!notif.read) {
                    const notifRef = doc(db, "notifications", notif.id);
                    batch.update(notifRef, { read: true });
                }
            });
            await batch.commit();
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    // Mark single notification as read
    const markAsRead = async (id: string, currentlyRead: boolean) => {
        if (currentlyRead) return;
        try {
            await writeBatch(db).update(doc(db, "notifications", id), { read: true }).commit();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "post_approved":
                return <CheckCircle size={18} className={styles.iconApproved} />;
            case "post_rejected":
                return <XCircle size={18} className={styles.iconRejected} />;
            default:
                return <Info size={18} className={styles.iconSystem} />;
        }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: language === "ar" ? ar : undefined,
        });
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={`${styles.bellButton} ${isOpen ? styles.bellButtonActive : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className={styles.header}>
                            <h3 className={styles.title}>{t("notifications.title")}</h3>
                            {unreadCount > 0 && (
                                <button className={styles.markReadBtn} onClick={markAllAsRead}>
                                    {t("notifications.markAllRead")}
                                </button>
                            )}
                        </div>

                        <div className={styles.list}>
                            {notifications.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Bell size={32} strokeWidth={1.5} opacity={0.5} />
                                    <p>{t("notifications.empty")}</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    // Parse the localized title based on type if needed, or use the stored title
                                    const localizedTitle =
                                        t(`notifications.types.${notif.type}`) !== `notifications.types.${notif.type}`
                                            ? t(`notifications.types.${notif.type}`)
                                            : notif.title;

                                    const content = (
                                        <>
                                            <div className={`${styles.itemIcon} ${notif.type === "post_approved" ? styles.iconApproved : notif.type === "post_rejected" ? styles.iconRejected : styles.iconSystem}`}>
                                                {notif.type === "post_approved" && <CheckCircle size={18} />}
                                                {notif.type === "post_rejected" && <XCircle size={18} />}
                                                {notif.type === "system" && <Info size={18} />}
                                            </div>
                                            <div className={styles.itemContent}>
                                                <h4 className={styles.itemTitle}>{localizedTitle}</h4>
                                                <p className={styles.itemMessage}>{notif.message}</p>
                                                <span className={styles.itemTime}>
                                                    {formatTime(notif.createdAt)}
                                                </span>
                                            </div>
                                        </>
                                    );

                                    return notif.link ? (
                                        <Link
                                            key={notif.id}
                                            href={notif.link}
                                            className={`${styles.item} ${!notif.read ? styles.itemUnread : ""}`}
                                            onClick={() => {
                                                markAsRead(notif.id, notif.read);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <div
                                            key={notif.id}
                                            className={`${styles.item} ${!notif.read ? styles.itemUnread : ""}`}
                                            onClick={() => markAsRead(notif.id, notif.read)}
                                        >
                                            {content}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
