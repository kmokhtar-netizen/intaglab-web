"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function ConditionalFooter() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isOnboarding = pathname === "/onboarding";

    if (isAdmin || isOnboarding) return null;

    return <Footer />;
}
