import * as React from "react";
import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ScrollToTop from "@/components/scrollToTop";
import NotFound from "@/components/not-found";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => {
        return <NotFound />;
    },
});

function RootComponent() {
    const { isAuthCheck, checkAuth, authUser, resendEmailVerification } = useAuthStore();
    const { getCurrentCompanyMember } = useCompanyStore();
    const ranMemberInit = React.useRef(false)
    const [isResending, setIsResending] = React.useState(false)
    const [resendMsg, setResendMsg] = React.useState("")
    const [needLogin, setNeedLogin] = React.useState(false)
    
    React.useEffect(() => {
        // call once without subscribing to avoid re-runs
        checkAuth();
    }, [checkAuth])

    if (isAuthCheck) {
        return <div>Checking authentication...</div>; // or a loading spinner
    }

    return (
        <React.Fragment>
            <ScrollToTop />
            <Toaster position="top-right" />
            {authUser && !authUser.isEmailVerified && (
                <div className="px-4 pt-4">
                    <Alert>
                        <AlertDescription className="flex items-center justify-between gap-2">
                            <span>Your email is not verified.</span>
                            <div className="flex items-center gap-2">
                                {resendMsg && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                                        {resendMsg}
                                        {needLogin && (
                                            <Link to="/auth/signin" className="underline underline-offset-2 cursor-pointer">
                                                Go to Sign in
                                            </Link>
                                        )}
                                    </span>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isResending}
                                    onClick={async () => {
                                        try {
                                            setIsResending(true)
                                            setResendMsg("")
                                            await resendEmailVerification()
                                            setResendMsg("Verification mail sent")
                                            setNeedLogin(false)
                                        } catch (error) {
                                            setNeedLogin(true)
                                            setResendMsg("Login First or Try again later")
                                            console.log(error);
                                        } finally {
                                            setIsResending(false)
                                        }
                                    }}
                                    className="cursor-pointer"
                                >
                                    {isResending ? "Sending..." : "Resend"}
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            <Outlet />
            <TanStackRouterDevtools />
        </React.Fragment>
    );
}
