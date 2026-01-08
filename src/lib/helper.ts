export function generateRoomId(getTotalRooms: Map<string, Set<string>>) {
	let roomKey: string;
	const roomMap = getTotalRooms;
	do {
		roomKey = Math.floor(100000 + Math.random() * 900000).toString();
	} while (roomMap.has(roomKey));

	return roomKey;
}
