import { Check } from "lucide-react";

const benefits = [
    "Dynamic dashboard that gives you full overview of your HSE processes",
    "Customizable form fields, workflows and user rights",
    "Available on web",
    "Instant alerts and notifications for optimal resource management",
];

export function BenefitsSection() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl lg:text-5xl font-bold text-balance leading-tight">
                            Drive measurable improvement in your{" "}
                            <span className="text-primary">
                                safety processes
                            </span>
                        </h2>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {benefit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10">
                            <img
                                src="/document-management-system.jpg"
                                alt="SecureFlow Platform Overview"
                                width={700}
                                height={500}
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
