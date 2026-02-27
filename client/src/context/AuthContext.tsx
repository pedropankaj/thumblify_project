import { createContext, useContext, useEffect, useState } from 'react';
import type { IUser } from '../assets/assets';
import api from '../configs/api';
import toast from 'react-hot-toast';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    login: (user: { email: string; password: string }) => Promise<void>;
    signUp: (user: { name: string; email: string; password: string }) => Promise<void>;
    forgotPassword: (email: string, newPassword: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    login: async () => {},
    signUp: async () => {},
    forgotPassword: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
        try {
            const { data } = await api.post('/api/auth/register', { name, email, password });
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error((error as any)?.response?.data?.message || 'Registration failed');
        }
    };

    const login = async ({ email, password }: { email: string; password: string }) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error((error as any)?.response?.data?.message || 'Login failed');
        }
    };

    const forgotPassword = async (email: string, newPassword: string) => {
        try {
            const { data } = await api.post('/api/auth/forgot-password', { email });
            const resetToken = data?.resetToken;
            if (!resetToken) {
                toast.error('Unable to reset password right now. Try again.');
                return;
            }

            const resetResponse = await api.post('/api/auth/reset-password', {
                token: resetToken,
                newPassword,
            });

            toast.success(resetResponse?.data?.message || 'Password reset successful');
        } catch (error) {
            console.log(error);
            toast.error((error as any)?.response?.data?.message || 'Password reset failed');
        }
    };

    const logout = async () => {
        try {
            const { data } = await api.post('/api/auth/logout');
            setUser(null);
            setIsLoggedIn(false);
            toast.success(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/api/auth/verify');
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchUser();
        })();
    }, []);

    const value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        signUp,
        login,
        forgotPassword,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
