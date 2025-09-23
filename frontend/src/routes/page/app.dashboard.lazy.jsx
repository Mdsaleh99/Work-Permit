import { PermitsDashboard } from '@/components/permit-dashboard';
import { createLazyFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useCompanyStore } from '@/store/useCompanyStore';

export const Route = createLazyFileRoute('/page/app/dashboard')({
  beforeLoad: async () => {
    // Allow: ADMIN, SUPER_ADMIN (primary user) OR COMPANY_MEMBER/MANAGER (member)
    const authStore = useAuthStore.getState();
    const companyStore = useCompanyStore.getState();

    // 1) Prefer member auth first — if member is present (or can be fetched), skip user check to avoid /auth/current-user 419 noise
    let member = companyStore.currentCompanyMember;
    if (!member) {
      member = await companyStore.getCurrentCompanyMember().catch(() => null);
    }
    member = member ?? useCompanyStore.getState().currentCompanyMember;
    const memberAllowed = Boolean(member && (member.role === 'COMPANY_MEMBER' || member.role === 'MANAGER'));
    if (memberAllowed) return; // member can access dashboard

    // 2) Otherwise fall back to primary user auth
    if (!authStore.authUser) {
      await authStore.checkAuth();
    }
    const user = useAuthStore.getState().authUser;
    const userAllowed = Boolean(user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'));
    if (!userAllowed) {
      throw redirect({ to: '/auth/signin' });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  
  return (
    <div>
      <PermitsDashboard />
    </div>
  );
}
