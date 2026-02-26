"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isOnboarding = pathname === "/onboarding";

    if (isAdmin || isOnboarding) return null;

    return (
        <>
            <Navbar />
            {/* Spacer for fixed navbar */}
            <div style={{ height: "6rem" }} />
        </>
    );
}
