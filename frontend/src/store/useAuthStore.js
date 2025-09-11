import { authService } from "@/services/auth.service";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignUp: false,
    isSignIn: false,
    isAuthCheck: false,
    authError: null,

    clearAuthError: () => set({ authError: null }),

    checkAuth: async () => {
        set({ isAuthCheck: true });
        try {
            const user = await authService.getCurrentUser();
            set({ authUser: user });
        } catch (error) {
            console.error("Error checking auth: ", error);
            set({ authUser: null });
        } finally {
            set({ isAuthCheck: false });
        }
    },

    signup: async (userData) => {
        set({ isSignUp: true, authError: null });
        try {
            const signupUser = await authService.signup(userData);
            set({ authUser: signupUser });
        } catch (error) {
            set({ authError: error });
            throw error;
        } finally {
            set({ isSignUp: false });
        }
    },

    signin: async (userData) => {
        set({ isSignIn: true, authError: null });
        try {
            await authService.signin(userData);
            // Fetch full current user profile so pages have complete data immediately, because without doing this data is not comming properly before doing this we getting the response of signin which is email, name, isEmailVerified immedaitely, after the refresh the page only i am getting the current data
            const fullUser = await authService.getCurrentUser();
            set({ authUser: fullUser });
        } catch (error) {
            set({ authError: error });
            throw error;
        } finally {
            set({ isSignIn: false });
        }
    },

    signout: async () => {
        try {
            await authService.signout();
            set({ authUser: null });
        } catch (error) {
            console.error("Error logging out", error);
        }
    },

    resendEmailVerification: async () => {
        try {
            await authService.resendEmailVerification();
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },
    verifyEmail: async (verificationToken) => {
        try {
            await authService.verifyEmail(verificationToken);
            const current = get().authUser;
            if (current) {
                set({ authUser: { ...current, isEmailVerified: true } });
            }
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },
    forgotPassword: async (email) => {
        try {
            await authService.forgotPassword(email);
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },

    // changePassword: async (data) => {
    // OR
    changePassword: async (oldPassword, newPassword) => {
        try {
            // await authService.changePassword(data) OR
            await authService.changePassword(oldPassword, newPassword);
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },
    resetPassword: async (resetToken, newPassword) => {
        try {
            await authService.resetPassword(resetToken, newPassword);
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },
    googleAuth: () => { // 
        try {
            const url = authService.googleLoginUrl?.()
                || `${location.origin.replace(/:\\d+$/, '')}/api/v1/auth/google`; 
            window.location.href = url;
        } catch (__) {
            window.location.href = `${location.origin.replace(/:\\d+$/, '')}/api/v1/auth/google`;
        }
    },
}));
