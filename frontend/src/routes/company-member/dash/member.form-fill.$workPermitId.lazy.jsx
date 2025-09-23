import FormFiller from '@/components/form/FormFiller';
import { useWorkPermitStore } from '@/store/useWorkPermitStore';
import { useParams, createLazyFileRoute } from '@tanstack/react-router'
import MemberDashboardLayout from '@/components/company/MemberDashboardLayout'
import { ensureCompanyMemberWithPermit } from '../../../lib/ensureCompanyMember.js'
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createLazyFileRoute(
  '/company-member/dash/member/form-fill/$workPermitId',
)({
  // beforeLoad: ensureCompanyMemberWithPermit,
  component: RouteComponent,
})

function RouteComponent() {
  const { workPermitId } = useParams({ from: "/company-member/dash/member/form-fill/$workPermitId" });
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState(null);

    const { getWorkPermitById } = useWorkPermitStore();
    // console.log("work permit id: ", workPermitId);
    

    useEffect(() => {
        (async () => {
            try {
                const wp = await getWorkPermitById(workPermitId);
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
            containerClassName="h-full"
        />
    );
}
