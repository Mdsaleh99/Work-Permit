import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                    <Shield className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-foreground tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text">
                                    Zeros1
                                </span>
                                <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                                    Safety Intelligence
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden lg:block">
                        <div className="flex items-center space-x-1">
                            {[
                                { name: "Platform", href: "#platform" },
                                { name: "Solutions", href: "#solutions" },
                                { name: "Industries", href: "#industries" },
                                { name: "Resources", href: "#resources" },
                                { name: "Enterprise", href: "#enterprise" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl hover:bg-muted/50 group"
                                >
                                    {item.name}
                                    <span className="absolute inset-x-5 -bottom-px h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-3">
                            <Link to={"/auth/signin"}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-medium cursor-pointer rounded-xl text-foreground"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link to={"/auth/signup"}>
                                <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6 rounded-xl text-primary-foreground cursor-pointer"
                                >
                                    Sign up
                                </Button>
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden border-t border-border/40 bg-background backdrop-blur-xl">
                        <div className="px-2 pt-4 pb-6 space-y-2">
                            {[
                                { name: "Platform", href: "#platform" },
                                { name: "Solutions", href: "#solutions" },
                                { name: "Industries", href: "#industries" },
                                { name: "Resources", href: "#resources" },
                                { name: "Enterprise", href: "#enterprise" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 space-y-3 border-t border-border/40 mt-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start font-medium rounded-xl text-foreground"
                                >
                                    Sign In
                                </Button>
                                <Button className="w-full bg-primary hover:bg-primary/90 font-medium rounded-xl text-primary-foreground">
                                    Start Free Trial
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
