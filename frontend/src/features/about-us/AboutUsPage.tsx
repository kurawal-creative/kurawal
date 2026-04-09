import AboutHero from "@/components/about-us/AboutHero";
import OurValues from "@/components/about-us/OurValues";
import TeamSection from "@/components/about-us/TeamSection";
import CallToAction from "@/components/landing-page/CallToAction";

export default function AboutUsPage() {
	return (
		<>
			<AboutHero />
			<OurValues />
			<TeamSection />
			<CallToAction />
		</>
	);
}
