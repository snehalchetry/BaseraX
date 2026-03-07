import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export default function Login() {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [shakeForm, setShakeForm] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(rollNumber, password);
            showToast('Login successful! Redirecting...', 'success');
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
            setError(msg);
            setShakeForm(true);
            setTimeout(() => setShakeForm(false), 600);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        showToast('Please contact your hostel administrator to reset your password.', 'info');
    };

    return (
        <div className="min-h-screen flex flex-col relative bg-[#f8f6f6] font-sans animate-fade-in">
            <div className="absolute inset-0 z-0 bg-[url('https://gcdnb.pbrd.co/images/LFyByRAQS2cS.jpg')] bg-center bg-cover">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f6]/95 via-[#f8f6f6]/80 to-transparent"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center p-12">
                <div className={`w-full max-w-[420px] bg-white shadow-2xl rounded-[4px_200px_60px_4px] p-10 animate-slide-up ${shakeForm ? 'animate-shake' : ''}`}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-1.5 animate-fade-slide-in stagger-1">
                        <span className="material-symbols-outlined text-[36px] text-brand-primary">school</span>
                        <h1 className="text-xl font-extrabold text-brand-primary tracking-tight m-0">Hostel Management System</h1>
                    </div>
                    <p className="text-[#777] font-semibold text-xs tracking-widest uppercase mb-8 m-0 animate-fade-slide-in stagger-2">Chandigarh Group of Colleges, Mohali</p>

                    <h2 className="text-[28px] font-bold text-brand-primary mb-8 m-0 animate-fade-slide-in stagger-2">Login</h2>

                    {error && (
                        <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2 animate-fade-slide-in">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5 animate-fade-slide-in stagger-3">
                            <label className="block text-[13px] font-semibold text-[#444] mb-1.5 focus-within:text-brand-primary transition-colors">Roll Number / Enrollment No / EMP Code </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full py-3 pr-4 pl-12 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                    placeholder="Enter your roll number"
                                    value={rollNumber}
                                    onChange={e => setRollNumber(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">badge</span>
                            </div>
                        </div>

                        <div className="mb-5 animate-fade-slide-in stagger-4">
                            <label className="block text-[13px] font-semibold text-[#444] mb-1.5 focus-within:text-brand-primary transition-colors">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full py-3 pr-12 pl-12 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors flex">
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between my-3 animate-fade-slide-in stagger-5">
                            <label className="flex items-center gap-1.5 text-[13px] text-[#666] cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20" />
                                Remember me
                            </label>
                            <button type="button" onClick={handleForgotPassword} className="text-[13px] font-semibold text-brand-primary hover:underline bg-transparent border-none cursor-pointer">Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-brand-primary text-white font-bold text-[15px] rounded-lg shadow-lg shadow-brand-primary/30 hover:bg-[#7a0e12] hover:-translate-y-0.5 active:translate-y-0 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none animate-fade-slide-in stagger-6"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>LOGIN</span>
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="relative z-10 px-12 py-6 flex items-center justify-between border-t border-white/20 bg-white/5 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex gap-3">
                    <a href="https://cgc.edu.in" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#555] border border-white/30 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all hover:-translate-y-0.5"><span className="material-symbols-outlined text-[20px]">public</span></a>
                    <a href="mailto:hostel@cgc.edu.in" className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#555] border border-white/30 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all hover:-translate-y-0.5"><span className="material-symbols-outlined text-[20px]">mail</span></a>
                    <a href="tel:+911234567890" className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#555] border border-white/30 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all hover:-translate-y-0.5"><span className="material-symbols-outlined text-[20px]">call</span></a>
                </div>
                <div className="text-[12px] text-[#888] font-medium">© {new Date().getFullYear()} Hostel Management System. All rights reserved.</div>
            </div>
        </div>
    );
}
