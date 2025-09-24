import { companyService } from "@/services/company.service";
import { create } from "zustand";

export const useCompanyStore = create((set) => ({
    companyData: null,
    currentCompanyMember: null,
    isCreateCompany: false,
    isGetCompany: false,
    isCompanyMemberSigningIn: false,
    isCompanyMemberSigningOut: false,
    companyError: null,
    companyMemberData: null,
    isCreateCompanyMember: false,
    isGetCompanyMembers: false,
    companyMembers: [],

    clearCompanyError: () => set({ companyError: null }),

    createCompany: async (data) => {
        set({ isCreateCompany: true, companyError: null });
        try {
            const company = await companyService.createCompany(data);
            set({ companyData: company });
            // console.log("companyData: ", company);
        } catch (error) {
            set({ companyError: error });
            throw error;
        } finally {
            set({ isCreateCompany: false });
        }
    },
    getCompanyByUser: async () => {
        set({ isGetCompany: true, companyError: null });
        try {
            const getCompany = await companyService.getCompanyByUser();
            set({ companyData: getCompany, companyError: null });
            // returning data because we need to use the company data in the component, if we don't return the data then the data will not be available **immeddiately** in the component
            return getCompany; // Give back the fresh value immediately
        } catch (error) {
            set({ companyError: error, companyData: null });
            throw error;
        } finally {
            set({ isGetCompany: false });
        }
    },

    companyMemberSignIn: async (userData, companyId) => {
        set({ isCompanyMemberSigningIn: true, companyError: null })
        try {
            const member = await companyService.companyMemberSignIn(userData, companyId)
            set({ currentCompanyMember: member })
            return member
        } catch (error) {
            set({ companyError: error })
            throw error
        } finally {
            set({ isCompanyMemberSigningIn: false })
        }
    },

    companyMemberSignOut: async () => {
        set({ isCompanyMemberSigningOut: true, companyError: null })
        try {
            await companyService.companyMemberSignOut()
            set({ currentCompanyMember: null })
        } catch (error) {
            set({ companyError: error })
            throw error
        } finally {
            set({ isCompanyMemberSigningOut: false })
        }
    },

    getCurrentCompanyMember: async () => {
        set({ companyError: null })
        try {
            const member = await companyService.getCurrentCompanyMember()
            set({ currentCompanyMember: member })
            return member
        } catch (error) {
            // If not authenticated as member, clear state but don't throw to avoid redirect loops
            const status = error?.status || error?.response?.status
            if (status === 401 || status === 419) {
                set({ currentCompanyMember: null })
                return null
            }
            set({ companyError: error })
            throw error
        }
    },

    createCompanyMember: async (userData, companyId) => {
        set({ isCreateCompanyMember: true, companyError: null });
        try {
            const member = await companyService.createCompanyMember(userData, companyId)
            // Save the created member separately
            set({ companyMemberData: member });
            // Also optimistically update the members list so subscribers react immediately
            set((state) => ({ companyMembers: Array.isArray(state.companyMembers) ? [member, ...state.companyMembers] : [member] }));
            // return member;
        } catch (error) {
            set({ companyError: error });
            throw error;
        } finally {
            set({ isCreateCompanyMember: false });
        }
        
    },

    getAllCompanyMembers: async (companyId) => {
        set({isGetCompanyMembers: true, companyError: null})
        try {
            const companyMembers =
                await companyService.getAllCompanyMembers(companyId);
            set({ companyMembers });
            return companyMembers; // Give back the fresh value immediately
        } catch (error) {
            set({ companyError: error });
            throw error;
        } finally {
            set({ isGetCompanyMembers: false });
        }
    },

    // * in zustand states are immutable
    updateCompanyMemberRole: async (companyId, memberId, role) => {
        set({ companyError: null })
        try {
            const updated = await companyService.updateCompanyMemberRole(companyId, memberId, role)
            // console.log("updated", updated);
            
            set((state) => ({
                // state.companyMembers has a previous data which is fetched
                companyMembers: (state.companyMembers || []).map(m => (
                    m.id === memberId ? (updated && typeof updated === 'object' ? updated : { ...m, role }) : m
                ))
            }))
            
            return updated
        } catch (error) {
            set({ companyError: error })
            throw error
        }
    },

    updateCompanyMemberAllowedPermits: async (companyId, memberId, allowedWorkPermitIds) => {
        set({ companyError: null })
        try {
            const updated = await companyService.updateCompanyMemberAllowedPermits(companyId, memberId, allowedWorkPermitIds)
            set((state) => ({
                companyMembers: (state.companyMembers || []).map(m => (
                    m.id === memberId ? { ...m, allowedWorkPermits: updated?.allowedWorkPermits || [] } : m
                ))
            }))
            return updated
        } catch (error) {
            set({ companyError: error })
            throw error
        }
    },

    deleteCompanyMember: async (companyId, memberId) => {
        set({ companyError: null })
        try {
            await companyService.deleteCompanyMember(companyId, memberId)
            // console.log("member id", memberId);
            
            set((state) => ({
                companyMembers: (state.companyMembers || []).filter(m => (m.id !== memberId))
            }))
        } catch (error) {
            set({ companyError: error })
            throw error
        }
    }
}));