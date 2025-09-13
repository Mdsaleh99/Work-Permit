import { createLazyFileRoute } from "@tanstack/react-router";
import { WorkPermitList } from "@/components/form/WorkPermitList";

export const Route = createLazyFileRoute("/page/app/work-permits")({
    component: RouteComponent,
});

function RouteComponent() {
    return <WorkPermitList />;
}