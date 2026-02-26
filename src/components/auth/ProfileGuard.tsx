"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TopLoader from "@/components/common/TopLoader";

export default function ProfileGuard({ children }: { children: React.ReactNode }) {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!loading) {
            // Check if user is logged in but hasn't completed their profile
            const needsOnboarding = user && userData && userData.profileCompleted === false;
            const isOnboardingPage = pathname === "/onboarding";

            if (needsOnboarding && !isOnboardingPage) {
                router.push("/onboarding");
            } else if (!needsOnboarding && isOnboardingPage) {
                // If they try to hit onboarding but don't need to, send them home
                router.push("/");
            } else {
                setIsChecking(false);
            }
        }
    }, [user, userData, loading, pathname, router]);

    if (loading || isChecking) {
        // You can return a minimal loading state or nothing while the redirect happens
        return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f13", color: "white" }}>Loading profile...</div>;
    }

    return <>{children}</>;
}
