import { Button } from "@/components/ui/button";

export function IndustrySection() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl lg:text-5xl font-bold text-balance leading-tight">
                            One platform that works for{" "}
                            <span className="text-primary">your industry</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            SecureFlow's mobile-first platform helps leaders and
                            frontline teams improve every day, with automated
                            workflows, built-in AI and 100,000+ customizable
                            templates to adapt fast and get results.
                        </p>

                        <Button
                            variant="outline"
                            size="lg"
                            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                            Browse 100,000+ checklist and course templates →
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <img
                                src="/high-tech-industry.png"
                                alt="Construction Safety"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-md"
                            />
                            <img
                                src="/manufacturing-technology-industries-scaled.jpg"
                                alt="Manufacturing Safety"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                        <div className="space-y-4 mt-8">
                            <img
                                src="/Industrial technology company story.jpeg"
                                alt="Warehouse Safety"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-md"
                            />
                            <img
                                src="/Facility-Condition-Assessments.jpg"
                                alt="Office Safety"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
