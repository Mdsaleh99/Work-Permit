import FormBuilder from '@/components/form/FormBuilder';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/abc/app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <FormBuilder />
  );
}
