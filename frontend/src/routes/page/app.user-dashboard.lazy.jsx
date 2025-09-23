import UserDashboard from '@/components/user-dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ensureCompanyMember } from '../../lib/ensureCompanyMember.js'

export const Route = createLazyFileRoute('/page/app/user-dashboard')({
  beforeLoad: ensureCompanyMember,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <UserDashboard />
    </div>
  )
}
