import { createLazyFileRoute } from "@tanstack/react-router";
import FormBuilder from "@/components/form/FormBuilder";

export const Route = createLazyFileRoute("/page/app/form-builder")({
    component: RouteComponent,
});

function RouteComponent() {
    return <FormBuilder />;
}