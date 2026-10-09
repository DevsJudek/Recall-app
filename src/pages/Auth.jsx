// src/pages/Auth.jsx
import { useState, useMemo } from 'react';
import { supabase } from '../supabase';

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    // Dynamic Password Strength Calculator
    const passwordStrength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 6) score = 1;

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if (password.length >= 8 && ((hasLetter && hasNumber) || (hasLetter && hasSymbol) || (hasNumber && hasSymbol))) {
            score = 2;
        }
        if (password.length >= 8 && hasLetter && hasNumber && hasSymbol) {
            score = 3;
        }
        return score;
    }, [password]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isForgotPassword) {
                // 🚀 FORGOT PASSWORD LOGIC
                if (!email) throw new Error('Please enter your email address.');
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + "/app.html",
                });
                if (error) throw error;
                setMessage('Password reset link sent! Please check your email.');
                setIsForgotPassword(false);
            } else if (isLogin) {
                // 🚀 LOGIN LOGIC
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                // 🚀 SIGN UP LOGIC
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                setMessage('Registration successful! Welcome to Recall.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + "/app.html"
            }
        });

        if (error) {
            setError(error.message);
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden bg-gradient-to-b from-[#FFF9E6] to-white dark:from-[#0a0a0a] dark:to-[#121212] transition-colors">

            {/* Subtle background decorative elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-white/40 dark:bg-white/5 blur-3xl pointer-events-none transition-colors"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#FFF2EC]/50 dark:bg-[#FF6B00]/10 blur-3xl pointer-events-none transition-colors"></div>

            {/* Main Auth Card */}
            <div className="relative w-full max-w-[420px] bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white dark:border-gray-800 rounded-[32px] p-8 sm:p-10 z-10 transition-colors">

                {/* Scaled Up Logo Without Borders */}
                <div className="mx-auto flex items-center justify-center mb-6">
                    <img src="/logo.png" alt="Recall Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm" />
                </div>

                {/* Header Texts */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-[28px] font-black text-[#1A1A1A] dark:text-white tracking-tight mb-2">
                        {isForgotPassword ? 'Reset Password' : (isLogin ? 'Sign in to Recall' : 'Create an account')}
                    </h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {isForgotPassword
                            ? "Enter your email and we'll send you a reset link."
                            : (isLogin ? 'Welcome back to your study dashboard.' : 'Join Recall to master your syllabus today.')}
                    </p>
                </div>

                {/* System Messages */}
                {error && <div className="text-red-500 dark:text-red-400 text-xs font-bold text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-[12px] mb-4">{error}</div>}
                {message && <div className="text-green-600 dark:text-green-400 text-xs font-bold text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-[12px] mb-4">{message}</div>}

                {/* Hide Google Auth during Forgot Password flow */}
                {!isForgotPassword && (
                    <>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full flex justify-center items-center gap-3 py-3.5 px-4 rounded-[16px] text-sm font-bold text-[#1A1A1A] dark:text-white bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#333333] hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isGoogleLoading ? (
                                <svg className="animate-spin h-5 w-5 text-[#FF6B00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                        </button>

                        <div className="relative flex items-center py-6">
                            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                                Or continue with email
                            </span>
                            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                    </>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleAuth}>

                    {/* Full Name (Sign Up Only) */}
                    {!isLogin && !isForgotPassword && (
                        <div className="relative flex items-center">
                            <svg className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-[#F8F9FA] dark:bg-[#242424] rounded-[16px] pl-11 pr-5 py-3.5 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:bg-white dark:focus:bg-[#1A1A1A] transition-all placeholder:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-transparent focus:border-[#FF6B00]/30"
                                placeholder="Full Name"
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative flex items-center">
                        <svg className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F8F9FA] dark:bg-[#242424] rounded-[16px] pl-11 pr-5 py-3.5 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:bg-white dark:focus:bg-[#1A1A1A] transition-all placeholder:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-transparent focus:border-[#FF6B00]/30"
                            placeholder="Email address"
                        />
                    </div>

                    {/* Password (Hidden during forgot password) */}
                    {!isForgotPassword && (
                        <div>
                            <div className="relative flex items-center">
                                <svg className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#F8F9FA] dark:bg-[#242424] rounded-[16px] pl-11 pr-12 py-3.5 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:bg-white dark:focus:bg-[#1A1A1A] transition-all placeholder:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 tracking-wider border border-transparent focus:border-[#FF6B00]/30"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    )}
                                </button>
                            </div>

                            {/* Animated Password Strength Meter */}
                            {!isLogin && password.length > 0 && (
                                <div className="mt-3 animate-fade-in">
                                    <div className="flex gap-1.5">
                                        <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                            <div className={`absolute top-0 left-0 h-full w-full rounded-full transition-transform duration-500 ease-out bg-[#FF6B00] ${passwordStrength >= 1 ? 'translate-x-0' : '-translate-x-full'}`}></div>
                                        </div>
                                        <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                            <div className={`absolute top-0 left-0 h-full w-full rounded-full transition-transform duration-500 ease-out bg-[#FF6B00] ${passwordStrength >= 2 ? 'translate-x-0' : '-translate-x-full'}`}></div>
                                        </div>
                                        <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                            <div className={`absolute top-0 left-0 h-full w-full rounded-full transition-transform duration-500 ease-out bg-[#FF6B00] ${passwordStrength >= 3 ? 'translate-x-0' : '-translate-x-full'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); }}
                                        className="text-xs font-bold text-gray-500 hover:text-[#FF6B00] dark:text-gray-400 dark:hover:text-[#FF6B00] transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2 flex flex-col gap-3">
                        {/* Primary Button */}
                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-[16px] text-sm md:text-base font-black text-white bg-[#FF6B00] hover:bg-[#e05d00] focus:outline-none transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            {isLoading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Free Account'))}
                        </button>

                        {/* Secondary Button */}
                        <button
                            type="button"
                            onClick={() => {
                                if (isForgotPassword) {
                                    setIsForgotPassword(false);
                                    setIsLogin(true);
                                } else {
                                    setIsLogin(!isLogin);
                                }
                                setError(null);
                                setMessage(null);
                                setPassword('');
                            }}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-[16px] text-sm md:text-base font-black text-[#1A1A1A] dark:text-white bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#242424] transition-all focus:outline-none active:scale-[0.98]"
                        >
                            {isForgotPassword ? 'Back to Sign In' : (isLogin ? 'Create an account' : 'Sign In')}
                        </button>
                    </div>
                </form>

                {/* Terms Text */}
                {!isLogin && !isForgotPassword && (
                    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 text-center mt-6">
                        By continuing, you agree to our <span className="font-bold text-[#1A1A1A] dark:text-white cursor-pointer hover:underline">Terms of Service</span> and <span className="font-bold text-[#1A1A1A] dark:text-white cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                )}
            </div>
        </div>
    );
}