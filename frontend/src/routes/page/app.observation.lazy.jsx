import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/page/app/observation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/page/app/observation"!</div>
}
