import VerifyEmail from "@/components/auth/verify-email";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify-email")({
    component: RouteComponent,
});

function RouteComponent() {
    const { authUser, resendEmailVerification } = useAuthStore()
    return (
        <div>
            <VerifyEmail email={authUser.email} onResendEmail={resendEmailVerification} />
        </div>
    );
}
