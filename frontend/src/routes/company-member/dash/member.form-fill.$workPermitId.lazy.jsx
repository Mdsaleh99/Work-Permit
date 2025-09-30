import FormFiller from '@/components/form/FormFiller';
import { useWorkPermitStore } from '@/store/useWorkPermitStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useParams, createLazyFileRoute, useSearch } from '@tanstack/react-router'
import MemberDashboardLayout from '@/components/company/MemberDashboardLayout'
import { ensureCompanyMemberWithPermit } from '../../../lib/ensureCompanyMember.js'
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { workPermitService } from '@/services/workPermit.service';
import WorkPermitViewer from '@/components/form/WorkPermitViewer';

export const Route = createLazyFileRoute(
  '/company-member/dash/member/form-fill/$workPermitId',
)({
  beforeLoad: ensureCompanyMemberWithPermit,
  component: RouteComponent,
})

function RouteComponent() {
  const { workPermitId } = useParams({ from: "/company-member/dash/member/form-fill/$workPermitId" });
  const { edit } = useSearch({ from: "/company-member/dash/member/form-fill/$workPermitId" });
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState(null);
    const [existingSubmission, setExistingSubmission] = useState(null);
    const { currentCompanyMember, getCurrentCompanyMember } = useCompanyStore();

    const { getWorkPermitById } = useWorkPermitStore();
    // console.log("work permit id: ", workPermitId);
    

    useEffect(() => {
        (async () => {
            try {
                if (!currentCompanyMember?.id) {
                    await getCurrentCompanyMember();
                }
                const wp = await getWorkPermitById(workPermitId);
                setForm(wp?.data || wp);
                // fetch existing submissions and take latest by this member
                const list = await workPermitService.listSubmissions(workPermitId);
                const subs = Array.isArray(list?.data) ? list.data : [];
                const mine = subs.find(s => s.submittedBy?.id === (currentCompanyMember?.id));
                setExistingSubmission(mine || null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [workPermitId, currentCompanyMember?.id]);

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

    const [submitted, setSubmitted] = useState(false);
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
                title={form?.title || 'Work Permit'}
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
            containerClassName="h-full"
            initialAnswers={edit && existingSubmission ? existingSubmission.answers : undefined}
            workPermitId={workPermitId}
        />
    );
}