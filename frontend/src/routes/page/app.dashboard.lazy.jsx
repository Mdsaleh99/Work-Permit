import { PermitsDashboard } from '@/components/permit-dashboard';
import { createLazyFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useCompanyStore } from '@/store/useCompanyStore';

export const Route = createLazyFileRoute('/page/app/dashboard')({
  beforeLoad: async () => {
    // Primary app dashboard: only primary users allowed
    const authStore = useAuthStore.getState();
    if (!authStore.authUser) {
      await authStore.checkAuth();
    }
    const user = useAuthStore.getState().authUser;
    const userAllowed = Boolean(user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'));
    if (!userAllowed) throw redirect({ to: '/auth/signin' });
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
