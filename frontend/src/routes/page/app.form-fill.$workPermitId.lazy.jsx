import React, { useEffect, useState } from "react";
import { createLazyFileRoute, useParams, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import FormFiller from "@/components/form/FormFiller";
import { workPermitService } from "@/services/workPermit.service";
import { workPermitService as coreService } from "@/services/workPermit.service";
import { useCompanyStore } from "@/store/useCompanyStore";

export const Route = createLazyFileRoute("/page/app/form-fill/$workPermitId")({
    beforeLoad: async ({ params }) => {
        const { currentCompanyMember, getCurrentCompanyMember } = useCompanyStore.getState();
        if (!currentCompanyMember) {
            await getCurrentCompanyMember().catch(() => {});
        }
        const member = useCompanyStore.getState().currentCompanyMember;
        if (!member) {
            throw redirect({ to: "/company-member/signin" });
        }
        // Optional: access control - only allow if member is assigned to this form
        const assigned = Array.isArray(member.allowedWorkPermitIds)
            ? member.allowedWorkPermitIds.includes(params.workPermitId)
            : true; // default allow until backend provides this field
        if (!assigned) {
            throw redirect({ to: "/page/app/dashboard" });
        }
    },
    component: FormFillPage,
});

function FormFillPage() {
    const { workPermitId } = useParams({ from: "/page/app/form-fill/$workPermitId" });
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const wp = await coreService.getWorkPermitById(workPermitId);
                setForm(wp?.data || wp);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [workPermitId]);

    const sectionsTemplate = (form?.sections || []).map(s => ({
        id: s.id,
        title: s.title,
        enabled: s.enabled,
        components: (s.components || []).map(c => ({
            id: c.id,
            label: c.label,
            type: c.type,
            required: c.required,
            enabled: c.enabled,
            options: c.options || [],
        })),
    }));

    const handleSubmit = async (answers) => {
        await workPermitService.createSubmission(workPermitId, answers);
        window.history.back();
    };

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
                <Loader className="w-5 h-5 animate-spin mr-2" /> Loading...
            </div>
        );
    }

    return (
        <FormFiller
            title={form?.title || "Work Permit"}
            sectionsTemplate={sectionsTemplate}
            onSubmit={handleSubmit}
            isSubmitting={false}
        />
    );
}

