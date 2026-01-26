import type { TileDataSchema } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";
export default function Tile({
	className,
	TileData,
}: {
	className: string;
	TileData: TileDataSchema;
}) {
	const { checkPropertyIsOwned, getColorByPropertyIndex, getRankOfProperty } =
		useGameStore();
	const isOwned = checkPropertyIsOwned(TileData.id);
	const ownerColor = isOwned ? getColorByPropertyIndex(TileData.id) : undefined;
	const rank = getRankOfProperty(TileData.id);

	// Determine side
	const isTop = TileData.id >= 1 && TileData.id <= 7;
	const isRight = TileData.id >= 9 && TileData.id <= 15;
	const isBottom = TileData.id >= 17 && TileData.id <= 23;
	const isLeft = TileData.id >= 25 && TileData.id <= 31;
	//Determine image width and height
	let positionClass = "";
	let directionClass = "";
	let textDirectionClass = "";
	if (isTop) {
		positionClass = " max-h-1/3 border-t-6";
		directionClass = "flex-col-reverse ";
		textDirectionClass = "items-center justify-center";
	} else if (isBottom) {
		positionClass = " max-h-1/3  border-b-6";
		directionClass = "flex-col ";
		textDirectionClass = "items-center justify-center";
	} else if (isLeft) {
		positionClass = "max-w-1/3 border-l-6";
		directionClass = "flex-row-reverse  ";
		textDirectionClass = "items-end justify-start";
	} else if (isRight) {
		positionClass = " max-w-1/3 border-r-6";
		directionClass = "flex-row";
		textDirectionClass = "items-end justify-end";
	} else {
		positionClass = "border-0";
		textDirectionClass = "items-center justify-center";
	}

	return (
		<div
			className={cn(
				"relative flex h-full w-full min-w-14 flex-row justify-between border-foreground border-y-6", //change min-w for responsiveness
				className,
			)}
			style={{ borderColor: ownerColor }}
		>
			<div
				className={cn("flex overflow-clip text-clip p-0", textDirectionClass)}
			>
				<p className="text-center text-[10px]">{TileData.name.toLowerCase()}</p>
			</div>
			<div
				className={cn(positionClass, "h-full w-full border-foreground p-0")}
				style={{
					borderColor: ownerColor,
				}}
			>
				{/* flag  section */}
				{TileData.flagName && TileData.type === "property" && (
					<div className={cn("h-full w-full", directionClass)}>
						<div
							className="relative m-0 h-full w-full items-center justify-center overflow-clip border-foreground p-0"
							style={{ borderColor: ownerColor }}
						>
							{/** biome-ignore lint/performance/noImgElement: <explanation> */}
							<img
								alt={"" + TileData.id}
								className={cn("h-full w-full")}
								src={`/tiles/${TileData.flagName.toLowerCase()}.png`}
							/>
							{/* blur effect */}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0"
								style={{
									borderColor: ownerColor,
									backgroundColor: `rgba(0,0,0, ${ownerColor ? 0.5 : 0})`,
								}}
							/>
						</div>
					</div>
				)}
			</div>
			<div
				aria-hidden="true"
				className="-mx-1.5 pointer-events-none absolute inset-0 border-foreground border-x-6"
				style={{ borderColor: ownerColor }}
			/>
		</div>
	);
}
