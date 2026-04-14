import WebDevelopment from "@/components/services/WebDevelopment";
import ServicesHero from "@/components/services/ServicesHero";
import MobileDevelopment from "@/components/services/MobileDevelopment";
import UiUxDevelopment from "@/components/services/UiUxDevelopment";

export default function ServicesPage() {
	return (
		<>
			<ServicesHero />
			<WebDevelopment />
			<MobileDevelopment />
			<UiUxDevelopment />
		</>
	);
}
