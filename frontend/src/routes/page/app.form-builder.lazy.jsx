import { createLazyFileRoute } from "@tanstack/react-router";
import FormBuilderModular from "@/components/form/FormBuilderModular";

export const Route = createLazyFileRoute("/page/app/form-builder")({
    component: RouteComponent,
});

function RouteComponent() {
    return <FormBuilderModular />;
}