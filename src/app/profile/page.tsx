"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, MessageSquare, Save, ArrowLeft, ArrowRight, MailX, Box } from "lucide-react";
import { doc, updateDoc, collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./page.module.css";
import Ripple from "@/components/common/Ripple";
import { formatDistanceToNow } from "date-fns";

type Tab = "details" | "messages" | "listings";

interface Message {
    id: string;
    senderName: string;
    subject: string;
    body: string;
    read: boolean;
    createdAt: any;
}

export default function ProfilePage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("details");

    // Profile Form State
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        companyName: "",
        industry: "",
        phone: "",
        needs: ""
    });

    // Messages State
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    // Listings State
    const [myListings, setMyListings] = useState<any[]>([]);
    const [isBoosting, setIsBoosting] = useState<string | null>(null);

    // Initial Auth Layout Protection
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Hydrate form data
    useEffect(() => {
        if (userData) {
            setFormData({
                displayName: userData.displayName || "",
                companyName: (userData as any).companyName || "",
                industry: (userData as any).industry || "",
                phone: (userData as any).phone || "",
                needs: (userData as any).needs || "",
            });
        }
    }, [userData]);

    // Fetch Messages
    useEffect(() => {
        if (!user?.uid) return;

        // NOTE: In production you would need a composite index for where("recipientId") + orderBy("createdAt"). 
        // For simplicity without index we just where() and then sort in memory.
        const q = query(
            collection(db, "messages"),
            where("recipientId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];

            // Sort by Date descending (newest first)
            msgs.sort((a, b) => {
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeB - timeA;
            });

            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch User Listings
    useEffect(() => {
        if (!user?.uid || activeTab !== 'listings') return;

        const q = query(
            collection(db, "products"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const fetchListings = async () => {
            try {
                const snap = await getDocs(q);
                const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMyListings(items);
            } catch (err) {
                console.error("Failed to load listings", err);
            }
        };

        fetchListings();
    }, [user, activeTab]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                companyName: formData.companyName,
                industry: formData.industry,
                phone: formData.phone,
                needs: formData.needs
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Error updating profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleMessageClick = async (msg: Message) => {
        setSelectedMessage(msg);

        // Mark as read if it is not
        if (!msg.read && user) {
            try {
                await updateDoc(doc(db, "messages", msg.id), { read: true });
            } catch (error) {
                console.error("Failed to mark message as read", error);
            }
        }
    };

    const handleBoostListing = async (productId: string, productTitle: string) => {
        setIsBoosting(productId);
        try {
            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, productTitle }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned", data);
                alert("Failed to initialize boost checkout. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setIsBoosting(null);
        }
    };

    if (loading || !user) {
        return <div className={styles.container}>Loading...</div>;
    }

    const isCompany = (userData as any)?.accountType === 'company';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Your Profile</h1>
                <p className={styles.subtitle}>Manage your settings, inventory needs, and messages.</p>
            </div>

            <div className={styles.content}>
                {/* Sidebar Navigation */}
                <div className={styles.sidebar}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'details' ? styles.tabActive : ''}`}
                        onClick={() => { setActiveTab('details'); setSelectedMessage(null); }}
                    >
                        <User size={18} className={styles.tabIcon} />
                        Profile Details
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'listings' ? styles.tabActive : ''}`}
                        onClick={() => { setActiveTab('listings'); setSelectedMessage(null); }}
                    >
                        <Box size={18} className={styles.tabIcon} />
                        My Listings
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.tabActive : ''}`}
                        onClick={() => { setActiveTab('messages'); setSelectedMessage(null); }}
                    >
                        <MessageSquare size={18} className={styles.tabIcon} />
                        Messages
                        {messages.filter(m => !m.read).length > 0 && (
                            <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                                {messages.filter(m => !m.read).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Main Panel Content */}
                <div className={styles.panel}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleProfileSubmit}>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Personal Information</h3>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Email Address</label>
                                            <input type="email" value={user.email || ""} readOnly />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Display Name</label>
                                            <input
                                                type="text"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>

                                        {isCompany && (
                                            <>
                                                <div className={styles.formGroup}>
                                                    <label>Company Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.companyName}
                                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Industry</label>
                                                    <input
                                                        type="text"
                                                        value={formData.industry}
                                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                            <label>Inventory Needs / Looking For</label>
                                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', marginTop: '-0.25rem' }}>
                                                Describe the type of surplus machinery, materials, or equipment you are actively seeking.
                                            </p>
                                            <textarea
                                                placeholder="e.g. We are looking for gently used packaging machinery (shrink wrappers, carton sealers) and surplus steel piping..."
                                                value={formData.needs}
                                                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ clear: 'both', overflow: 'hidden' }}>
                                        <button
                                            type="submit"
                                            className={styles.saveBtn}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        {saveSuccess && (
                                            <span className={styles.successMsg}>
                                                <Save size={16} /> Saved Successfully!
                                            </span>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'messages' && !selectedMessage && (
                            <motion.div
                                key="messagesList"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Your Inbox</h3>

                                {messages.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <MailX size={48} opacity={0.5} style={{ margin: "0 auto", marginBottom: "1rem" }} />
                                        <p>You have no messages yet.</p>
                                    </div>
                                ) : (
                                    <div className={styles.messagesList}>
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`${styles.messageItem} ${!msg.read ? styles.messageUnread : ''}`}
                                                onClick={() => handleMessageClick(msg)}
                                            >
                                                <div className={styles.msgHeader}>
                                                    <span className={styles.msgSender}>{msg.senderName}</span>
                                                    <span className={styles.msgDate}>
                                                        {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : ''}
                                                    </span>
                                                </div>
                                                <div className={styles.msgSubject}>{msg.subject}</div>
                                                <div className={styles.msgExcerpt}>{msg.body}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'messages' && selectedMessage && (
                            <motion.div
                                key="messageDetail"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button className={styles.backBtn} onClick={() => setSelectedMessage(null)}>
                                    <ArrowLeft size={16} /> Back to Inbox
                                </button>

                                <div className={styles.msgDetailHeader}>
                                    <h2 className={styles.msgDetailSubject}>{selectedMessage.subject}</h2>
                                    <div className={styles.msgDetailMeta}>
                                        <span>From: <strong style={{ color: 'white' }}>{selectedMessage.senderName}</strong></span>
                                        <span>{selectedMessage.createdAt ? new Date(selectedMessage.createdAt.toDate()).toLocaleString() : ''}</span>
                                    </div>
                                </div>

                                <div className={styles.msgDetailBody}>
                                    {selectedMessage.body}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'listings' && (
                            <motion.div
                                key="listingsTab"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>My Listings</h3>
                                    <button
                                        onClick={() => router.push('/sell')}
                                        style={{ padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                                    >
                                        Create New Post
                                    </button>
                                </div>

                                <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: '#6366f1', padding: '0.5rem', borderRadius: '50%', color: 'white' }}>
                                        <ArrowRight size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#a5b4fc' }}>Stand Out With a Boost</h4>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                            Boost your listing to place it at the top of the homepage. Featured listings also receive cross-platform social media promotion by the Intaglab team!
                                        </p>
                                    </div>
                                </div>

                                {myListings.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <Box size={48} opacity={0.5} style={{ margin: "0 auto", marginBottom: "1rem" }} />
                                        <p>You have not posted any listings yet.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {myListings.map(listing => (
                                            <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{listing.description_en || listing.description}</h4>
                                                        {listing.isFeatured && (
                                                            <span style={{ fontSize: '0.7rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 'bold' }}>FEATURED</span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Status: {listing.status || 'pending'}</span>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    {!listing.isFeatured && listing.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleBoostListing(listing.id, listing.description_en || listing.description)}
                                                            disabled={isBoosting === listing.id}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                opacity: isBoosting === listing.id ? 0.7 : 1
                                                            }}
                                                        >
                                                            {isBoosting === listing.id ? 'Processing...' : 'Boost ($15)'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
