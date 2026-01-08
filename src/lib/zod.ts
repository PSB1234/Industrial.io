import z from "zod";
import { id } from "zod/v4/locales";

const OptionSchema = z.object({
	parkingMoneyAmount: z.boolean(),
	passGoMoneyAmount: z.number(),
	allowTrading: z.boolean(),
	allowMortgagingProperties: z.boolean(),
	auctionProperties: z.boolean(),
	speedUpGameMode: z.boolean(),
	numberOfPlayers: z.number().min(2).max(8),
	startingMoney: z.number(),
	allowPlayersToJoinMidGame: z.boolean(),
	turnTimeLimit: z.enum(["30", "60", "unlimited"]),
	autoRollDiceAfterTimeout: z.boolean(),
	bankruptcyHandling: z.enum(["strict", "forgiving"]),
	allowChat: z.boolean(),
	gameEndsWhenOnlyOnePlayerRemains: z.boolean(),
});
const ChatSchema = z.object({
	message: z.string().nonempty({ message: "Message shouldn't be empty" }),
});
const roomKeyDataSchema = z.string();

export { OptionSchema, roomKeyDataSchema, ChatSchema };
