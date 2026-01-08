import Image from "next/image";
import type { TileDataSchema } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";
import { Card, CardContent } from "./ui/8bit/card";
import { Button } from "./ui/button";
export default function Tile({
	className,
	TileData,
}: {
	className: string;
	TileData: TileDataSchema;
}) {
	const { checkPropertyIsOwned, getColorByPropertyIndex, getRankOfProperty } =
		useGameStore();
	return (
		<Card
			className={cn(
				className,
				"flex min-h-full min-w-full items-center justify-between p-0",
			)}
		>
			<CardContent className={cn(className, "flex min-h-full min-w-full p-0")}>
				{(TileData.rent || TileData.price) && (
					<div
						className={cn(
							className,
							"flex h-full w-full items-center justify-between p-2",
						)}
					>
						{TileData.price && (
							<p
								className={cn(
									"flex w-full flex-wrap px-2 text-[9px]",
									(TileData.id >= 1 && TileData.id <= 7) ||
										(TileData.id >= 25 && TileData.id <= 31)
										? "justify-start text-start"
										: "justify-end text-end",
								)}
							>
								${TileData.price}
							</p>
						)}
						{TileData.rent && checkPropertyIsOwned(TileData.id) && (
							<Button
								className="relative h-4 w-4 rounded-none border-4 border-white p-3"
								style={{
									backgroundColor: getColorByPropertyIndex(TileData.id),
								}}
								variant={"default"}
							>
								<div
									className="pixelated absolute inset-0 h-full w-full bg-white p-0.5"
									style={{
										maskOrigin: "content-box",
										WebkitMaskOrigin: "content-box",
										maskImage: `url(/upgrade-icons/house-${getRankOfProperty(TileData.id)}.svg)`,
										maskSize: "contain",
										maskPosition: "center",
										maskRepeat: "no-repeat",
										WebkitMaskImage: `url(/upgrade-icons/house-${getRankOfProperty(TileData.id)}.svg)`,
										WebkitMaskSize: "contain",
										WebkitMaskPosition: "center",
										WebkitMaskRepeat: "no-repeat",
									}}
								/>{" "}
								<div
									className="pixelated absolute inset-0 h-full w-full bg-white p-0.5"
									style={{
										maskOrigin: "content-box",
										WebkitMaskOrigin: "content-box",
										maskImage: `url(/upgrade-icons/house-${getRankOfProperty(TileData.id)}.svg)`,
										maskSize: "contain",
										maskPosition: "center",
										maskRepeat: "no-repeat",
										WebkitMaskImage: `url(/upgrade-icons/house-${getRankOfProperty(TileData.id)}.svg)`,
										WebkitMaskSize: "contain",
										WebkitMaskPosition: "center",
										WebkitMaskRepeat: "no-repeat",
									}}
								/>
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
