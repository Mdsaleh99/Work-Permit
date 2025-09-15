import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createLazyFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { Flame, Wrench, ClipboardCheck, Shield } from 'lucide-react';
import { WorkPermitList } from '@/components/form/WorkPermitList';

export const Route = createLazyFileRoute('/page/app/permit')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation(); 
  const isIndex = location.pathname === '/page/app/permit';
  const permitTypes = [
    { id: 'work', title: 'General Work Permit', icon: Flame },
    { id: 'loto', title: 'LOTO Permit', icon: Wrench },
    { id: 'hot', title: 'Hot Work Permit', icon: Flame },
    { id: 'cold', title: 'Cold Work Permit', icon: Shield },
  ];

  return (
    <div className="p-6 space-y-6">
      {isIndex ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Choose permit type to continue</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {permitTypes.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="w-5 h-5 text-orange-500" />
                      <span className="truncate">{p.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full" asChild>
                      {/* <Link to="/page/app/permit/$type" params={{ type: p.id }}>Open</Link> */}
                      <Link to={"/page/app/form-builder"}>
                        Open
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Outlet />
      )}
      <div>
        <WorkPermitList />
      </div>
    </div>
  );
}
