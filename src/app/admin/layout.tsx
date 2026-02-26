"use client";

import AdminRoute from "@/components/admin/AdminRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "./admin.module.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminRoute>
            <div className={styles.adminLayout} id="admin-root">
                <AdminSidebar />
                <main className={styles.mainContent}>
                    <div className={styles.mainContentInner}>
                        {children}
                    </div>
                </main>
            </div>
        </AdminRoute>
    );
}
