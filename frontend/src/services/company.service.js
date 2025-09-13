import { axiosInstance } from "@/api/axios"

export const companyService = {
    createCompany: async (data) => {
        const response = await axiosInstance.post("/company/create", data);

        return response.data.data;
    },
    getCompanyByUser: async () => {
        const response = await axiosInstance.get("/company/get-company")
        console.log(response.data);
        
        return response.data.data
    }
};