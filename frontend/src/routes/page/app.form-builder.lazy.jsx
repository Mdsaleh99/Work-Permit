import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/page/app/form-builder")({
    component: RouteComponent,
});

function RouteComponent() {
    // Acts as a layout for builder routes. Children will render here.
    return <Outlet />;
}
