import { PermitsDashboard } from "@/components/permit-dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
    "/company-member/dash/member/dashboard",
)({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <PermitsDashboard />
        </div>
    );
}
