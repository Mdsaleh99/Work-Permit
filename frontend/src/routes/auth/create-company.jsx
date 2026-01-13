import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/create-company')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/create-company"!</div>
}
