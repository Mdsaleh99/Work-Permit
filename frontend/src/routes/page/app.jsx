import { DashboardLayout } from '@/components/dashboard-layout'
import { createFileRoute } from '@tanstack/react-router'

// * https://tanstack.com/router/v1/docs/framework/react/routing/routing-concepts#layout-routes
// * https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
// * https://date-fns.org/docs/Getting-Started
export const Route = createFileRoute('/page/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><DashboardLayout /></div>
}
