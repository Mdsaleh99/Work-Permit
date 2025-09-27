import { createLazyFileRoute, redirect } from '@tanstack/react-router'
import { PermitApprovalPage } from '@/components/permit-approval/PermitApprovalPage'
import { useAuthStore } from '@/store/useAuthStore'

export const Route = createLazyFileRoute('/page/app/permit-approval')({
  component: PermitApprovalPage,
  beforeLoad: async () => {
    const { authUser, checkAuth } = useAuthStore.getState();

    if (!authUser) {
      await checkAuth();
    }

    const user = useAuthStore.getState().authUser;
    const role = user?.role;
    const isAllowed = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (!user || !isAllowed) {
      throw redirect({ to: "/auth/signin" });
    }
  },
})