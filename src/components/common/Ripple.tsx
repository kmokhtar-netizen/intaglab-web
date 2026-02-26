"use client";

import React, { useState, MouseEvent } from "react";
import styles from "./Ripple.module.css";

interface RippleType {
    x: number;
    y: number;
    size: number;
    id: number;
}

export default function Ripple({ color = "rgba(255, 255, 255, 0.4)", duration = 600 }: { color?: string, duration?: number }) {
    const [ripples, setRipples] = useState<RippleType[]>([]);

    const addRipple = (event: MouseEvent<HTMLDivElement>) => {
        const rippleContainer = event.currentTarget.getBoundingClientRect();
        const size = rippleContainer.width > rippleContainer.height ? rippleContainer.width : rippleContainer.height;

        // Calculate the exact click position relative to the container
        const x = event.clientX - rippleContainer.left - size / 2;
        const y = event.clientY - rippleContainer.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);
    };

    // Clean up ripples after their animation finishes
    const handleAnimationEnd = (id: number) => {
        setRipples((prevRipples) => prevRipples.filter((ripple) => ripple.id !== id));
    };

    return (
        <div className={styles.rippleContainer} onMouseDown={addRipple}>
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className={styles.ripple}
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                        backgroundColor: color,
                        animationDuration: `${duration}ms`
                    }}
                    onAnimationEnd={() => handleAnimationEnd(ripple.id)}
                />
            ))}
        </div>
    );
}
