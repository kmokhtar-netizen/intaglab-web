"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { Loader2, Ban, CheckCircle, Shield, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "../admin.module.css";

interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: "user" | "admin";
    status: "active" | "banned";
    createdAt?: any;
}

type SortField = "date" | "role" | "status";

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<SortField>("date");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const fetched: UserData[] = [];
            snap.forEach((d) => {
                fetched.push(d.data() as UserData);
            });
            setUsers(fetched);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBanStatus = async (targetUser: UserData) => {
        if (targetUser.uid === currentUser?.uid) {
            alert("You cannot ban yourself.");
            return;
        }
        const newStatus = targetUser.status === "active" ? "banned" : "active";
        const confirmMsg =
            newStatus === "banned"
                ? `Ban ${targetUser.displayName}?`
                : `Unban ${targetUser.displayName}?`;
        if (!confirm(confirmMsg)) return;

        setProcessingId(targetUser.uid);
        try {
            await updateDoc(doc(db, "users", targetUser.uid), { status: newStatus });
            setUsers((prev) =>
                prev.map((u) => (u.uid === targetUser.uid ? { ...u, status: newStatus } : u))
            );
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status");
        } finally {
            setProcessingId(null);
        }
    };

    const toggleRole = async (targetUser: UserData) => {
        if (targetUser.uid === currentUser?.uid) {
            alert("You cannot change your own role.");
            return;
        }
        const newRole = targetUser.role === "user" ? "admin" : "user";
        const confirmMsg =
            newRole === "admin"
                ? `Make ${targetUser.displayName} an Admin?`
                : `Remove Admin privileges from ${targetUser.displayName}?`;
        if (!confirm(confirmMsg)) return;

        setProcessingId(targetUser.uid);
        try {
            await updateDoc(doc(db, "users", targetUser.uid), { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u.uid === targetUser.uid ? { ...u, role: newRole } : u))
            );
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users
        .filter((u) => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
                (u.displayName || "").toLowerCase().includes(term) ||
                (u.email || "").toLowerCase().includes(term)
            );
        })
        .sort((a, b) => {
            if (sortBy === "role") {
                if (a.role === "admin" && b.role !== "admin") return -1;
                if (a.role !== "admin" && b.role === "admin") return 1;
                return 0;
            }
            if (sortBy === "status") {
                if (a.status === "banned" && b.status !== "banned") return -1;
                if (a.status !== "banned" && b.status === "banned") return 1;
                return 0;
            }
            return 0; // date is default from Firestore orderBy
        });

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>User Management</h1>
                <p className={styles.pageSubtitle}>
                    {users.length} registered user{users.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.filterPills}>
                    {(["date", "role", "status"] as SortField[]).map((field) => (
                        <button
                            key={field}
                            onClick={() => setSortBy(field)}
                            className={`${styles.filterPill} ${sortBy === field ? styles.filterPillActive : ""}`}
                        >
                            Sort: {field.charAt(0).toUpperCase() + field.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.searchBox}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.loaderWrap}>
                    <Loader2 className={styles.spinner} size={36} style={{ animation: "spin 1s linear infinite" }} />
                </div>
            ) : (
                <div className={styles.card}>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.uid}>
                                        <td>
                                            <div className={styles.userCell}>
                                                {u.photoURL ? (
                                                    <Image
                                                        src={u.photoURL}
                                                        alt={u.displayName}
                                                        width={36}
                                                        height={36}
                                                        className={styles.userAvatar}
                                                    />
                                                ) : (
                                                    <div className={styles.userAvatarPlaceholder}>
                                                        {u.displayName?.charAt(0) || "?"}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className={styles.userName}>{u.displayName}</div>
                                                    <div className={styles.userEmail}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.roleBadge} ${u.role === "admin" ? styles.roleBadgeAdmin : styles.roleBadgeUser
                                                    }`}
                                            >
                                                {u.role === "admin" && <Shield size={10} />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.statusBadge} ${u.status === "active" ? styles.statusActive : styles.statusBanned
                                                    }`}
                                            >
                                                {u.status}
                                            </span>
                                        </td>
                                        <td>
                                            {u.createdAt?.seconds
                                                ? new Date(u.createdAt.seconds * 1000).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td>
                                            <div className={styles.userActionsCell}>
                                                <button
                                                    onClick={() => toggleRole(u)}
                                                    disabled={processingId === u.uid}
                                                    title={u.role === "user" ? "Promote to Admin" : "Demote to User"}
                                                    className={styles.userActionBtn}
                                                    style={u.role === "admin" ? { color: "#c084fc" } : {}}
                                                >
                                                    <Shield size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleBanStatus(u)}
                                                    disabled={processingId === u.uid}
                                                    title={u.status === "active" ? "Ban User" : "Unban User"}
                                                    className={styles.userActionBtn}
                                                    style={u.status === "banned" ? { color: "#f87171" } : {}}
                                                >
                                                    {u.status === "active" ? <Ban size={16} /> : <CheckCircle size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className={styles.emptyState}>
                            {searchTerm ? `No users match "${searchTerm}"` : "No users found."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
