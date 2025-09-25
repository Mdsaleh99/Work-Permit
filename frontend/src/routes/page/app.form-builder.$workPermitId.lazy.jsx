import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import WorkPermitEditor from "@/components/form/WorkPermitEditor";
import { workPermitService } from "@/services/workPermit.service";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";

export const Route = createLazyFileRoute("/page/app/form-builder/$workPermitId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { workPermitId } = useParams({ from: "/page/app/form-builder/$workPermitId" });
    const [isLoading, setIsLoading] = useState(true);
    const [workPermit, setWorkPermit] = useState(null);
    const { setCurrentWorkPermit } = useWorkPermitStore();

    
    
    useEffect(() => {
        const loadWorkPermit = async () => {
            try {
                const data = await workPermitService.getWorkPermitById(workPermitId);
                console.log("data", data);
                
                setWorkPermit(data);
                // Make it available to builder hooks that rely on store
                setCurrentWorkPermit(data);
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
    }, [workPermitId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading work permit...</span>
            </div>
        );
    }

    if (!workPermit) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Permit Not Found</h2>
                    <p className="text-gray-600">The requested work permit could not be found.</p>
                </div>
            </div>
        );
    }

    // Transform the work permit data to match FormBuilder's expected format (robust to different shapes)
    const rawSections = Array.isArray(workPermit.sections)
        ? workPermit.sections
        : Array.isArray(workPermit.form?.sections)
            ? workPermit.form.sections
            : Array.isArray(workPermit.data?.sections)
                ? workPermit.data.sections
                : (typeof workPermit.sections === "string"
                    ? (() => { try { return JSON.parse(workPermit.sections); } catch { return []; } })()
                    : []);

    const sectionsTemplate = rawSections.map(section => ({
        id: section.id,
        title: section.title,
        enabled: section.enabled,
        components: (section.components || []).map(component => ({
            id: component.id,
            label: component.label,
            type: component.type,
            required: component.required,
            enabled: component.enabled,
            options: component.options || [],
            value: component.value, // preserve existing values such as Work Permit No
        }))
    }));

    // console.log("Route component data:", { workPermitId, sectionsTemplate, title: workPermit?.title });

    return (
        <WorkPermitEditor
            key={workPermitId}
            title={workPermit.title || "Work Permit"}
            sectionsTemplate={sectionsTemplate}
            workPermitId={workPermitId}
            workPermit={workPermit}
        />
    );
}