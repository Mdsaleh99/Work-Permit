import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Shield,
    FileText,
    Eye,
    ClipboardCheck,
    ArrowRight,
} from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Smart Permit Management",
        description:
            "permit workflows with automated approvals, real-time tracking, and intelligent risk assessment for seamless operations.",
        color: "text-primary",
        gradient: "from-primary/10 to-primary/5",
    },
    {
        icon: FileText,
        title: "Intelligent Incident Tracking",
        description:
            "Advanced incident management with predictive analytics, automated reporting, and machine learning insights for prevention.",
        color: "text-primary",
        gradient: "from-primary/10 to-primary/5",
    },
    {
        icon: Eye,
        title: "Behavioral Analytics",
        description:
            "Real-time observation tracking with AI-driven pattern recognition and predictive safety trend analysis.",
        color: "text-primary",
        gradient: "from-primary/10 to-primary/5",
    },
    {
        icon: ClipboardCheck,
        title: "Digital Audit Suite",
        description:
            "Comprehensive audit management with smart checklists, automated compliance tracking, and instant report generation.",
        color: "text-primary",
        gradient: "from-primary/10 to-primary/5",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.03),transparent_50%)]"></div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-medium backdrop-blur-sm">
                        <span className="text-primary">
                            Comprehensive Safety Platform
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                        One Platform.{" "}
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Infinite Possibilities.
                        </span>
                    </h2>

                    <p className="text-xl lg:text-2xl text-muted-foreground text-pretty max-w-4xl mx-auto leading-relaxed font-light">
                        Transform your safety operations with Zeros1
                        integrated suite of intelligent tools designed for the
                        modern workplace.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl overflow-hidden"
                        >
                            <CardHeader className="space-y-6 p-8">
                                <div className="flex items-start space-x-6">
                                    <div
                                        className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-primary/10 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <feature.icon
                                            className={`h-8 w-8 ${feature.color}`}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </CardTitle>
                                        <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                                            {feature.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <Button
                                    variant="ghost"
                                    className="group/btn text-primary p-0 h-auto font-semibold text-lg hover:bg-transparent"
                                >
                                    Explore Feature
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform duration-300" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
