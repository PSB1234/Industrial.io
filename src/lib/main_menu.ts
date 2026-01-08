import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getMenuItems = (
	router: AppRouterInstance,
	onQuickJoin: () => void,
) => [
		{
			label: "START GAME",
			action: () => {
				router.push(`/options`);
			},
		},
		{
			label: "Quick join",
			action: () => {
				onQuickJoin();
			},
		},
		{
			label: "Join Room",

			action: () => router.push("/searchRoom"),
		},
		{
			label: "OPTIONS",
			action: () => router.push("/options"),
		},
	];
