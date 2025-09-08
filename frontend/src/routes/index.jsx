import { Footer } from "@/components/footer";
import { BenefitsSection } from "@/components/landing-page/benefits-section";
import { CtaSection } from "@/components/landing-page/cta-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { HeroSection } from "@/components/landing-page/hero-section";
import { IndustrySection } from "@/components/landing-page/industry-section";
import { Navbar } from "@/components/navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="min-h-screen">
            <main>
                <Navbar />
                <HeroSection />
                <FeaturesSection />
                <BenefitsSection />
                <IndustrySection />
                <CtaSection />
                <Footer />
            </main>
        </div>
    );
}
