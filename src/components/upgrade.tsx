import Image from "next/image";
import { Button } from "./ui/8bit/button";
export default function Upgrade() {
	return (
		<Button>
			{" "}
			<Image
				alt="Arrow Up"
				className="pixelated"
				fill
				src="/icons/arrow-up-solid.svg"
			/>
		</Button>
	);
}
