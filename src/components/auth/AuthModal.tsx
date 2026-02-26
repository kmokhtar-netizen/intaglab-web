import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, AlertCircle } from "lucide-react";
import styles from "./AuthModal.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Ripple from "@/components/common/Ripple";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthView = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useAuth();
    const { t } = useLanguage();

    const [view, setView] = useState<AuthView>('signin');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        onClose();
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            onClose();
        } catch (err: any) {
            console.error("Google Sign In Error:", err);
            // Show more specific error messages
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign in was cancelled.");
            } else if (err.code === 'auth/popup-blocked') {
                setError("Sign in popup was blocked by your browser. Please allow popups.");
            } else if (err.code === 'auth/unauthorized-domain') {
                setError("This domain is not authorized for OAuth operations. Please add it in the Firebase Console.");
            } else {
                setError(err.message || "Failed to sign in with Google.");
            }
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await signInWithFacebook();
            onClose();
        } catch (err: any) {
            console.error("Facebook Sign In Error:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign in was cancelled.");
            } else {
                setError(err.message || "Failed to sign in with Facebook.");
            }
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (view === 'signin') {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
            onClose();
        } catch (err: any) {
            console.error("Email Auth Error:", err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError("Invalid email or password.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("An account with this email already exists.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError(err.message || "Authentication failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                        <button className={styles.closeBtn} onClick={handleClose}>
                            <X size={24} />
                        </button>

                        <div className={styles.header}>
                            <h2 className={styles.title}>{view === 'signin' ? 'Welcome back' : 'Create an account'}</h2>
                            <p className={styles.subtitle}>
                                {view === 'signin'
                                    ? 'Sign in to list assets and manage your inventory.'
                                    : 'Sign up to start buying and selling industrial surplus.'}
                            </p>
                        </div>

                        {error && (
                            <div className={styles.error}>
                                <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEmailAuth} className={styles.emailForm}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isLoading}
                                style={{ position: 'relative', overflow: 'hidden' }}
                            >
                                {isLoading ? 'Processing...' : (view === 'signin' ? 'Sign In' : 'Sign Up')}
                                {!isLoading && <Ripple />}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>or continue with</span>
                        </div>

                        <div className={styles.socialButtons}>
                            <button onClick={handleGoogleSignIn} className={styles.googleBtn} style={{ position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className={styles.googleIcon}
                                />
                                Sign in with Google
                                <Ripple color="rgba(0, 0, 0, 0.1)" />
                            </button>

                            <button onClick={handleFacebookSignIn} className={styles.facebookBtn} style={{ position: 'relative', overflow: 'hidden' }}>
                                <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                Sign in with Facebook
                                <Ripple />
                            </button>
                        </div>

                        <div className={styles.switchView}>
                            {view === 'signin' ? (
                                <p>Don't have an account? <button type="button" onClick={() => setView('signup')}>Sign up</button></p>
                            ) : (
                                <p>Already have an account? <button type="button" onClick={() => setView('signin')}>Sign in</button></p>
                            )}
                        </div>

                        <div className={styles.footer}>
                            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
