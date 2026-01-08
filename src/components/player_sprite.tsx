import { lightenColor } from "@/lib/random_color";

interface PlayerSpriteProps {
	color: string;
	className?: string;
}

export default function PlayerSprite({ color, className }: PlayerSpriteProps) {
	// Parse hex color to rgb for lightening
	// Assuming color is hex string like "#RRGGBB"
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	const lighterColorRgb = lightenColor(r, g, b, 0.4);

	// Convert back to hex for CSS
	const toHex = (n: number) => {
		const hex = n.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	const lighterColorHex = `#${toHex(lighterColorRgb.r)}${toHex(lighterColorRgb.g)}${toHex(lighterColorRgb.b)}`;

	return (
		<svg
			className={className}
			height="100%"
			style={
				{
					"--color": color,
					"--light-color": lighterColorHex,
				} as React.CSSProperties
			}
			version="1.1"
			viewBox="0 0 32 32"
			width="100%"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>player</title>
			{/* Outer square */}
			<rect
				fill="var(--color, #2563eb)"
				height="24"
				stroke="black"
				strokeWidth="1"
				width="24"
				x="4"
				y="4"
			/>

			{/* Inner square */}
			<rect
				fill="var(--light-color, #93c5fd)"
				height="10"
				width="10"
				x="11"
				y="11"
			/>
		</svg>
	);
}
