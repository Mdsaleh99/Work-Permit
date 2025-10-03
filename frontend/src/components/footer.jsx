import { Link } from "@tanstack/react-router";

export function Footer() {
    return (
        <footer className="bg-muted py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">
                                    Z
                                </span>
                            </div>
                            <span className="font-bold text-xl">
                                Zeros1
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Transforming workplace safety through innovative
                            digital solutions.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Product</h3>
                        <div className="space-y-2">
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Integrations
                            </Link>
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Security
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Company</h3>
                        <div className="space-y-2">
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Careers
                            </Link>
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Support</h3>
                        <div className="space-y-2">
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Help Center
                            </Link>
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Documentation
                            </Link>
                            <Link
                                href="#"
                                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                Status
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        © 2025 Zeros1. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
