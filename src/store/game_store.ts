import type { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TradeData } from "@/components/tradeList";
import { generateColorPair } from "@/lib/random_color";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type {
	ClientToServerEvents,
	Player,
	ServerToClientEvents,
	tradeDisplaySchema,
} from "@/lib/type";

export interface GameStoreState {
	players: Player[];
	username: string;
	userId: string;
	turn: number;
	color: string;
	votedPlayers: string[];
	trade: tradeDisplaySchema[];
}

export interface GameStoreActions {
	initializeSocket: (
		roomKey: string,
		Socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
	) => void;
	getPlayerCount: () => number;
	setState: (state: Partial<GameStoreState>) => void;
	setUsername: (username: string) => void;
	setPlayers: (players: Player[]) => void;
	setColor: (color: string) => void;
	setVotedPlayers: (playerIds: string[]) => void;
	addProperty: (playerId: string, propertyIndex: number) => void;
	checkPropertyIsOwned: (propertyIndex: number) => boolean;
	checkPropertyOwnedByPlayer: (
		playerId: string,
		propertyIndex: number,
	) => boolean;
	getPropertyCount: (playerId: string) => number;
	getProperty: (playerId: string) => number[];
	removeProperty: (playerId: string, propertyIndex: number) => void;
	updatePlayer: (id: string, updates: Partial<Player>) => void;
	sendVote: (
		roomKey: string,
		playerId: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
	) => void;
	sendTrade: (
		roomKey: string,
		userId: string,
		playerId: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
		tradeData: { offer: TradeData; request: TradeData },
	) => void;
	acceptTrade: (
		fromPlayer: string,
		toPlayer: string,
		roomKey: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
		tradeData: { offer: TradeData; request: TradeData },
		status: "accepted" | "rejected",
	) => void;
	displayTrade: () => tradeDisplaySchema[];
	getUsernameById: (playerId: string) => string | undefined;
}

