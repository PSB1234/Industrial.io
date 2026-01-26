"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function Room() {
	const router = useRouter();
	const { room_id } = useParams<{ room_id: string }>();
	const { isThisPlayerLeader, players, initializeSocket } = useGameStore();
	const [isLoading, setIsLoading] = useState(true);
	const { socket, emitEvent } = useSocketStore();

	useEffect(() => {
		if (!socket || !room_id) return;
		initializeSocket(room_id, socket);
		function RoomStatus() {
			router.push(`/game/${room_id}`);
			router.refresh();
		}
		socket.on(SOCKET_EVENTS.AFTER_CHANGE_ROOM_STATUS, RoomStatus);
		return () => {
			socket.off(SOCKET_EVENTS.AFTER_CHANGE_ROOM_STATUS, RoomStatus);
		};
	}, [room_id, socket, initializeSocket, router]);

	const onSubmit = () => {
		emitEvent(SOCKET_EVENTS.CHANGE_ROOM_STATUS, room_id, "playing");
	};
	return (
		<div className="flex w-full flex-col gap-5 p-10">
			<Card className="w-full p-5 md:col-span-3 md:row-span-6 md:h-full">
				<CardTitle>Players:</CardTitle>
				<CardContent>
					<ul>
						{players.length === 0 ? (
							<li>No players yet</li>
						) : (
							players.map((player, index) => (
								<li className="flex flex-row gap-2" key={player.id}>
									<p>{index + 1}.</p>
									<p className="overflow-hidden text-ellipsis">
										{player.username}
									</p>
								</li>
							))
						)}
					</ul>
				</CardContent>
			</Card>
			<Button disabled={!isThisPlayerLeader()} onClick={onSubmit}>
				Submit
			</Button>
		</div>
	);
}
