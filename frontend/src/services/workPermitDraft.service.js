import { axiosInstance } from "@/api/axios"

export const workPermitDraftService = {
    // Create or Update Draft (Auto-save)
    createOrUpdateDraft: async (draftData, companyId, isAutoSave = false) => {
        console.log(`📤 Frontend sending draft with isAutoSave: ${isAutoSave}`, { draftData, companyId });
        const response = await axiosInstance.post(`/work-permit-draft/${companyId}/create-or-update`, {
            ...draftData,
            isAutoSave
        });
        console.log(`📥 Backend response:`, response.data);
        return response.data.data;
    },

    // Get All Drafts for User
    getAllDrafts: async () => {
        const response = await axiosInstance.get("/work-permit-draft/get-all");
        return response.data.data;
    },

    // Get Draft by ID
    getDraftById: async (draftId) => {
        const response = await axiosInstance.get(`/work-permit-draft/${draftId}`);
        return response.data.data;
    },

    // Delete Draft
    deleteDraft: async (draftId) => {
        const response = await axiosInstance.delete(`/work-permit-draft/${draftId}`);
        return response.data.data;
    }
}
