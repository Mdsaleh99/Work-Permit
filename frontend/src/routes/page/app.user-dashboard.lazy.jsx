import UserDashboard from '@/components/user-dashboard'
import { createLazyFileRoute, redirect } from '@tanstack/react-router'
import { useCompanyStore } from '@/store/useCompanyStore'

export const Route = createLazyFileRoute('/page/app/user-dashboard')({
  beforeLoad: async () => {
    const { currentCompanyMember, getCurrentCompanyMember } = useCompanyStore.getState()
    if (!currentCompanyMember) {
      await getCurrentCompanyMember().catch(() => {})
    }
    if (!useCompanyStore.getState().currentCompanyMember) {
      throw redirect({ to: '/company-member/signin' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <UserDashboard />
    </div>
  )
}
