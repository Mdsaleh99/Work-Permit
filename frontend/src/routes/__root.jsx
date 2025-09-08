import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ScrollToTop from "@/components/scrollToTop";
import NotFound from "@/components/not-found";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => {
        return <NotFound />;
    },
});

function RootComponent() {
    return (
        <React.Fragment>
            <ScrollToTop />
            <Outlet />
            <TanStackRouterDevtools />
        </React.Fragment>
    );
}
