import { redirect } from "@tanstack/react-router";
import { useCompanyStore } from "@/store/useCompanyStore";

export const ensureCompanyMember = async () => {
  const store = useCompanyStore.getState();
  const memberFromState = store.currentCompanyMember;
  console.log("memberFromState: ", memberFromState);
  const fetched = memberFromState ?? (await store.getCurrentCompanyMember().catch(() => null));
  console.log("fetched: ", fetched);
  const finalMember = fetched ?? useCompanyStore.getState().currentCompanyMember;
  console.log("finalMember: ", finalMember);
  if (!finalMember) {
    throw redirect({ to: "/company-member/signin" });
  }
};

export const ensureCompanyMemberWithPermit = async ({ params }) => {
  await ensureCompanyMember();
  const member = useCompanyStore.getState().currentCompanyMember;
  const assigned = Array.isArray(member?.allowedWorkPermitIds)
    ? member.allowedWorkPermitIds.includes(params.workPermitId)
    : true;
  if (!assigned) {
    throw redirect({ to: "/page/app/dashboard" });
  }
};

