import { redirect } from "@tanstack/react-router";
import { useCompanyStore } from "@/store/useCompanyStore";

export const ensureCompanyMember = async () => {
  const store = useCompanyStore.getState();
  const memberFromState = store.currentCompanyMember;
  // console.log("memberFromState: ", memberFromState);
  const fetched = memberFromState ?? (await store.getCurrentCompanyMember().catch(() => null));
  // console.log("fetched: ", fetched);
  const finalMember = fetched ?? useCompanyStore.getState().currentCompanyMember;
  // console.log("finalMember: ", finalMember);
  if (!finalMember) {
    throw redirect({ to: "/company-member/signin" });
  }
};

export const ensureCompanyMemberWithPermit = async ({ params }) => {
  await ensureCompanyMember();
  const member = useCompanyStore.getState().currentCompanyMember;
  // Support either an ids array or populated objects from API
  const allowedIdsFromObjects = Array.isArray(member?.allowedWorkPermits)
    ? member.allowedWorkPermits.map((p) => p.id)
    : [];
  const allowedIds = Array.isArray(member?.allowedWorkPermitIds)
    ? member.allowedWorkPermitIds
    : allowedIdsFromObjects;
  const assigned = Array.isArray(allowedIds)
    ? allowedIds.includes(params.workPermitId)
    : true;
  if (!assigned) {
    throw redirect({ to: "/company-member/dash/member/dashboard" });
  }
};

