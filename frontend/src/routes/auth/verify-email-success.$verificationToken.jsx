import VerifiedSuccess from "@/components/auth/verified-success";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute, useParams } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute(
    "/auth/verify-email-success/$verificationToken",
)({
    component: RouteComponent,
});

function RouteComponent() {
    // Pass the `from` option for TanStack Router to resolve params correctly
    const { verificationToken } = useParams({ from: "/auth/verify-email-success/$verificationToken" });
    const { verifyEmail } = useAuthStore();

    React.useEffect(() => {
        async function run() {
            try {
                await verifyEmail(verificationToken);
            } catch (e) {
                // no-op: you might want to show an error UI here
                console.error(e);
            }
        }
        if (verificationToken) run();
    }, [verificationToken, verifyEmail]);

    return (
        <div>
            <VerifiedSuccess />
        </div>
    );
}
