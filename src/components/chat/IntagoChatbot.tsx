"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { INTAGO_FAQS } from "@/lib/faqData";
import styles from "./IntagoChatbot.module.css";

interface Message {
    id: string;
    sender: "bot" | "user";
    text: string;
}

export default function IntagoChatbot() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with greeting & reset when language changes
    useEffect(() => {
        setMessages([
            {
                id: "greeting",
                sender: "bot",
                text: t("chatbot.greeting")
            }
        ]);
    }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current && isOpen) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleFaqClick = (faqId: string) => {
        const faq = INTAGO_FAQS.find(f => f.id === faqId);
        if (!faq) return;

        // Add user question
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: userMsgId, sender: "user", text: faq.question[language] }]);

        // Add bot answer with a slight delay for realism
        setTimeout(() => {
            setMessages(prev => [...prev, { id: userMsgId + "_reply", sender: "bot", text: faq.answer[language] }]);
        }, 600);
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: userMsgId, sender: "user", text: inputValue.trim() }]);
        setInputValue("");

        // Generic fallback for custom text input
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: userMsgId + "_reply",
                sender: "bot",
                text: language === "ar"
                    ? "عفواً، أنا لسة بتعلم أرد على الأسئلة الحرة. ياريت تختار من الأسئلة الجاهزة المتاحة حالياً!"
                    : "I'm still learning how to answer custom questions. Please choose from the available FAQ options for now!"
            }]);
        }, 800);
    };

    return (
        <div className={styles.widgetContainer}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerInfo}>
                                <div className={styles.botAvatar}>
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className={styles.headerTitle}>{t("chatbot.title")}</h3>
                                    <div className={styles.headerStatus}>
                                        <span className={styles.statusDot}></span>
                                        Online
                                    </div>
                                </div>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                                aria-label={t("chatbot.closeAria")}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className={styles.messagesContainer}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`${styles.messageWrapper} ${msg.sender === "bot" ? styles.messageBot : styles.messageUser}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={`${styles.messageBubble} ${msg.sender === "bot" ? styles.bubbleBot : styles.bubbleUser}`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* FAQ Options (only show after bot messages, or always at bottom) */}
                            {messages[messages.length - 1]?.sender === "bot" && (
                                <motion.div
                                    className={styles.faqOptions}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {INTAGO_FAQS.map((faq) => (
                                        <button
                                            key={faq.id}
                                            className={styles.faqOptionBtn}
                                            onClick={() => handleFaqClick(faq.id)}
                                        >
                                            {faq.question[language]}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form className={styles.inputArea} onSubmit={handleSend}>
                            <input
                                type="text"
                                className={styles.chatInput}
                                placeholder={t("chatbot.inputPlaceholder")}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className={styles.sendButton}
                                disabled={!inputValue.trim()}
                                aria-label="Send message"
                            >
                                <Send size={18} style={{ marginLeft: language === "ar" ? "-2px" : "2px" }} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    className={styles.fabButton}
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={t("chatbot.openAria")}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <MessageSquare size={26} />
                </motion.button>
            )}
        </div>
    );
}
