import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Loader } from "lucide-react";

export const Route = createLazyFileRoute("/auth/sso-callback")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore();
    const { getCompanyByUser } = useCompanyStore();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check if user is authenticated (cookies should be set by backend)
                await checkAuth();
                
                // After successful auth, check if user has a company
                try {
                    const company = await getCompanyByUser();
                    if (company) {
                        // User has a company, go to dashboard
                        navigate({ to: "/page/app/dashboard" });
                    } else {
                        // User doesn't have a company, go to create company
                        navigate({ to: "/company/" });
                    }
                } catch (companyError) {
                    // If 404 error, user doesn't have a company
                    if (companyError.response?.status === 404) {
                        navigate({ to: "/company/" });
                    } else {
                        // For other errors, still go to dashboard and let it handle the error
                        navigate({ to: "/page/app/dashboard" });
                    }
                }
            } catch (error) {
                console.error("SSO callback error:", error);
                // If there's an error, redirect to signin
                navigate({ to: "/auth/signin" });
            }
        };

        handleCallback();
    }, [checkAuth, getCompanyByUser, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
}