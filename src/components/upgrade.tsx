import Image from "next/image";
import { Button } from "@/components/ui/8bit/button";
import TileDataJson from "@/lib/tiledata";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function Upgrade({
	playerId,
	propertyIndex,
	roomKey,
	disabled,
}: {
	playerId: string;
	propertyIndex: number;
	roomKey: string;
	disabled: boolean;
}) {
	const { socket } = useSocketStore();
	const { upgradeProperty } = useGameStore();

	const handleUpgrade = () => {
		const tileData = TileDataJson[propertyIndex];
		if (!tileData) return;

		const rentCostArray = tileData.rent;
		const upgradeCostArray = tileData.upgrade;
		if (
			!socket ||
			rentCostArray === undefined ||
			upgradeCostArray === undefined
		)
			return;
		const rentCost = rentCostArray[0];
		const upgradeCost = upgradeCostArray[0];
		if (rentCost === undefined || upgradeCost === undefined) return;
		const totalCost = -1 * (rentCost + upgradeCost);
		upgradeProperty(playerId, socket, propertyIndex, roomKey, totalCost);
	};
	return (
		<Button disabled={disabled} onClick={handleUpgrade}>
			<Image
				alt="Arrow Up"
				className="pixelated"
				fill
				src="/icons/arrow-up-solid.svg"
			/>
		</Button>
	);
}
