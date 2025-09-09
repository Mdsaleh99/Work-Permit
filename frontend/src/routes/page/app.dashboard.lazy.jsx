import FormBuilder from '@/components/form/FormBuilder';
import { PermitsDashboard } from '@/components/permit-dashboard';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/page/app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PermitsDashboard />
      </div>
  );
}
