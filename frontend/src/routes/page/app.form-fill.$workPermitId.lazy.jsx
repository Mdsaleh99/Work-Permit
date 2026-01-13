import React, { useEffect, useState } from "react";
import {
    createLazyFileRoute,
    useParams,
    useNavigate,
} from "@tanstack/react-router";
import { Loader } from "lucide-react";
import FormFiller from "@/components/form/FormFiller";
import { workPermitService } from "@/services/workPermit.service";
import { useAuthStore } from "@/store/useAuthStore";
import WorkPermitViewer from "@/components/form/WorkPermitViewer";

export const Route = createLazyFileRoute("/page/app/form-fill/$workPermitId")({
    // Parent route already ensures ADMIN/SUPER_ADMIN auth
    component: FormFillPage,
});

function FormFillPage() {
    const { workPermitId } = useParams({
        from: "/page/app/form-fill/$workPermitId",
    });
    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState(null);
    const [existingSubmission, setExistingSubmission] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const wp =
                    await workPermitService.getWorkPermitById(workPermitId);
                setForm(wp?.data || wp);
                // Check for existing submission by this admin user
                const list =
                    await workPermitService.listSubmissions(workPermitId);
                const subs = Array.isArray(list?.data) ? list.data : [];
                const mine = subs.find(
                    (s) => s.submittedByUser?.id === authUser?.id,
                );
                setExistingSubmission(mine || null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [workPermitId, authUser?.id]);

    const sectionsTemplate = (form?.sections || []).map((s) => ({
        id: s.id,
        title: s.title,
        enabled: s.enabled,
        components: (s.components || []).map((c) => ({
            id: c.id,
            label: c.label,
            type: c.type,
            required: c.required,
            enabled: c.enabled,
            options: c.options || [],
        })),
    }));

    const handleSubmit = async (answers) => {
        if (existingSubmission) {
            await workPermitService.updateSubmission(workPermitId, answers);
        } else {
            await workPermitService.createSubmission(workPermitId, answers);
        }
        setSubmitted(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
                <Loader className="w-5 h-5 animate-spin mr-2" /> Loading...
            </div>
        );
    }

    if (submitted) {
        return (
            <WorkPermitViewer
                title={form?.title || "Work Permit"}
                sectionsTemplate={sectionsTemplate}
                workPermitId={workPermitId}
            />
        );
    }

    return (
        <FormFiller
            title={form?.title || "Work Permit"}
            sectionsTemplate={sectionsTemplate}
            permitNo={form?.workPermitNo}
            onSubmit={handleSubmit}
            isSubmitting={false}
            initialAnswers={existingSubmission?.answers}
            workPermitId={workPermitId}
        />
    );
}
