"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Users, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import styles from "@/app/admin/admin.module.css";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText, badgeKey: "pending" as const },
    { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { userData, logout } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const q = query(collection(db, "products"), where("status", "==", "pending"));
                const snap = await getCountFromServer(q);
                setPendingCount(snap.data().count);
            } catch (err) {
                console.error("Error fetching pending count:", err);
            }
        };
        fetchPending();
        // Refresh count every 30 seconds
        const interval = setInterval(fetchPending, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarBrand}>
                <Link href="/" className={styles.brandLink}>
                    Intaglab Admin
                </Link>
            </div>

            <nav className={styles.sidebarNav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                        >
                            <item.icon size={18} />
                            {item.name}
                            {item.badgeKey === "pending" && pendingCount > 0 && (
                                <span className={styles.navBadge}>{pendingCount}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.sidebarFooter}>
                <div className={styles.adminProfile}>
                    {userData?.photoURL ? (
                        <Image
                            src={userData.photoURL}
                            alt={userData.displayName || "Admin"}
                            width={32}
                            height={32}
                            className={styles.adminAvatar}
                        />
                    ) : (
                        <div className={styles.adminAvatarPlaceholder}>
                            {userData?.displayName?.charAt(0) || "A"}
                        </div>
                    )}
                    <div>
                        <div className={styles.adminName}>{userData?.displayName || "Admin"}</div>
                        <div className={styles.adminEmail}>{userData?.email || ""}</div>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className={styles.signOutBtn}
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
