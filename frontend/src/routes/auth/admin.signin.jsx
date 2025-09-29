import { AdminSignInForm } from '@/components/auth/admin-signin-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/admin/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminSignInForm />
  )
}

