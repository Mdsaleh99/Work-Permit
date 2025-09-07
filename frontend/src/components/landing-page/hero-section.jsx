import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function HeroSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-primary/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium">
                            <Shield className="w-4 h-4 text-white" />
                            <span className="text-white font-semibold">
                                Next-Gen Safety Intelligence
                            </span>
                        </div>

                        <div className="space-y-8">
                            <h1 className="text-5xl lg:text-7xl font-bold text-balance leading-[1.1] tracking-tight">
                                Transform your{" "}
                                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    safety operations
                                </span>{" "}
                                with AI
                            </h1>

                            <p className="text-xl lg:text-2xl text-muted-foreground text-pretty leading-relaxed max-w-2xl font-light">
                                SecureFlow revolutionizes workplace safety with
                                intelligent automation, real-time insights, and
                                seamless collaboration across your entire
                                organization.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* ✅ Use TanStack Router Link */}
                            <Link to="/start-trial">
                                <Button
                                    size="lg"
                                    className="group bg-primary hover:bg-primary/90 text-white text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Link to="/demo">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="group text-lg px-10 py-4 rounded-xl border-2 hover:bg-primary/5 transition-all duration-300 bg-transparent"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>14-day free trial</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="relative lg:pl-8">
                        <div className="relative z-10 group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                                {/* ✅ Replace next/image with img */}
                                <img
                                    src="/dashboard.png"
                                    alt="SecureFlow Dashboard"
                                    className="rounded-xl shadow-2xl w-full h-auto border-20 border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
