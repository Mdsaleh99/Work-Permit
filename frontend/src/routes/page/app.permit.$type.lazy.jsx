import WorkPermitEditor from '@/components/form/WorkPermitEditor';
import HotWorkPermitEditor from '@/components/form/HotWorkPermitEditor';
import ColdWorkPermitEditor from '@/components/form/ColdWorkPermitEditor';
import LOTOPermitEditor from '@/components/form/LOTOPermitEditor';
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { PERMIT_CONFIG } from '@/lib/constants';

export const Route = createLazyFileRoute('/page/app/permit/$type')({
  component: RouteComponent,
})

function RouteComponent() {
  const { type } = useParams({ from: '/page/app/permit/$type' });
  const cfg = PERMIT_CONFIG[type] || PERMIT_CONFIG.work;

  const commonProps = {
    key: type,
    title: cfg.title,
    sectionsTemplate: cfg.template,
    startWithTemplate: true,
    workPermitId: null,
    isReadOnly: false,
  };

  switch (type) {
    case 'hot':
      return <HotWorkPermitEditor {...commonProps} />;
    case 'cold':
      return <ColdWorkPermitEditor {...commonProps} />;
    case 'loto':
      return <LOTOPermitEditor {...commonProps} />;
    default:
      return <WorkPermitEditor {...commonProps} />;
  }
}

