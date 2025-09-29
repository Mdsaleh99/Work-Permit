import React from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, LogOut, Menu, X } from "lucide-react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MemberDashboardLayout({ children }) {
    const { companyMemberSignOut, currentCompanyMember, getCurrentCompanyMember } = useCompanyStore();
    const state = useRouterState();
    const path = state.location.pathname;
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const onResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    React.useEffect(() => {
        // Ensure member details are loaded for header display
        if (!currentCompanyMember) {
            getCurrentCompanyMember().catch(() => {});
        }
    }, [currentCompanyMember, getCurrentCompanyMember]);

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-40 transform transition-transform duration-200",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}>
                <div className="flex h-full flex-col">
                <div className="px-4 py-4 border-b">
                    <div className="text-lg font-semibold">Member Dashboard</div>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    <Link
                        to="/company-member/dash/member/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100",
                            path.startsWith("/company-member/dash/member/dashboard") && "bg-blue-50 text-blue-700"
                        )}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link
                        to="/company-member/dash/member/permits"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100",
                            path.startsWith("/company-member/dash/member/permits") && "bg-blue-50 text-blue-700"
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        Permits
                    </Link>
                </nav>
                <div className="p-3 border-t mt-auto">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => { await companyMemberSignOut(); navigate({ to: "/company-member/signin" }); }}
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </Button>
                </div>
                </div>
            </aside>

            {/* Mobile overlay when sidebar open */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className={cn("flex-1 flex flex-col overflow-hidden", sidebarOpen ? "ml-64" : "ml-0 lg:ml-0") }>
                {/* Top bar */}
                <header className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen((s) => !s)}
                        >
                            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </Button>
                        <div className="font-semibold">Company Member</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-sm font-medium leading-tight max-w-[140px] truncate">{currentCompanyMember?.name || "Member"}</div>
                            <div className="text-xs text-muted-foreground leading-tight max-w-[160px] truncate">{currentCompanyMember?.email || ""}</div>
                        </div>
                        <Avatar>
                            <AvatarFallback>{(currentCompanyMember?.name || 'M').charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4">
                    {children ?? <Outlet />}
                </main>
            </div>
        </div>
    );
}


