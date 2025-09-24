import UserDashboard from '@/components/user-dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/page/app/user-dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <UserDashboard />
    </div>
  )
}
