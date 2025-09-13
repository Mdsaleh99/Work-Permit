import CompanyForm from '@/components/form/CompanyForm'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/create-company')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><CompanyForm /></div>
}
