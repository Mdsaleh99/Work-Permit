import { createLazyFileRoute } from "@tanstack/react-router";
import { CompanyDetails } from "@/components/form/CompanyDetails";

export const Route = createLazyFileRoute("/page/app/company-details")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CompanyDetails />;
}
