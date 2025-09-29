import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page/app/a/b')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/page/app/a/b"!</div>
}
