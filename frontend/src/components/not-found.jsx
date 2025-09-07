import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-primary/5 flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-primary/10 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
                            <Search className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                                Page Not Found
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                The page you're looking for doesn't exist
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8 space-y-4">
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Sorry, we couldn't find the page you're looking for. It
                        might have been moved, deleted, or you entered the wrong
                        URL.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white px-8"
                    >
                        <Link href="/">
                            <Home className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="px-8 bg-transparent"
                    >
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </Link>
                    </Button>
                </div>

                {/* Additional Help */}
                <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-primary/10">
                    <h3 className="font-semibold text-foreground mb-3">
                        Need Help?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        If you believe this is an error, please contact our
                        support team.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <Link
                            href="/"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Visit Homepage
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/support"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Contact Support
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/about"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            About SecureFlow
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
