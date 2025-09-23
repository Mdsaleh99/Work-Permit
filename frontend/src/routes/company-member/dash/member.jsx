import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import MemberDashboardLayout from '@/components/company/MemberDashboardLayout'
import { ensureCompanyMember } from '../../../lib/ensureCompanyMember.js'

export const Route = createFileRoute('/company-member/dash/member')({
  beforeLoad: ensureCompanyMember,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MemberDashboardLayout>
      <Outlet />
    </MemberDashboardLayout>
  )
}
