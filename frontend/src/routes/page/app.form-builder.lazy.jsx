import { createLazyFileRoute } from "@tanstack/react-router";
import FormBuilderModular from "@/components/form/FormBuilderModular";
import { PERMIT_CONFIG } from "@/lib/constants";

export const Route = createLazyFileRoute("/page/app/form-builder")({
    component: RouteComponent,
});

function RouteComponent() {
    const cfg = PERMIT_CONFIG.work;
    return (
        <FormBuilderModular
            title={cfg.title}
            sectionsTemplate={cfg.template}
            startWithTemplate={true}
        />
    );
}
