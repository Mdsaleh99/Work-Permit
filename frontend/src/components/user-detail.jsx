import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, Settings } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";

export function UserDetail({ isCollapsed }) {
    const [open, setOpen] = useState(false);
    const { signout, authUser } = useAuthStore()
    const navigate = useNavigate()
    
    const handleSignOut = async () => {
        try {
            await signout();
            navigate({to: "/"})
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.jpg" alt="User" />
                    <AvatarFallback>{authUser?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {authUser?.name}
                        </p>
                        <p className="text-xs text-sidebar-foreground/70 truncate">
                            {authUser?.email}
                        </p>
                    </div>
                )}

                {!isCollapsed && (
                    <div className="flex gap-1">
                        <Link to={"/page/app/user-dashboard"}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-sidebar-foreground  cursor-pointer hover:bg-sidebar-accent"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer"
                                    aria-label="Open logout menu"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-56 p-0">
                                <div className="p-3 border-b">
                                    <p className="text-sm font-medium text-foreground">
                                        Logout
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        You will be logged out of this device.
                                    </p>
                                </div>
                                <div className="p-3 flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpen(false)}
                                        className={"cursor-pointer"}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={handleSignOut}
                                    >
                                        Logout
                                        
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
        </div>
    );
}
