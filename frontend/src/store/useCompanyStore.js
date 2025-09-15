import { companyService } from "@/services/company.service";
import { create } from "zustand";

export const useCompanyStore = create((set) => ({
    companyData: null,
    isCreateCompany: false,
    isGetCompany: false,
    companyError: null,

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
            // returning data because we need to use the company data in the component, if we don't return the data then the data will not be available in the component
            return getCompany; // Return the company data
        } catch (error) {
            set({ companyError: error, companyData: null });
            throw error;
        } finally {
            set({ isGetCompany: false });
        }
    },
}));