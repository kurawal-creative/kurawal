import CallToAction from "@/components/landing-page/CallToAction";
import FeaturesSection from "@/components/landing-page/Features";
import HeroSection from "@/components/landing-page/Hero";
import PortofolioSection from "@/components/landing-page/Showcase";
import ServicesSection from "@/components/landing-page/Services";

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
