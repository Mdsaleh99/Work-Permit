import { Outlet, createLazyFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";

export const Route = createLazyFileRoute("/page/app/form-builder")({
    beforeLoad: async () => {
        // Only primary company users can access builder routes
        const { authUser, checkAuth } = useAuthStore.getState();
        if (!authUser) {
            await checkAuth();
        }
        if (!useAuthStore.getState().authUser) {
            // If a member is logged in, keep them on member dashboard
            const { currentCompanyMember, getCurrentCompanyMember } = useCompanyStore.getState();
            if (!currentCompanyMember) {
                await getCurrentCompanyMember().catch(() => {});
            }
            if (useCompanyStore.getState().currentCompanyMember) {
                throw redirect({ to: "/page/app/user-dashboard" });
            }
            throw redirect({ to: "/auth/signin" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    // Acts as a layout for builder routes. Children will render here.
    return <Outlet />;
}
