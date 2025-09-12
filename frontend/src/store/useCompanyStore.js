import { companyService } from "@/services/company.service";
import { create } from "zustand";

export const useCompanyStore = create((set) => ({
    companyData: null,
    isCreateCompany: false,
    isGetCompany: false,
    authError: null,

    createCompany: async (data) => {
        set({ isCreateCompany: true});
        try {
            const company = await companyService.createCompany(data)
            set({companyData: company})
        } catch (error) {
            set({ authError: error })
            throw error
        } finally {
            set({ isCreateCompany: false});
        }
    },
    getCompanyByUser: async () => {
        set({ isGetCompany: true });
        try {
            const getCompany = await companyService.getCompanyByUser()
            set({companyData: getCompany})
        } catch (error) {
            set({ authError: error })
            throw error
        } finally {
            set({isGetCompany: false})
        }
    }
}))