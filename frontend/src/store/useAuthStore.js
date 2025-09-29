import { authService } from "@/services/auth.service";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignUp: false,
    isSignIn: false,
    isAuthCheck: false,
    authError: null,
    superAdmins: [], // Store Super Admins list
    admins: [], // Store Admins list
    isCreatingSuperAdmin: false,
    isCreatingAdmin: false,

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

    // Admin (company-scoped) signin – renamed from signinSuperAdmin
    signinAdmin: async (companyId, userData) => {
        set({ isSignIn: true, authError: null });
        try {
            await authService.signinAdmin(companyId, userData);
            const fullUser = await authService.getCurrentUser();
            set({ authUser: fullUser });
        } catch (error) {
            set({ authError: error });
            throw error;
        } finally {
            set({ isSignIn: false });
        }
    },
    // Backwards-compatible alias (can be removed later)
    // signinSuperAdmin: async (companyId, userData) => {
    //     return await get().signinAdmin(companyId, userData);
    // },

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
    createSuperAdmin: async (companyId, data) => {
        set({ isCreatingSuperAdmin: true, authError: null });
        try {
            const superAdmin = await authService.createSuperAdmin(companyId, data);
            // Optimistically update the super admins list
            set((state) => ({ 
                superAdmins: [superAdmin, ...state.superAdmins] 
            }));
            return superAdmin;
        } catch (error) {
            set({ authError: error });
            throw error;
        } finally {
            set({ isCreatingSuperAdmin: false });
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
        // eslint-disable-next-line no-unused-vars
        } catch (__) {
            window.location.href = `${location.origin.replace(/:\\d+$/, '')}/api/v1/auth/google`;
        }
    },

    // Super Admins management
    getSuperAdmins: async (companyId) => {
        try {
            const superAdmins = await authService.getCompanySuperAdmins(companyId);
            set({ superAdmins: Array.isArray(superAdmins) ? superAdmins : [] });
            return superAdmins;
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },

    getAdmins: async (companyId) => {
        try {
            const admins = await authService.getCompanyAdmins(companyId);
            const list = Array.isArray(admins) ? admins : [];
            set({ admins: list });
            return list;
        } catch (error) {
            set({ authError: error });
            throw error;
        }
    },

    createAdmin: async (companyId, data) => {
        set({ isCreatingAdmin: true, authError: null });
        try {
            const admin = await authService.createAdmin(companyId, data);
            // Optimistically update admins list
            set((state) => ({ admins: [admin, ...(state.admins || [])] }));
            return admin;
        } catch (error) {
            set({ authError: error });
            throw error;
        } finally {
            set({ isCreatingAdmin: false });
        }
    },

    clearSuperAdmins: () => set({ superAdmins: [] }),
}));
