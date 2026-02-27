import React, { useEffect } from 'react';
import { useState } from 'react';
import SoftBackdrop from './SoftBackdrop';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [state, setState] = useState('login');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotData, setForgotData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const { user, login, signUp, forgotPassword } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (state === 'login') {
            await login({ email: formData.email, password: formData.password });
        } else {
            await signUp({ name: formData.name, email: formData.email, password: formData.password });
        }
        setIsSubmitting(false);
    };

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (forgotData.newPassword !== forgotData.confirmPassword) {
            return;
        }

        setIsSubmitting(true);
        await forgotPassword(forgotData.email, forgotData.newPassword);
        setIsSubmitting(false);
        setShowForgotPassword(false);
        setForgotData({ email: '', newPassword: '', confirmPassword: '' });
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);

    return (
        <>
            <SoftBackdrop />
            <div className='min-h-screen flex items-center justify-center'>
                {showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className='w-full max-w-sm bg-white/6 border border-white/10 rounded-2xl px-8 py-8'>
                        <h2 className='text-white text-2xl font-medium'>Reset Password</h2>
                        <p className='text-gray-400 text-sm mt-2'>Enter your email and set a new password.</p>

                        <div className='flex items-center w-full mt-6 bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all'>
                            <input
                                type='email'
                                name='forgot-email'
                                placeholder='Email id'
                                className='w-full bg-transparent text-white placeholder-white/60 border-none outline-none'
                                value={forgotData.email}
                                onChange={(e) => setForgotData((prev) => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className='flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all'>
                            <input
                                type='password'
                                name='forgot-new-password'
                                placeholder='New password'
                                className='w-full bg-transparent text-white placeholder-white/60 border-none outline-none'
                                value={forgotData.newPassword}
                                onChange={(e) => setForgotData((prev) => ({ ...prev, newPassword: e.target.value }))}
                                minLength={6}
                                required
                            />
                        </div>

                        <div className='flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all'>
                            <input
                                type='password'
                                name='forgot-confirm-password'
                                placeholder='Confirm new password'
                                className='w-full bg-transparent text-white placeholder-white/60 border-none outline-none'
                                value={forgotData.confirmPassword}
                                onChange={(e) => setForgotData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                minLength={6}
                                required
                            />
                        </div>

                        <button disabled={isSubmitting || forgotData.newPassword !== forgotData.confirmPassword} type='submit' className='mt-6 w-full h-11 rounded-full text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition'>
                            {isSubmitting ? 'Please wait...' : 'Reset password'}
                        </button>

                        <button type='button' onClick={() => setShowForgotPassword(false)} className='mt-3 w-full text-sm text-pink-400 hover:underline'>
                            Back to login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className='w-full sm:w-87.5 text-center bg-white/6 border border-white/10 rounded-2xl px-8'>
                        <h1 className='text-white text-3xl mt-10 font-medium'>{state === 'login' ? 'Login' : 'Sign up'}</h1>

                        <p className='text-gray-400 text-sm mt-2'>Please sign in to continue</p>

                        {state !== 'login' && (
                            <div className='flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all '>
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' className='text-white/60' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                    {' '}
                                    <circle cx='12' cy='8' r='5' /> <path d='M20 21a8 8 0 0 0-16 0' />{' '}
                                </svg>
                                <input type='text' name='name' placeholder='Name' className='w-full bg-transparent text-white placeholder-white/60 border-none outline-none ' value={formData.name} onChange={handleChange} required />
                            </div>
                        )}

                        <div className='flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all '>
                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' className='text-white/75' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                {' '}
                                <path d='m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' /> <rect x='2' y='4' width='20' height='16' rx='2' />{' '}
                            </svg>
                            <input type='email' name='email' placeholder='Email id' className='w-full bg-transparent text-white placeholder-white/60 border-none outline-none ' value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className=' flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition-all '>
                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' className='text-white/75' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                {' '}
                                <rect width='18' height='11' x='3' y='11' rx='2' ry='2' /> <path d='M7 11V7a5 5 0 0 1 10 0v4' />{' '}
                            </svg>
                            <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' className='w-full bg-transparent text-white placeholder-white/60 border-none outline-none' value={formData.password} onChange={handleChange} required />
                            <button
                                type='button'
                                onClick={() => setShowPassword((prev) => !prev)}
                                className='text-white/70 hover:text-white transition'
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className='mt-4 text-left'>
                            <button type='button' onClick={() => setShowForgotPassword(true)} className='text-sm text-pink-400 hover:underline'>
                                Forget password?
                            </button>
                        </div>

                        <button disabled={isSubmitting} type='submit' className='mt-2 w-full h-11 rounded-full text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition '>
                            {isSubmitting ? 'Please wait...' : state === 'login' ? 'Login' : 'Sign up'}
                        </button>

                        <p onClick={() => setState((prev) => (prev === 'login' ? 'register' : 'login'))} className='text-gray-400 text-sm mt-3 mb-11 cursor-pointer'>
                            {state === 'login' ? "Don't have an account?" : 'Already have an account?'}
                            <span className='text-pink-400 hover:underline ml-1'>click here</span>
                        </p>
                    </form>
                )}
            </div>
        </>
    );
};

export default Login;
