import { axiosInstance } from "@/api/axios";
import { StorageKeys } from "@/lib/constants";

export const authService = {
    signup: async (userData) => {
        const response = await axiosInstance.post("/auth/signup", userData);
        console.log(response.data.data);

        return response.data.data;
    },
    signin: async (credentials) => {
        const response = await axiosInstance.post("/auth/signin", credentials);
        console.log(response.data);

        return response.data.data;
    },
    signout: async () => {
        const response = await axiosInstance.post("/auth/signout");

        return response.data.data;
    },
    getCurrentUser: async () => {
        const response = await axiosInstance.get("/auth/current-user");
        console.log(response.data);

        return response.data.data;
    },
    resendEmailVerification: async () => {
        const response = await axiosInstance.post(
            "/auth/resend-email-verification",
        );

        return response.data.data;
    },
    verifyEmail: async (verificationToken) => {
        const response = await axiosInstance.get(
            `/auth/verify-email/${verificationToken}`,
        );

        return response.data.data;
    }
};
