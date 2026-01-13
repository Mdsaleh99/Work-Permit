import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

// * https://tanstack.com/router/v1/docs/framework/react/routing/routing-concepts#layout-routes
// * https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
// * https://date-fns.org/docs/Getting-Started
export const Route = createFileRoute("/page/app")({
    beforeLoad: async () => {
        const { authUser, checkAuth } = useAuthStore.getState();

        if (!authUser) {
            await checkAuth();
        }

        const user = useAuthStore.getState().authUser;
        const role = user?.role;
        const isAllowed = role === "ADMIN" || role === "SUPER_ADMIN";
        if (!user || !isAllowed) {
            throw redirect({ to: "/auth/signin" });
        }

        // Check if user has a company - force them to create one first
        const { companyData, getCompanyByUser } = useCompanyStore.getState();
        if (!companyData) {
            try {
                await getCompanyByUser();
            } catch {
                // Company fetch failed - likely no company exists
                console.log("No company found, redirecting to create-company");
            }
        }

        const company = useCompanyStore.getState().companyData;
        if (!company) {
            throw redirect({ to: "/auth/create-company" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <DashboardLayout />
        </div>
    );
}
