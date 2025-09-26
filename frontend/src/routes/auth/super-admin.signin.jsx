import { SuperAdminSignInForm } from '@/components/auth/super-admin-signin-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/super-admin/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SuperAdminSignInForm />
  )
}

