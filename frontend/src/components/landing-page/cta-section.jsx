import { Button } from "@/components/ui/button";

export function CtaSection() {
    return (
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl lg:text-5xl font-bold text-balance">
                        Getting started is easy... and free!
                    </h2>

                    <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed">
                        All we need is your work email to get you on board. No
                        set-up fee, no long-term contracts, no credit card.
                    </p>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4"
                        >
                            Request free trial
                        </Button>
                    </div>

                    <div className="pt-8">
                        <p className="text-primary-foreground/80">
                            Looking for a customized safety solution?{" "}
                            <Button
                                variant="link"
                                className="text-primary-foreground underline p-0 h-auto font-medium"
                            >
                                Get in touch.
                            </Button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full translate-x-48 translate-y-48"></div>
        </section>
    );
}
