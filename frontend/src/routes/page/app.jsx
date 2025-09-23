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
        // const { getCurrentCompanyMember, currentCompanyMember } = useCompanyStore();
        // console.log("currentCompanyMember: ", currentCompanyMember);
        

        // If no user yet, trigger checkAuth
        if (!authUser) {
            await checkAuth(); // wait for cookie-based auth
        }

        // After check, if still no user -> redirect
        if (!useAuthStore.getState().authUser) {
            throw redirect({
                to: "/auth/signin",
            });
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
