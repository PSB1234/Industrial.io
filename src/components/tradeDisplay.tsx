import type { tradeDisplaySchema } from "@/lib/type";
import TradeReview from "./tradeReview";

import { Card, CardContent, CardHeader } from "./ui/8bit/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from "./ui/8bit/item";

export default function TradeDisplay({
	userId,
	roomKey,
	getUsernameById,
	displayTrade,
}: {
	userId: string;
	roomKey: string;
	getUsernameById: (playerId: string) => string | undefined;
	displayTrade: () => tradeDisplaySchema[];
}) {
	const trades = displayTrade();

	if (trades.length === 0) {
		return (
			<Card>
				<CardHeader>Trade Display</CardHeader>
				<CardContent className="text-center text-neutral-500 text-sm">
					No active trades pending.
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>Trade Display</CardHeader>
			<CardContent>
				<ItemGroup>
					{trades.map((trade, index) => {
						// Assuming tradeSchema has offer/request objects similar to TradeData
						const offerSummary =
							trade.offeredProperties.amount > 0 ||
							trade.offeredProperties.properties.length > 0
								? `$${trade.offeredProperties.amount} + ${trade.offeredProperties.properties.length} props`
								: "Offer";

						return (
							<div key={`${trade.fromPlayerId}-${trade.toPlayerId}-${index}`}>
								<Item variant="default">
									<ItemContent>
										<ItemTitle className="text-sm">
											{getUsernameById(trade.fromPlayerId)}
											<span className="mx-2 text-primary">&rarr;</span>
											{getUsernameById(trade.toPlayerId)}
										</ItemTitle>
										<div className="mt-1 text-muted-foreground text-xs">
											Status: {offerSummary}
										</div>
									</ItemContent>

									{trade.toPlayerId === userId ? (
										<ItemActions className="flex flex-row gap-6">
											<TradeReview roomKey={roomKey} tradeDisplay={trade} />
										</ItemActions>
									) : (
										<ItemActions>
											<span className="px-2 text-muted-foreground text-xs italic">
												Pending
											</span>
										</ItemActions>
									)}
								</Item>
								{/* Render separator only between items */}
								{index < trades.length - 1 && <ItemSeparator />}
							</div>
						);
					})}
				</ItemGroup>
			</CardContent>
		</Card>
	);
}
