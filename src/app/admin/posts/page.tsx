"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection, query, where, getDocs, doc, updateDoc, deleteDoc,
    orderBy, serverTimestamp, addDoc
} from "firebase/firestore";
import {
    Loader2, Check, X, ExternalLink, Search, Trash2, Eye
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CATEGORY_IMAGES, CATEGORIES, CITIES } from "@/lib/constants";
import styles from "../admin.module.css";

type PostStatus = "pending" | "approved" | "rejected";

interface Product {
    id: string;
    description: string;
    description_en?: string;
    description_ar?: string;
    status: PostStatus;
    images: string[];
    createdAt?: any;
    listingType: string;
    category?: string;
    price: string;
    currency: string;
    location?: string;
    condition?: string;
    quantity?: string;
    unitMetric?: string;
    mfgDate?: string;
    warranty?: string;
    warranty_en?: string;
    delivery?: string;
    delivery_en?: string;
    terms?: string;
    terms_en?: string;
    reviewedBy?: string;
    reviewedAt?: any;
    isFeatured?: boolean;
}

export default function AdminPostsPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<PostStatus>("pending");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const [detailPost, setDetailPost] = useState<Product | null>(null);
    const [rejectPost, setRejectPost] = useState<Product | null>(null);
    const [rejectionReason, setRejectionReason] = useState("incomplete_details");
    const [customReason, setCustomReason] = useState("");


    const fetchPosts = async () => {
        setLoading(true);
        setSelectedIds(new Set());
        try {
            const q = query(
                collection(db, "products"),
                where("status", "==", filter),
                orderBy("createdAt", "desc")
            );
            const snap = await getDocs(q);
            const fetched: Product[] = [];
            snap.forEach((d) => {
                fetched.push({ id: d.id, ...d.data() } as Product);
            });
            setPosts(fetched);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const handleStatusUpdate = async (product: Product, newStatus: PostStatus, reason?: string) => {
        setProcessingId(product.id);
        try {
            const updateData: any = {
                status: newStatus,
                reviewedBy: user?.uid,
                reviewedAt: serverTimestamp(),
            };
            if (reason && newStatus === "rejected") {
                updateData.rejectionReason = reason;
            }

            // 1. Update Product
            await updateDoc(doc(db, "products", product.id), updateData);

            // 2. Create In-App Notification
            const title = newStatus === "approved"
                ? "notifications.types.post_approved"
                : "notifications.types.post_rejected";

            const message = newStatus === "approved"
                ? `Your listing '${product.description_en || product.description}' has been approved and is now live.`
                : `Your listing '${product.description_en || product.description}' was not approved. Reason: ${reason}`;

            // (Assuming product.userId exists, typically seller's uid)
            // If the schema doesn't have userId, this will be skipped or silent failure (no rules break).
            // We should ensure products are saved with a userId going forward if not already.
            const ownerId = (product as any).userId || (product as any).sellerId || "unknown";

            if (ownerId !== "unknown") {
                await addDoc(collection(db, "notifications"), {
                    userId: ownerId,
                    type: newStatus === "approved" ? "post_approved" : "post_rejected",
                    title,
                    message,
                    read: false,
                    createdAt: serverTimestamp(),
                    link: `/admin/posts` // Or product link if approved
                });

                // 3. Create Email Trigger Doc
                // To trigger an email, we need the user's email address. Assuming it's stored on product
                // or we could fetch the user doc here. For now, if user details exist on product:
                const ownerEmail = (product as any).userEmail || (product as any).contactEmail;
                if (ownerEmail) {
                    await addDoc(collection(db, "mail"), {
                        to: ownerEmail,
                        message: {
                            subject: newStatus === "approved" ? "Listing Approved - Intaglab" : "Listing Needs Attention - Intaglab",
                            html: `
                                <h2>Listing ${newStatus === "approved" ? "Approved" : "Needs Attention"}</h2>
                                <p>Hello,</p>
                                <p>${message}</p>
                                <br/>
                                <p>Thank you,</p>
                                <p>Intaglab Team</p>
                            `
                        }
                    });
                }
            }

            setPosts((prev) => prev.filter((p) => p.id !== product.id));
            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
            setRejectPost(null);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Permanently delete this post? This cannot be undone.")) return;
        setProcessingId(productId);
        try {
            await deleteDoc(doc(db, "products", productId));
            setPosts((prev) => prev.filter((p) => p.id !== productId));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete post");
        } finally {
            setProcessingId(null);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredPosts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredPosts.map((p) => p.id)));
        }
    };

    const handleBulkAction = async (newStatus: PostStatus) => {
        if (selectedIds.size === 0) return;
        const action = newStatus === "approved" ? "approve" : "reject";
        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${selectedIds.size} post(s)?`)) return;

        setBulkProcessing(true);
        try {
            await Promise.all(
                Array.from(selectedIds).map((id) =>
                    updateDoc(doc(db, "products", id), {
                        status: newStatus,
                        reviewedBy: user?.uid,
                        reviewedAt: serverTimestamp(),
                    })
                )
            );
            setPosts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
            setSelectedIds(new Set());
        } catch (error) {
            console.error("Bulk action error:", error);
            alert("Some updates failed");
        } finally {
            setBulkProcessing(false);
        }
    };

    const filteredPosts = posts.filter((p) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (p.description_en || p.description || "").toLowerCase().includes(term) ||
            (p.category || "").toLowerCase().includes(term) ||
            (p.listingType || "").toLowerCase().includes(term)
        );
    });

    const getCategoryLabel = (key?: string) => {
        if (!key) return "—";
        return (CATEGORIES as Record<string, string>)[key] || key;
    };

    const getLocationLabel = (key?: string) => {
        if (!key) return "—";
        return (CITIES as Record<string, string>)[key] || key;
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Post Moderation</h1>
                <p className={styles.pageSubtitle}>Review, approve, and manage product listings</p>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.filterPills}>
                    {(["pending", "approved", "rejected"] as PostStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`${styles.filterPill} ${filter === status ? styles.filterPillActive : ""}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {filter === "pending" && selectedIds.size > 0 && (
                    <div className={styles.toolbarActions}>
                        <button
                            onClick={() => handleBulkAction("approved")}
                            disabled={bulkProcessing}
                            className={`${styles.bulkBtn} ${styles.bulkBtnApprove}`}
                        >
                            <Check size={14} />
                            Approve ({selectedIds.size})
                        </button>
                        {/* Bulk Reject removed to enforce specific rejection reasons */}
                    </div>
                )}
            </div>

            {/* Select All */}
            {filter === "pending" && filteredPosts.length > 0 && (
                <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                        type="checkbox"
                        checked={selectedIds.size === filteredPosts.length && filteredPosts.length > 0}
                        onChange={toggleSelectAll}
                        style={{ accentColor: "#8b5cf6" }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        Select all ({filteredPosts.length})
                    </span>
                </div>
            )}

            {/* Posts List */}
            {loading ? (
                <div className={styles.loaderWrap}>
                    <Loader2 className={styles.spinner} size={36} style={{ animation: "spin 1s linear infinite" }} />
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className={styles.card}>
                    <div className={styles.emptyState}>
                        {searchTerm ? `No results for "${searchTerm}"` : `No ${filter} posts found.`}
                    </div>
                </div>
            ) : (
                <div className={styles.postsList}>
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className={`${styles.postCard} ${selectedIds.has(post.id) ? styles.postCardSelected : ""}`}
                        >
                            {filter === "pending" && (
                                <div className={styles.postCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(post.id)}
                                        onChange={() => toggleSelect(post.id)}
                                    />
                                </div>
                            )}

                            <div className={styles.postImageWrap} onClick={() => setDetailPost(post)}>
                                <img
                                    src={
                                        post.images?.length > 0
                                            ? post.images[0]
                                            : CATEGORY_IMAGES[post.category || "other"] || CATEGORY_IMAGES.other
                                    }
                                    alt=""
                                    className={styles.postImage}
                                />
                            </div>

                            <div className={styles.postBody}>
                                <div>
                                    <div className={styles.postTopRow}>
                                        <span className={styles.postBadge}>{post.listingType}</span>
                                        <span className={styles.postDate}>
                                            {post.createdAt?.seconds
                                                ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
                                                : "Just now"}
                                        </span>
                                    </div>
                                    <h3 className={styles.postTitle}>
                                        {post.description_en || post.description}
                                    </h3>
                                    <p className={styles.postMeta}>
                                        {getCategoryLabel(post.category)} · {post.price} {post.currency} · {getLocationLabel(post.location)}
                                    </p>
                                </div>

                                <div className={styles.postActions}>
                                    <button
                                        className={`${styles.postActionBtn} ${styles.btnPreview}`}
                                        onClick={() => setDetailPost(post)}
                                    >
                                        <Eye size={14} />
                                        Details
                                    </button>
                                    <Link
                                        href={`/products/${post.id}`}
                                        target="_blank"
                                        className={`${styles.postActionBtn} ${styles.btnPreview}`}
                                    >
                                        <ExternalLink size={14} />
                                        Preview
                                    </Link>

                                    <div className={styles.postActionSpacer} />

                                    {filter === "pending" && (
                                        <>
                                            <button
                                                onClick={() => setRejectPost(post)}
                                                disabled={processingId === post.id}
                                                className={`${styles.postActionBtn} ${styles.btnReject}`}
                                            >
                                                <X size={14} />
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(post, "approved")}
                                                disabled={processingId === post.id}
                                                className={`${styles.postActionBtn} ${styles.btnApprove}`}
                                            >
                                                {processingId === post.id ? (
                                                    <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                                                ) : (
                                                    <Check size={14} />
                                                )}
                                                Approve
                                            </button>
                                        </>
                                    )}
                                    {filter === "rejected" && (
                                        <button
                                            onClick={() => handleStatusUpdate(post, "pending")}
                                            disabled={processingId === post.id}
                                            className={`${styles.postActionBtn} ${styles.btnReevaluate}`}
                                        >
                                            Re-evaluate
                                        </button>
                                    )}
                                    {filter === "approved" && (
                                        <button
                                            onClick={() => handleStatusUpdate(post, "pending")}
                                            disabled={processingId === post.id}
                                            className={`${styles.postActionBtn} ${styles.btnReevaluate}`}
                                        >
                                            Suspend
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        disabled={processingId === post.id}
                                        className={`${styles.postActionBtn} ${styles.btnDelete}`}
                                        title="Delete permanently"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {detailPost && (
                <div className={styles.modalOverlay} onClick={() => setDetailPost(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setDetailPost(null)}>
                            <X size={20} />
                        </button>

                        {/* Image Gallery */}
                        {detailPost.images?.length > 0 && (
                            <div className={styles.modalGallery}>
                                {detailPost.images.map((img, i) => (
                                    <img key={i} src={img} alt="" className={styles.modalGalleryImage} />
                                ))}
                            </div>
                        )}

                        <div className={styles.modalBody}>
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                <span className={styles.postBadge}>{detailPost.listingType}</span>
                                <span className={`${styles.statusBadge} ${detailPost.status === "approved" ? styles.statusActive
                                    : detailPost.status === "rejected" ? styles.statusBanned
                                        : ""
                                    }`} style={detailPost.status === "pending" ? { background: "rgba(234,179,8,0.15)", color: "#facc15" } : {}}>
                                    {detailPost.status}
                                </span>
                            </div>

                            <h2 className={styles.modalTitle}>
                                {detailPost.description_en || detailPost.description}
                            </h2>

                            {detailPost.description_ar && (
                                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", direction: "rtl", marginBottom: "0.5rem" }}>
                                    {detailPost.description_ar}
                                </p>
                            )}

                            <div className={styles.modalDetailGrid}>
                                <div className={styles.modalDetailItem}>
                                    <span className={styles.modalDetailLabel}>Category</span>
                                    <span className={styles.modalDetailValue}>{getCategoryLabel(detailPost.category)}</span>
                                </div>
                                <div className={styles.modalDetailItem}>
                                    <span className={styles.modalDetailLabel}>Price</span>
                                    <span className={styles.modalDetailValue}>{detailPost.price} {detailPost.currency}</span>
                                </div>
                                <div className={styles.modalDetailItem}>
                                    <span className={styles.modalDetailLabel}>Location</span>
                                    <span className={styles.modalDetailValue}>{getLocationLabel(detailPost.location)}</span>
                                </div>
                                <div className={styles.modalDetailItem}>
                                    <span className={styles.modalDetailLabel}>Condition</span>
                                    <span className={styles.modalDetailValue}>{detailPost.condition || "—"}</span>
                                </div>
                                {detailPost.quantity && (
                                    <div className={styles.modalDetailItem}>
                                        <span className={styles.modalDetailLabel}>Quantity</span>
                                        <span className={styles.modalDetailValue}>{detailPost.quantity} {detailPost.unitMetric}</span>
                                    </div>
                                )}
                                {detailPost.mfgDate && (
                                    <div className={styles.modalDetailItem}>
                                        <span className={styles.modalDetailLabel}>Mfg Date</span>
                                        <span className={styles.modalDetailValue}>{detailPost.mfgDate}</span>
                                    </div>
                                )}
                                {(detailPost.warranty_en || detailPost.warranty) && (
                                    <div className={styles.modalDetailItem}>
                                        <span className={styles.modalDetailLabel}>Warranty</span>
                                        <span className={styles.modalDetailValue}>{detailPost.warranty_en || detailPost.warranty}</span>
                                    </div>
                                )}
                                {(detailPost.delivery_en || detailPost.delivery) && (
                                    <div className={styles.modalDetailItem}>
                                        <span className={styles.modalDetailLabel}>Delivery</span>
                                        <span className={styles.modalDetailValue}>{detailPost.delivery_en || detailPost.delivery}</span>
                                    </div>
                                )}
                                {(detailPost.terms_en || detailPost.terms) && (
                                    <div className={styles.modalDetailItem}>
                                        <span className={styles.modalDetailLabel}>Terms</span>
                                        <span className={styles.modalDetailValue}>{detailPost.terms_en || detailPost.terms}</span>
                                    </div>
                                )}
                                <div className={styles.modalDetailItem}>
                                    <span className={styles.modalDetailLabel}>Posted</span>
                                    <span className={styles.modalDetailValue}>
                                        {detailPost.createdAt?.seconds
                                            ? new Date(detailPost.createdAt.seconds * 1000).toLocaleString()
                                            : "Just now"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {detailPost.status === "pending" && (
                            <div className={styles.modalFooter}>
                                <button
                                    onClick={() => {
                                        setRejectPost(detailPost);
                                        setDetailPost(null);
                                    }}
                                    className={`${styles.postActionBtn} ${styles.btnReject}`}
                                >
                                    <X size={14} /> Reject
                                </button>
                                <button
                                    onClick={() => {
                                        handleStatusUpdate(detailPost, "approved");
                                        setDetailPost(null);
                                    }}
                                    className={`${styles.postActionBtn} ${styles.btnApprove}`}
                                >
                                    <Check size={14} /> Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
