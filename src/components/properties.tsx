import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import {
	Item,
	ItemContent,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/8bit/item";
import { useGameStore } from "@/store/game_store";

export default function Properties() {
	const { getProperty, userId } = useGameStore();
	const properties = getProperty(userId);
	return (
		<Card>
			<CardTitle className="px-5">Properties</CardTitle>
			<CardContent className="h-full">
				<ItemGroup>
					{properties === undefined ? (
						<Item variant="default">
							<ItemContent>
								<ItemTitle>No properties Owned</ItemTitle>
							</ItemContent>
						</Item>
					) : (
						properties.map((property, index) => (
							<div key={property}>
								<Item variant="default">
									<ItemContent>
										<ItemTitle>{property}</ItemTitle>
									</ItemContent>
								</Item>
								{index < properties.length - 1 && <ItemSeparator />}
							</div>
						))
					)}
				</ItemGroup>
			</CardContent>
		</Card>
	);
}
