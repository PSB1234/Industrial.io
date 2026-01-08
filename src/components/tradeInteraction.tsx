import { useState } from "react";
import { Separator } from "@/components/ui/8bit/separator";
import type { Player } from "@/lib/type";
import TradeList, { type TradeData } from "./tradeList";
import { Button } from "./ui/8bit/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/8bit/dialog";
import { Field } from "./ui/field";

export function TradeInteraction({
	currentUser,
	targetPlayer,
	onSubmit,
}: {
	currentUser: Player;
	targetPlayer: Player;
	onSubmit: (targetId: string, offer: TradeData, request: TradeData) => void;
}) {
	// These states hold the data for this specific trade
	const [myOffer, setMyOffer] = useState<TradeData>({
		amount: 0,
		properties: [],
	});
	const [theirOffer, setTheirOffer] = useState<TradeData>({
		amount: 0,
		properties: [],
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"destructive"}>Trade</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Trade with {targetPlayer.username}</DialogTitle>
					<DialogDescription>
						Here's your properties which you can trade with{" "}
						{targetPlayer.username}.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row gap-4">
						<Field>
							<TradeList
								data={myOffer}
								onDataChange={setMyOffer}
								player={currentUser}
								userId={currentUser.id}
							/>
						</Field>
						<Separator orientation="vertical" />
						<Field>
							<TradeList
								data={theirOffer}
								onDataChange={setTheirOffer}
								player={targetPlayer}
								userId={targetPlayer.id}
							/>
						</Field>
					</div>
					<Button
						onClick={() => onSubmit(targetPlayer.id, myOffer, theirOffer)}
					>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
