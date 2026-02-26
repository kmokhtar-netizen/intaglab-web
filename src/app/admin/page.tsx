"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
    collection, query, where, getDocs, getCountFromServer, orderBy, limit,
    doc, updateDoc, serverTimestamp
} from "firebase/firestore";
import {
    Loader2, Clock, CheckCircle, Users as UsersIcon, Shield,
    Check, X, FileText, ArrowRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORY_IMAGES } from "@/lib/constants";
import styles from "./admin.module.css";

interface RecentPost {
    id: string;
    description: string;
    description_en?: string;
    category?: string;
    images: string[];
    createdAt?: any;
    listingType: string;
    price: string;
    currency: string;
    status: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ pending: 0, approved: 0, users: 0, admins: 0 });
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsRef = collection(db, "products");
                const usersRef = collection(db, "users");

                const [pendingSnap, approvedSnap, usersSnap, adminsSnap] = await Promise.all([
                    getCountFromServer(query(productsRef, where("status", "==", "pending"))),
                    getCountFromServer(query(productsRef, where("status", "==", "approved"))),
                    getCountFromServer(usersRef),
                    getCountFromServer(query(usersRef, where("role", "==", "admin")))
                ]);

                setStats({
                    pending: pendingSnap.data().count,
                    approved: approvedSnap.data().count,
                    users: usersSnap.data().count,
                    admins: adminsSnap.data().count
                });

                // Fetch recent pending posts
                const recentQuery = query(
                    productsRef,
                    where("status", "==", "pending"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const recentSnap = await getDocs(recentQuery);
                const posts: RecentPost[] = [];
                recentSnap.forEach((d) => {
                    posts.push({ id: d.id, ...d.data() } as RecentPost);
                });
                setRecentPosts(posts);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleQuickAction = async (postId: string, newStatus: "approved" | "rejected") => {
        setProcessingId(postId);
        try {
            await updateDoc(doc(db, "products", postId), {
                status: newStatus,
                reviewedBy: user?.uid,
                reviewedAt: serverTimestamp()
            });
            setRecentPosts(prev => prev.filter(p => p.id !== postId));
            setStats(prev => ({
                ...prev,
                pending: prev.pending - 1,
                approved: newStatus === "approved" ? prev.approved + 1 : prev.approved
            }));
        } catch (error) {
            console.error("Error updating post:", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loaderWrap}>
                <Loader2 className={styles.spinner} size={36} style={{ animation: "spin 1s linear infinite" }} />
            </div>
        );
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p className={styles.pageSubtitle}>Platform overview and quick actions</p>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.statIconYellow}`}>
                        <Clock size={22} />
                    </div>
                    <div>
                        <div className={styles.statLabel}>Pending Posts</div>
                        <div className={styles.statValue}>{stats.pending}</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.statIconGreen}`}>
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <div className={styles.statLabel}>Active Listings</div>
                        <div className={styles.statValue}>{stats.approved}</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.statIconBlue}`}>
                        <UsersIcon size={22} />
                    </div>
                    <div>
                        <div className={styles.statLabel}>Total Users</div>
                        <div className={styles.statValue}>{stats.users}</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.statIconPurple}`}>
                        <Shield size={22} />
                    </div>
                    <div>
                        <div className={styles.statLabel}>Admins</div>
                        <div className={styles.statValue}>{stats.admins}</div>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className={styles.dashboardGrid}>
                {/* Recent Pending Posts */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Pending Review</span>
                        <Link href="/admin/posts" className={styles.cardLink}>
                            View all <ArrowRight size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                        </Link>
                    </div>
                    <div className={styles.cardBody}>
                        {recentPosts.length === 0 ? (
                            <div className={styles.emptyState}>No posts pending review</div>
                        ) : (
                            recentPosts.map(post => (
                                <div key={post.id} className={styles.recentPostItem}>
                                    <img
                                        src={(post.images?.length > 0) ? post.images[0] : (CATEGORY_IMAGES[post.category || "other"] || CATEGORY_IMAGES.other)}
                                        alt=""
                                        className={styles.recentPostImage}
                                    />
                                    <div className={styles.recentPostInfo}>
                                        <div className={styles.recentPostTitle}>
                                            {post.description_en || post.description}
                                        </div>
                                        <div className={styles.recentPostMeta}>
                                            {post.listingType} · {post.price} {post.currency}
                                        </div>
                                    </div>
                                    <div className={styles.recentPostActions}>
                                        <button
                                            className={styles.actionBtnApprove}
                                            onClick={() => handleQuickAction(post.id, "approved")}
                                            disabled={processingId === post.id}
                                            title="Approve"
                                        >
                                            {processingId === post.id ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                                        </button>
                                        <button
                                            className={styles.actionBtnReject}
                                            onClick={() => handleQuickAction(post.id, "rejected")}
                                            disabled={processingId === post.id}
                                            title="Reject"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Quick Actions</span>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.quickActionsList}>
                            <Link href="/admin/posts" className={styles.quickAction}>
                                <div className={`${styles.quickActionIcon} ${styles.statIconYellow}`}>
                                    <FileText size={18} />
                                </div>
                                Review Pending Posts
                                {stats.pending > 0 && (
                                    <span className={styles.navBadge}>{stats.pending}</span>
                                )}
                            </Link>
                            <Link href="/admin/users" className={styles.quickAction}>
                                <div className={`${styles.quickActionIcon} ${styles.statIconBlue}`}>
                                    <UsersIcon size={18} />
                                </div>
                                Manage Users
                            </Link>
                            <Link href="/sell" className={styles.quickAction}>
                                <div className={`${styles.quickActionIcon} ${styles.statIconGreen}`}>
                                    <CheckCircle size={18} />
                                </div>
                                Create New Listing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
