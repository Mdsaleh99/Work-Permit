import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/signup")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <div className="bg-red-600">Hello "/auth/signup"!</div>
            <div className="flex min-h-svh flex-col items-center justify-center">
                <Button>Click me</Button>
            </div>
        </div>
    );
}
