import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page/app/a/s')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/page/app/a/s"!</div>
}
