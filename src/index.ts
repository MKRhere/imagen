import { Canvas, loadImage } from "skia-canvas";
import { drawImageCover, writeText, drawGradient } from "./util";

export async function renderPreviewImg(
	size: [number, number],
	imgpath: string,
	title: string,
	subtitle: string,
	filepath: string,
) {
	const canvas = new Canvas(...size);
	const ctx = canvas.getContext("2d");
	const { width, height } = canvas;

	const img = await loadImage(imgpath);
	drawImageCover(ctx, img);

	drawGradient(ctx, {
		range: {
			start: [width / 2, height],
			end: [width / 2, 0],
		},
		stops: [
			[0, "rgba(0, 0, 0, 1)"],
			[1, "rgba(0, 0, 0, 0)"],
		],
		rect: [0, 0, width, height],
	});

	const usedHeight = writeText(ctx, {
		text: title,
		maxWidth: width * 0.7,
		maxLines: 2,
		font: "600 128px Inter-var",
		lineHeight: 132,
		x: width * 0.06,
		y: height * 0.5,
	});

	writeText(ctx, {
		text: subtitle,
		maxWidth: width * 0.7,
		maxLines: 1,
		font: "500 48px Inter-var",
		lineHeight: 54,
		x: width * 0.06,
		y: usedHeight + 54,
	});

	await canvas.saveAs(filepath);
}

export * from "./util";
