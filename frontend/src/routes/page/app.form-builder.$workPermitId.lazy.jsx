import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import FormBuilder from "@/components/form/FormBuilder";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export const Route = createLazyFileRoute("/page/app/form-builder/$workPermitId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { workPermitId } = useParams({ from: "/page/app/form-builder/$workPermitId" });
    const { getWorkPermitById, currentWorkPermit, isFetching } = useWorkPermitStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWorkPermit = async () => {
            try {
                await getWorkPermitById(workPermitId);
            } catch (error) {
                console.error("Error loading work permit:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (workPermitId) {
            loadWorkPermit();
        } else {
            setIsLoading(false);
        }
    }, [workPermitId, getWorkPermitById]);

    if (isLoading || isFetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading work permit...</span>
            </div>
        );
    }

    if (!currentWorkPermit) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Permit Not Found</h2>
                    <p className="text-gray-600">The requested work permit could not be found.</p>
                </div>
            </div>
        );
    }

    // Transform the work permit data to match FormBuilder's expected format
    const sectionsTemplate = currentWorkPermit.sections?.map(section => ({
        id: section.id,
        title: section.title,
        enabled: section.enabled,
        components: section.components?.map(component => ({
            id: component.id,
            label: component.label,
            type: component.type,
            required: component.required,
            enabled: component.enabled,
            options: component.options || []
        })) || []
    })) || [];

    console.log("Route component data:", { 
        workPermitId, 
        currentWorkPermit, 
        sectionsTemplate,
        title: currentWorkPermit.title 
    });

    return (
        <FormBuilder 
            title={currentWorkPermit.title}
            sectionsTemplate={sectionsTemplate}
            startWithTemplate={true}
            workPermitId={workPermitId}
        />
    );
}