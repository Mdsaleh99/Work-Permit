import { CompanyMemberSignin } from '@/components/company/CompanyMemberSignin'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/company-member/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CompanyMemberSignin />
  )
}
