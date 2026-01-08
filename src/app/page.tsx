import Title from "@/components/title";
import MainMenu from "@/components/ui/8bit/blocks/main-menu";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center text-white">
			<Title />
			<MainMenu />
		</main>
	);
}
