import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ScrollToTop from "@/components/scrollToTop";
import NotFound from "@/components/not-found";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => {
        return <NotFound />;
    },
});

function RootComponent() {
    const { isAuthCheck, checkAuth } = useAuthStore();
    
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
            <Outlet />
            <TanStackRouterDevtools />
        </React.Fragment>
    );
}
