"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./TopLoader.module.css";

function TopLoaderInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(30);

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + (100 - prev) * 0.1;
                return next > 95 ? 95 : next;
            });
        }, 300);

        const finishTimer = setTimeout(() => {
            clearInterval(interval);
            setProgress(100);

            setTimeout(() => {
                setProgress(0);
            }, 300);
        }, 600);

        return () => {
            clearInterval(interval);
            clearTimeout(finishTimer);
        };
    }, [pathname, searchParams]);

    if (progress === 0) return null;

    return (
        <div className={styles.loaderContainer}>
            <div
                className={styles.loaderBar}
                style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
            />
        </div>
    );
}

export default function TopLoader() {
    return (
        <Suspense fallback={null}>
            <TopLoaderInner />
        </Suspense>
    );
}
