import type { TileDataSchema } from "@/lib/type";

const createProperty = (
	price: number,
	buyable: boolean = true,
	isCornerTile: boolean = false,
	rent?: number[],
): Partial<TileDataSchema> => ({
	type: "property",
	price,
	rent,
	buyable,
	reward: 0,
	isCornerTile,
});

const createTile = (
	type: TileDataSchema["type"],
	isCornerTile: boolean,
	reward: number = 0,
): Partial<TileDataSchema> => ({
	type,
	isCornerTile,
	buyable: false,
	reward,
});
//32 tiles in total
const TileDataJsonPartial: Partial<TileDataSchema>[] = [
	{
		...createTile("start", true, 200),
	},
	{
		...createProperty(120, true, false, [100, 140, 230, 390, 460, 500]),
	},
	{
		...createProperty(100, true, false, [80, 120, 200, 300, 350, 400]),
	},
	{
		...createProperty(100, true, false, [80, 120, 200, 300, 350, 400]),
	},
	{
		...createTile("chance", false),
	},
	{
		...createProperty(140, true, false, [110, 160, 240, 410, 450, 500]),
	},
	{
		...createProperty(160, true, false, [120, 180, 260, 430, 480, 550]),
	},
	{
		...createProperty(160, true, false, [120, 180, 260, 430, 480, 550]),
	},
	{
		...createTile("jail", true),
	},
	{
		...createProperty(180, true, false, [140, 200, 280, 450, 500, 600]),
	},
	{
		...createProperty(180, true, false, [140, 200, 280, 450, 500, 600]),
	},
	{
		...createTile("chance", false),
	},
	{
		...createProperty(200, true, false, [160, 220, 300, 470, 520, 650]),
	},
	{
		...createProperty(200, true, false, [160, 220, 300, 470, 520, 650]),
	},
	{
		...createTile("tax", false),
	},
	{
		...createProperty(220, true, false, [180, 240, 320, 490, 540, 700]),
	},
	{
		...createTile("Vacation", true),
	},
	{
		...createProperty(240, true, false, [200, 260, 340, 510, 560, 750]),
	},
	{
		...createProperty(240, true, false, [200, 260, 340, 510, 560, 750]),
	},
	{
		...createTile("chance", false),
	},
	{
		...createTile("go-to-jail", false),
	},
	{
		...createProperty(260, true, false, [220, 280, 360, 530, 580, 800]),
	},
	{
		...createProperty(280, true, false, [240, 300, 380, 550, 600, 850]),
	},
	{
		...createProperty(280, true, false, [240, 300, 380, 550, 600, 850]),
	},
	{
		...createTile("go-to-jail", true),
	},
	{
		...createProperty(300, true, false, [260, 320, 400, 570, 620, 900]),
	},
	{
		...createProperty(300, true, false, [260, 320, 400, 570, 620, 900]),
	},
	{
		...createTile("chance", false),
	},
	{
		...createProperty(320, true, false, [280, 340, 420, 590, 640, 950]),
	},
	{
		...createProperty(320, true, false, [280, 340, 420, 590, 640, 950]),
	},
	{
		...createProperty(350, true, false, [300, 360, 440, 610, 660, 1000]),
	},
	{
		...createProperty(350, true, false, [300, 360, 440, 610, 660, 1000]),
	},
] as const;
const TileDataJson: TileDataSchema[] = TileDataJsonPartial.map((data, id) => {
	return { id, ...data } as TileDataSchema;
});
export default TileDataJson;
