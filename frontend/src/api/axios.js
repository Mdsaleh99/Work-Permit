import axios from "axios";
import { StorageKeys } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
});

// Request interceptor (no tokens from localStorage anymore)
axiosInstance.interceptors.request.use(
    (config) => config,
    // No manual Authorization header, cookies are sent automatically
    (error) => Promise.reject(error),
);


// Single-flight refresh lock to prevent parallel refresh calls
let refreshingPromise = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;

        const urlPath = (originalRequest?.url || "").toString();
        const isRefreshCall = /\/auth\/refresh-token$/.test(urlPath);
        const hasPrimaryUser = Boolean(useAuthStore.getState()?.authUser);

        // Only refresh for primary-user requests when a primary user exists
        // Refresh only for primary-user sessions; members don't have a refresh flow
        if ((status === 419 || status === 401) && !originalRequest._retry && !isRefreshCall && hasPrimaryUser) {
            originalRequest._retry = true;
            try {
                if (!refreshingPromise) {
                    // Refresh tokens (cookies will be updated automatically)
                    refreshingPromise = axios.post(
                        `${API_URL}/auth/refresh-token`,
                        {},
                        { withCredentials: true },
                    );
                }
                await refreshingPromise;
                refreshingPromise = null;
                // Retry original request with fresh cookies
                return axiosInstance(originalRequest);
            } catch (err) {
                // Refresh failed. Do not hard-redirect here; let route guards decide.
                refreshingPromise = null;
                return Promise.reject(err);
            }
        }

        // For company members (no primary user), if token expired, don't hard-redirect.
        // Let calling screens/route guards decide what to do.
        if ((status === 419 || status === 401) && !hasPrimaryUser && !isRefreshCall) {
            return Promise.reject(error.response?.data || { message: 'Session expired' });
        }

        return Promise.reject(
            error.response?.data || { message: error.message },
        );
    },
);


// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config
//         console.log("axios interceptors Error:", error);

//         if (error.response?.status === 419 && !originalRequest._retry) {
//             originalRequest._retry = true
//             try {
//                 const refreshToken = localStorage.getItem(StorageKeys.REFRESH_TOKEN)
//                 if (!refreshToken) {
//                     localStorage.removeItem(StorageKeys.REFRESH_TOKEN)
//                     window.location.href = '/auth/signin'

//                     return Promise.reject(error)
//                 }

//                 const response = await axios.post(
//                     `${API_URL}/auth/refresh-token`,
//                     { refreshToken },
//                     {withCredentials: true}
//                 );
//                 console.log("response", response);
                

//                 if (response.data?.data?.tokens?.accessToken) {
//                     localStorage.setItem(
//                         StorageKeys.ACCESS_TOKEN,
//                         response.data.data.accessToken,
//                     );
//                 }
//                 if (response.data?.data?.tokens?.refreshToken) {
//                     localStorage.setItem(
//                         StorageKeys.REFRESH_TOKEN,
//                         response.data.data.accessToken,
//                     );
//                 }

//                 originalRequest.headers.Authorization = `Bearer ${response.data?.data?.accessToken}`

//                 return axiosInstance(originalRequest)
//             } catch (error) {
//                 localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
//                 localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
//                 window.location.href = "/auth/signin";

//                 return Promise.reject(error);
//             }
//         }

//         // Forward backend error payload directly when available
//         const payload = error?.response?.data || { message: error?.message || "Request failed" }
//         return Promise.reject(payload)
//     }
// )


