import { axiosInstance } from "@/api/axios"

export const companyService = {
    createCompany: async (data) => {
        const response = await axiosInstance.post("/company/create", data);

        return response.data.data;
    },
    getCompanyByUser: async () => {
        const response = await axiosInstance.get("/company/get-company")
        // console.log(response.data);
        
        return response.data.data
    },
    createCompanyMember: async (userData, companyId) => {
        const response = await axiosInstance.post(`/company/${companyId}/create-member`, userData);

        return response.data.data;
    },

    getAllCompanyMembers: async (companyId) => {
        const response = await axiosInstance.get(`/company/${companyId}/get-members`);
        return response.data.data;
    },

    updateCompanyMemberRole: async (companyId, memberId, role) => {
        const response = await axiosInstance.put(`/company/${companyId}/${memberId}/role`, { role })
        
        return response.data.data
    },

    updateCompanyMemberAllowedPermits: async (companyId, memberId, allowedWorkPermitIds) => {
        const response = await axiosInstance.put(`/company/${companyId}/${memberId}/allowed-permits`, { allowedWorkPermitIds })
        return response.data.data
    },

    deleteCompanyMember: async (companyId, memberId) => {
        const response = await axiosInstance.delete(`/company/${companyId}/${memberId}`)
        return response.data.data
    },

    companyMemberSignIn: async (userData, companyId) => {
        const response = await axiosInstance.post(`/company/member-signin/${companyId}`, userData)

        return response.data.data
    },

    companyMemberSignOut: async () => {
        const response = await axiosInstance.post(`/company/member-signout`);

        return response.data.data
    },

    getCurrentCompanyMember: async () => {
        try {
            const response = await axiosInstance.get(`/company/member`)
            return response.data.data
        } catch (error) {
            const status = error?.status || error?.response?.status
            if (status === 401 || status === 419) {
                return null
            }
            throw error
        }
    }
};