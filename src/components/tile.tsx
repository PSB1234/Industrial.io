import Image from "next/image";
import type { TileDataSchema } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Button } from "./ui/8bit/button";
import { Card, CardContent } from "./ui/8bit/card";
export default function Tile({
	className,
	TileData,
}: {
	className: string;
	TileData: TileDataSchema;
}) {
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
							<p className="wrap-break-word flex w-full flex-wrap px-2 text-start text-[9px] leading-tight">
								${TileData.price}
							</p>
						)}
						{TileData.rent && (
							<Button
								className="relative h-2 w-2 p-2"
								variant={"ghost"}
							>
								<Image
									alt="Arrow Up"
									className="pixelated"
									fill
									src="/icons/arrow-up-solid.svg"
								/>
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
