"use client";

import { useState } from "react";
import styles from "./signup.module.css";

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [touched, setTouched] = useState({ name: false, email: false, password: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

    // Validation rules
    const errors = {
        name: touched.name && !formData.name.trim() ? "Full name is required" : null,
        email: touched.email && (!formData.email.trim() ? "Email address is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? "Please enter a valid email address" : null,
        password: touched.password && (!formData.password ? "Password is required" : formData.password.length < 6) ? "Password must be at least 6 characters" : null
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all as touched to trigger any validation errors
        setTouched({ name: true, email: true, password: true });

        const isFormInvalid = !formData.name.trim() || 
                             !formData.email.trim() || 
                             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || 
                             !formData.password || 
                             formData.password.length < 6;

        if (isFormInvalid) {
            setAlert({ type: "error", message: "Please correct the errors in the form before submitting." });
            return;
        }

        setLoading(true);
        setAlert(null);

        try {
            const response = await fetch("http://localhost:5000/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setAlert({ type: "success", message: result.message || "Registration successful!" });
                setFormData({ name: "", email: "", password: "" });
                setTouched({ name: false, email: false, password: false });
            } else {
                setAlert({ type: "error", message: result.message || "Registration failed. Please try again." });
            }
        } catch (error) {
            console.error("Signup error:", error);
            setAlert({ type: "error", message: "Unable to connect to the server. Please check your internet connection." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.glowBg}>
                <div className={`${styles.glowOrb} ${styles.orb1}`}></div>
                <div className={`${styles.glowOrb} ${styles.orb2}`}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.signupCard}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="9"></line>
                                <line x1="9" y1="13" x2="15" y2="13"></line>
                                <line x1="9" y1="17" x2="15" y2="17"></line>
                            </svg>
                        </div>
                        <h1>Task Manager</h1>
                        <p className={styles.subtitle}>Organize your work with precision</p>
                    </div>

                    <h2 className={styles.formTitle}>Create Account</h2>

                    <form onSubmit={handleSubmit} noValidate>
                        {alert && (
                            <div className={`${styles.alert} ${alert.type === "success" ? styles.alertSuccess : styles.alertError}`}>
                                <svg className={styles.alertIcon} viewBox="0 0 20 20" fill="currentColor">
                                    {alert.type === "success" ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    )}
                                </svg>
                                <span>{alert.message}</span>
                            </div>
                        )}

                        {/* Name Input */}
                        <div className={`${styles.inputGroup} ${errors.name ? styles.inputGroupError : (touched.name ? styles.inputGroupSuccess : "")}`}>
                            <label htmlFor="name">Full Name</label>
                            <div className={styles.inputWrapper}>
                                <svg className={styles.fieldIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("name")}
                                    required
                                    autoComplete="name"
                                />
                                <svg className={`${styles.statusIcon} ${styles.successIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <svg className={`${styles.statusIcon} ${styles.errorIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        </div>

                        {/* Email Input */}
                        <div className={`${styles.inputGroup} ${errors.email ? styles.inputGroupError : (touched.email ? styles.inputGroupSuccess : "")}`}>
                            <label htmlFor="email">Email Address</label>
                            <div className={styles.inputWrapper}>
                                <svg className={styles.fieldIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("email")}
                                    required
                                    autoComplete="email"
                                />
                                <svg className={`${styles.statusIcon} ${styles.successIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <svg className={`${styles.statusIcon} ${styles.errorIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>

                        {/* Password Input */}
                        <div className={`${styles.inputGroup} ${errors.password ? styles.inputGroupError : (touched.password ? styles.inputGroupSuccess : "")}`}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputWrapper}>
                                <svg className={styles.fieldIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("password")}
                                    required
                                    autoComplete="new-password"
                                />
                                <svg
                                    className={styles.togglePassword}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? (
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.47-1.47a9.047 9.047 0 002.57-4.529 1 1 0 00-.01-.767C17.18 8.168 13.84 5 10 5a8.96 8.96 0 00-3.413.67L5.12 4.207a1 1 0 00-1.414 0zm2.569 2.568L7.43 6.015A6.97 6.97 0 0010 7a3 3 0 013 3 6.97 6.97 0 00.985 2.703l1.132 1.132A9.01 9.01 0 0018 10c-1.355-2.502-4.029-5-8-5a9.027 9.027 0 00-3.724.861zM4.14 8.152l1.64 1.64A6.983 6.983 0 002 10c1.355 2.502 4.029 5 8 5a8.96 8.96 0 004.218-1.025l1.492 1.492A9.047 9.047 0 0110 16c-3.84 0-7.18-3.168-8.777-5.736a1 1 0 01-.01-.767 9.017 9.017 0 012.927-3.345zM8 10a2 2 0 012-2 2 2 0 012 2H8z" clipRule="evenodd" />
                                    ) : (
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        /* simplified show eye path */
                                    )}
                                    {!showPassword && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />}
                                </svg>
                                <svg className={`${styles.statusIcon} ${styles.successIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <svg className={`${styles.statusIcon} ${styles.errorIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`}>
                            {!loading ? (
                                <span>Sign Up</span>
                            ) : (
                                <>
                                    <span>Creating Account...</span>
                                    <svg className={styles.btnSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.cardFooter}>
                        <p>Already have an account? <a href="#" className={styles.link}>Sign In</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
