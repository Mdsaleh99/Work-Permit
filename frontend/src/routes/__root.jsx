import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ScrollToTop from "@/components/scrollToTop";
import NotFound from "@/components/not-found";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => {
        return <NotFound />
    }
});

function RootComponent() {
    return (
        <React.Fragment>
            <ScrollToTop />
            <Navbar />
            <Outlet />
            <Footer />
            <TanStackRouterDevtools />
        </React.Fragment>
    );
}
