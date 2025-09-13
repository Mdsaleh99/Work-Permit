import { axiosInstance } from "@/api/axios"

export const workPermitService = {
    createWorkPermit: async (workPermitData, companyId) => {
        const response = await axiosInstance.post(`/work-permit/${companyId}/create`, workPermitData);
        return response.data.data;
    },

    getAllWorkPermits: async () => {
        const response = await axiosInstance.get("/work-permit/get-all");
        return response.data.data;
    },

    getWorkPermitById: async (workPermitId) => {
        const response = await axiosInstance.get(`/work-permit/${workPermitId}`);
        return response.data.data;
    },

    updateWorkPermit: async (workPermitData, companyId, workPermitId) => {
        const response = await axiosInstance.patch(`/work-permit/${companyId}/${workPermitId}`, workPermitData);
        return response.data.data;
    },

    deleteWorkPermit: async (workPermitId) => {
        const response = await axiosInstance.delete(`/work-permit/${workPermitId}`);
        return response.data.data;
    }
}