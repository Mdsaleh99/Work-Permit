import { useState } from "react";
import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart3, FileText, Menu, X } from "lucide-react";

const navigation = [
    {
        name: "Dashboard",
        href: "/abc/app/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Analysis",
        href: "/dashboard/analysis",
        icon: BarChart3,
    },
    {
        name: "Work Permit",
        href: "/dashboard/workpermit",
        icon: FileText,
    },
];

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

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
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
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

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
