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
					{properties.length === 0 || properties === undefined ? (
						<Item variant="default">
							<ItemContent>
								<ItemTitle className="text-center text-neutral-500 text-sm">
									No properties Owned
								</ItemTitle>
							</ItemContent>
						</Item>
					) : (
						properties.map((property, index) => (
							<div key={property.id}>
								<Item variant="default">
									<ItemContent>
										<ItemTitle>{property.id}</ItemTitle>
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
