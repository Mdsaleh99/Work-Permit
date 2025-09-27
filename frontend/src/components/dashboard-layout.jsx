import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart3, FileText, Menu, X, Dock, Telescope, PencilRuler, Files, CheckCircle } from "lucide-react";
import { UserDetail } from "./user-detail";
import { useAuthStore } from "@/store/useAuthStore";

const navigation = [
    {
        name: "Dashboard",
        href: "/page/app/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Permits",
        href: "/page/app/permit",
        icon: Dock,
    },
    {
        name: "Observations",
        href: "/page/app/observation",
        icon: FileText,
    },
    {
        name: "Fleet Management",
        href: "/page/app/fleet-management",
        icon: PencilRuler,
    },
    {
        name: "Audits",
        href: "/page/app/audit",
        icon: Files,
    }
];

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { authUser } = useAuthStore();
    
    // Auto-close sidebar on medium and smaller screens, open on large screens
    useEffect(() => {
        const handleResize = () => {
            if (typeof window === "undefined") return;
            const isLarge = window.innerWidth >= 1024; // lg breakpoint
            setSidebarOpen(isLarge);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const location = useLocation();

    // Add Permit Approval link for SUPER_ADMIN users
    const superAdminNavigation = authUser?.role === 'SUPER_ADMIN' ? [
        {
            name: "Permit Approval",
            href: "/page/app/permit-approval",
            icon: CheckCircle,
        }
    ] : [];

    const allNavigation = [...navigation, ...superAdminNavigation];

    return (
        <div className="flex h-screen bg-background">
            <div
                className={cn(
                    "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
                    sidebarOpen ? "w-64" : "w-16",
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                        {sidebarOpen && (
                            <h2 className="text-lg font-semibold text-sidebar-foreground">
                                Dashboard
                            </h2>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-sidebar-foreground hover:bg-sidebar-accent"
                        >
                            {sidebarOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {allNavigation.map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "text-sidebar-foreground",
                                        !sidebarOpen && "justify-center",
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {sidebarOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <UserDetail isCollapsed={!sidebarOpen} />
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="lg:hidden bg-background border-b border-border p-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-foreground"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>

            {/* Removed mobile overlay to prevent dimming/fade effect over content */}
        </div>
    );
}

