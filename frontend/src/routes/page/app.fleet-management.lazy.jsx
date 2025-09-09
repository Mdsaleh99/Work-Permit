import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/page/app/fleet-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/page/app/fleet-management"!</div>
}
