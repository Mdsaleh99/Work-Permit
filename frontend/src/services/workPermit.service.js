import { axiosInstance } from "@/api/axios";

export const workPermitService = {
    createWorkPermit: async (workPermitData, companyId) => {
        const response = await axiosInstance.post(`/work-permit/${companyId}/create`, workPermitData);
        return response.data.data;
    },

    getAllWorkPermits: async () => {
        const response = await axiosInstance.get("/work-permit/get-all");
        return response.data.data;
    },

    getCompanyWorkPermits: async (companyId) => {
        const response = await axiosInstance.get(`/work-permit/company/${companyId}/all`);
        return response.data.data;
    },

    getWorkPermitById: async (workPermitId) => {
        const response = await axiosInstance.get(`/work-permit/${workPermitId}`);
        return response.data.data;
    },

    updateWorkPermit: async (workPermitData, companyId, workPermitId) => {
        const response = await axiosInstance.patch(`/work-permit/company/${companyId}/${workPermitId}`, workPermitData);
        return response.data.data;
    },

    duplicateWorkPermit: async (workPermitFormId) => {
        const response = await axiosInstance.post(`/work-permit/${workPermitFormId}/duplicate`)

        return response.data.data
    },

    // submissions
    createSubmission: async (workPermitFormId, answers) => {
        const res = await axiosInstance.post(`/work-permit/${workPermitFormId}/submissions`, { answers });
        return res.data;
    },
    listSubmissions: async (workPermitFormId) => {
        const res = await axiosInstance.get(`/work-permit/${workPermitFormId}/submissions`);
        return res.data;
    },
    updateSubmission: async (workPermitFormId, answers) => {
        const res = await axiosInstance.patch(`/work-permit/${workPermitFormId}/submissions`, { answers });
        return res.data;
    },

    // SUPER_ADMIN only actions
    approveWorkPermit: async (workPermitFormId) => {
        const response = await axiosInstance.post(`/work-permit/${workPermitFormId}/approve`);
        return response.data.data;
    },

    closeWorkPermit: async (workPermitFormId, data = {}) => {
        const response = await axiosInstance.post(`/work-permit/${workPermitFormId}/close`, data);
        return response.data.data;
    },

    getFormsPendingApproval: async () => {
        const response = await axiosInstance.get("/work-permit/pending-approval");
        return response.data.data;
    },
};