import CallToAction from "@/components/client-side/landing-page/CTASection";
import FeaturesSection from "@/components/client-side/landing-page/FeaturesSection";
import HeroSection from "@/components/client-side/landing-page/HeroSection";
import PortofolioSection from "@/components/client-side/landing-page/ShowcaseSection";
import ServicesSection from "@/components/client-side/landing-page/ServicesSection";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<PortofolioSection />
			<ServicesSection />
			<CallToAction />
		</>
	);
}
