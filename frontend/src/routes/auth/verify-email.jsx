import VerifyEmail from "@/components/auth/verify-email";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify-email")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <VerifyEmail />
        </div>
    );
}
