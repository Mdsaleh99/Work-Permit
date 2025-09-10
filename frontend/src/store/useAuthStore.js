import { authService } from "@/services/auth.service";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSignUp: false,
    isSignIn: false,
    isAuthCheck: false,
    authError: null,

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
            const signinUser = await authService.signin(userData);
            set({ authUser: signinUser });
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
}));
