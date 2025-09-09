import FormBuilder from '@/components/form/FormBuilder';
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { PERMIT_CONFIG } from '@/lib/constants';

export const Route = createLazyFileRoute('/page/app/permit/$type')({
  component: RouteComponent,
})

function RouteComponent() {
  const { type } = useParams({ from: '/page/app/permit/$type' });
  const cfg = PERMIT_CONFIG[type] || PERMIT_CONFIG.work;

  return (
    <div>
      <FormBuilder
        key={type}
        title={cfg.title}
        sectionsTemplate={cfg.template}
        startWithTemplate={true}
      />
    </div>
  );
}