export type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			players: [],
			username: "",
			userId: "",
			color: "",
			turn: 1,
			votedPlayers: [],
			trade: [],
			initializeSocket: (
				roomKey: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
			) => {
				if (!socket) return;
				const joinRoom = () => {
					const { username, userId, color } = get();
					let finalColor = color;
					if (!finalColor) {
						const { original } = generateColorPair();
						finalColor = original;
						set({ color: finalColor });
					}
					// Emit JOIN_ROOM with stored username
					socket.emit(
						SOCKET_EVENTS.JOIN_ROOM,
						username,
						roomKey,
						finalColor,
						(username: string, playerList: Player[]) => {
							// Server sends back the confirmed username and player list
							set({ username, players: playerList });
						},
					);
				};
				// Listen for game loop broadcasts (other players joining)
				const handleGameLoop = (receivedRoomKey: string, player: Player) => {
					if (receivedRoomKey !== roomKey) return;
					set((state) => {
						const exists = state.players.some((p) => p.id === player.id);
						if (exists) return {}; // No change if player already exists
						return { players: [...state.players, player] };
					});
				};
				const handlePlayerLeft = (playerId: string) => {
					set((state) => ({
						players: state.players.filter((p) => p.id !== playerId),
					}));
				};
				const handleReceiveMoney = (money: number, userId: string) => {
					console.log("DEBUG: RECEIVE_MONEY event triggered", {
						money,
						userId,
					});
					set((state) => {
						console.log("DEBUG: Current players state", state.players);
						return {
							players: state.players.map((p) =>
								p.id === userId ? { ...p, money } : p,
							),
						};
					});
				};

				const handlePropertyBought = (propertyId: number, userId: string) => {
					get().addProperty(userId, propertyId);
				};

				const handleReceiveTurn = (turn: number) => {
					set({ turn });
				};

				const handleReceiveVote = (
					playerId: string,
					votes: number,
					voterId: string,
				) => {
					set((state) => {
						const updatedVotedPlayers =
							voterId === state.userId
								? [...state.votedPlayers, playerId]
								: state.votedPlayers;
						return {
							players: state.players.map((p) =>
								p.id === playerId ? { ...p, votes } : p,
							),
							votedPlayers: updatedVotedPlayers,
						};
					});
				};

				const handleYourVotes = (votedPlayerIds: string[]) => {
					set({ votedPlayers: votedPlayerIds });
				};

				const handleReceiveTradeOffer = (
					fromPlayer: string,
					toPlayer: string,
					tradeData: { offer: TradeData; request: TradeData },
				) => {
					set((state) => {
						// Check if a pending trade already exists between these players
						const existingTradeIndex = state.trade.findIndex(
							(t) =>
								t.fromPlayerId === fromPlayer &&
								t.toPlayerId === toPlayer &&
								t.status === "pending",
						);

						const newTrade: tradeDisplaySchema = {
							fromPlayerId: fromPlayer,
							toPlayerId: toPlayer,
							offeredProperties: tradeData.offer,
							requestedProperties: tradeData.request,
							status: "pending",
						};

						if (existingTradeIndex !== -1) {
							// Update existing trade
							const updatedTrades = [...state.trade];
							updatedTrades[existingTradeIndex] = newTrade;
							return { trade: updatedTrades };
						}

						return { trade: [...state.trade, newTrade] };
					});
				};

				const handleReceiveConfirmTradeOffer = (
					fromPlayer: string,
					toPlayer: string,
				) => {
					set((state) => {
						const trade = state.trade.find(
							(t) => t.fromPlayerId === fromPlayer && t.toPlayerId === toPlayer,
						);

						if (!trade) return {};
						return {
							trade: state.trade.filter(
								(t) =>
									!(t.fromPlayerId === fromPlayer && t.toPlayerId === toPlayer),
							),
						};
					});
				};

				// Remove any existing listeners to prevent duplicates
				socket.off(SOCKET_EVENTS.GAME_LOOP);
				socket.off(SOCKET_EVENTS.PLAYER_LEFT);
				socket.off(SOCKET_EVENTS.RECEIVE_MONEY);
				socket.off(SOCKET_EVENTS.PROPERTY_BOUGHT);
				socket.off(SOCKET_EVENTS.RECEIVE_TURN);
				socket.off(SOCKET_EVENTS.RECEIVE_VOTE);
				socket.off(SOCKET_EVENTS.YOUR_VOTES);
				socket.off(SOCKET_EVENTS.RECEIVE_TRADE_OFFER);
				socket.off(SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER);
				socket.off("reconnect");

				socket.on(SOCKET_EVENTS.GAME_LOOP, handleGameLoop);
				socket.on(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
				socket.on(SOCKET_EVENTS.RECEIVE_MONEY, handleReceiveMoney);
				socket.on(SOCKET_EVENTS.PROPERTY_BOUGHT, handlePropertyBought);
				socket.on(SOCKET_EVENTS.RECEIVE_TURN, handleReceiveTurn);
				socket.on(SOCKET_EVENTS.RECEIVE_VOTE, handleReceiveVote);
				socket.on(SOCKET_EVENTS.YOUR_VOTES, handleYourVotes);
				socket.on(SOCKET_EVENTS.RECEIVE_TRADE_OFFER, handleReceiveTradeOffer);
				socket.on(
					SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER,
					handleReceiveConfirmTradeOffer,
				);

				// Join on initial connection
				joinRoom();
				// Rejoin on reconnect
				socket.on("reconnect", joinRoom);
				// Cleanup
				socket.once("disconnect", () => {
					socket.off(SOCKET_EVENTS.GAME_LOOP, handleGameLoop);
					socket.off(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
					socket.off(SOCKET_EVENTS.RECEIVE_MONEY, handleReceiveMoney);
					socket.off(SOCKET_EVENTS.PROPERTY_BOUGHT, handlePropertyBought);
					socket.off(SOCKET_EVENTS.RECEIVE_TURN, handleReceiveTurn);
					socket.off(SOCKET_EVENTS.RECEIVE_VOTE, handleReceiveVote);
					socket.off(SOCKET_EVENTS.YOUR_VOTES, handleYourVotes);
					socket.off(SOCKET_EVENTS.RECEIVE_TRADE_OFFER, handleReceiveTradeOffer);
					socket.off(
						SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER,
						handleReceiveConfirmTradeOffer,
					);
				});
			},
			setUsername: (username: string) => set({ username }),
			getUsernameById: (playerId: string) => {
				const state = get();
				const player = state.players.find((p) => p.id === playerId);
				return player ? player.username : undefined;
			},
			setColor: (color: string) => set({ color }),
			setPlayers: (players: Player[]) => set({ players }),
			setVotedPlayers: (votedPlayers: string[]) => set({ votedPlayers }),
			updatePlayer: (id: string, updates: Partial<Player>) => {
				set((prev) => ({
					players: prev.players.map((player) =>
						player.id === id ? { ...player, ...updates } : player,
					),
				}));
			},
			getPlayerCount: () => get().players.length,
			addProperty: (playerId: string, propertyIndex: number) => {
				set((state) => {
					const updatedPlayers = state.players.map((p) => {
						// Ensure the property is removed from any previous owner (e.g., during trade)
						const existingProperties = (p.properties ?? []).filter(
							(prop) => prop !== propertyIndex,
						);

						if (p.id === playerId) {
							return {
								...p,
								properties: [...existingProperties, propertyIndex],
							};
						}
						return {
							...p,
							properties: existingProperties,
						};
					});
					return { players: updatedPlayers };
				});
			},
			getPropertyCount: (playerId: string) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				return foundPlayer ? foundPlayer.properties.length : 0;
			},
			getProperty: (playerId: string) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				return foundPlayer?.properties ?? [];
			},
			//check if any player owns the property
			checkPropertyIsOwned: (propertyIndex: number) => {
				const state = get();
				return state.players.some((p) => p.properties.includes(propertyIndex));
			},
			//check if property is owned by player
			checkPropertyOwnedByPlayer: (playerId: string, propertyIndex: number) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				if (!foundPlayer) return false;
				return foundPlayer.properties?.includes(propertyIndex) ?? false;
			},
			displayTrade: () => {
				const state = get();
				return state.trade;
			},
			removeProperty: (playerId: string, propertyIndex: number) => {
				set((state) => {
					const updatedPlayers = state.players.map((p) => {
						if (p.id === playerId) {
							const newProperties = (p.properties ?? []).filter(
								(prop) => prop !== propertyIndex,
							);
							return {
								...p,
								properties: newProperties,
							};
						}
						return p;
					});
					return { players: updatedPlayers };
				});
			},
			sendVote: (
				roomKey: string,
				playerId: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
			) => {
				const { players } = get();
				if (!socket) return;
				const player = players.find((p) => p.id === playerId);
				const newVotes = (player?.votes ?? 0) + 1;
				socket.emit(SOCKET_EVENTS.SEND_VOTE, roomKey, playerId, newVotes);
			},
			sendTrade: (
				roomKey: string,
				userId: string,
				playerId: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
				tradeData: { offer: TradeData; request: TradeData },
			) => {
				if (!socket) return;

				socket.emit(
					SOCKET_EVENTS.SEND_TRADE_OFFER,
					userId,
					playerId,
					roomKey,
					tradeData,
				);
			},
			acceptTrade: (
				fromPlayer,
				toPlayer,
				roomKey,
				socket,
				tradeData,
				status,
			) => {
				if (!socket) return;
				socket.emit(
					SOCKET_EVENTS.CONFIRM_TRADE_OFFER,
					fromPlayer,
					toPlayer,
					roomKey,
					tradeData,
					status,
				);
			},
			setState: (state) => set(state),
		}),
		{
			name: "game-storage",
			partialize: (state) => ({
				username: state.username,
				userId: state.userId,
				color: state.color,
			}),
			onRehydrateStorage: () => (state) => {
				if (state && !state.userId) {
					state.userId = crypto.randomUUID();
				}
			},
		},
	),
);
