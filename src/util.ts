import type { Image, CanvasRenderingContext2D } from "skia-canvas";

export function getLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
	maxLines: number,
) {
	const lines = [];

	const words = text.split(" ");
	let currentLine = words[0];

	for (let i = 1; i < words.length; i++) {
		let word = words[i];
		const testLine = currentLine + " " + word;
		const width = ctx.measureText(testLine).width;
		if (width < maxWidth) currentLine = testLine;
		else if (maxLines === lines.length) {
			lines[lines.length - 1] += "...";
			break;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}

	if (maxLines !== lines.length) lines.push(currentLine);
	return lines;
}

export function drawImageCover(ctx: CanvasRenderingContext2D, img: Image) {
	const x = 0;
	const y = 0;
	const w = ctx.canvas.width;
	const h = ctx.canvas.height;

	// default offset is center
	let offsetX = 0.5;
	let offsetY = 0.5;

	// keep bounds [0.0, 1.0]
	if (offsetX < 0) offsetX = 0;
	if (offsetY < 0) offsetY = 0;
	if (offsetX > 1) offsetX = 1;
	if (offsetY > 1) offsetY = 1;

	var iw = img.width,
		ih = img.height,
		r = Math.min(w / iw, h / ih),
		nw = iw * r, // new prop. width
		nh = ih * r, // new prop. height
		cx,
		cy,
		cw,
		ch,
		ar = 1;

	// decide which gap to fill
	if (nw < w) ar = w / nw;
	if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
	nw *= ar;
	nh *= ar;

	// calc source rectangle
	cw = iw / (nw / w);
	ch = ih / (nh / h);

	cx = (iw - cw) * offsetX;
	cy = (ih - ch) * offsetY;

	// make sure source rectangle is valid
	if (cx < 0) cx = 0;
	if (cy < 0) cy = 0;
	if (cw > iw) cw = iw;
	if (ch > ih) ch = ih;

	// fill image in dest. rectangle
	ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

type GradientProps = {
	range: { start: [x: number, y: number]; end: [x: number, y: number] };
	stops: [offset: number, color: string][];
	rect: [x: number, y: number, width: number, height: number];
};

export function drawGradient(
	ctx: CanvasRenderingContext2D,
	{ range, stops, rect }: GradientProps,
) {
	const gradient = ctx.createLinearGradient(...range.start, ...range.end);
	for (const stop of stops) gradient.addColorStop(...stop);
	ctx.fillStyle = gradient;
	ctx.fillRect(...rect);
}

type TextProps = {
	text: string;
	maxWidth: number;
	maxLines: number;
	font: string;
	lineHeight: number;
	x: number;
	y: number;
};

export function writeText(
	ctx: CanvasRenderingContext2D,
	{ text, maxWidth, maxLines, font, lineHeight, x, y }: TextProps,
) {
	let usedHeight = 0;

	ctx.font = font;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#fff";
	ctx.textWrap = true;

	getLines(ctx, text, maxWidth, maxLines).map((line, i) => {
		usedHeight = y + i * lineHeight;
		ctx.fillText(line, x, usedHeight);
	});

	return usedHeight + lineHeight;
}
