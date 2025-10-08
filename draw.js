// --- draw.js---
let WATER_THICKNESS_MULT = 4.0;

function drawPetalStroke(pg, x, y, angle, length, width, fromC, toC) {
	const steps = int(length / 3);
	const curveStrength = random(0.2, 0.6);
	const noiseScale = random(0.05, 0.1);

	let path = [];
	for (let i = 0; i < steps; i++) {
		const t = i / (steps - 1);
		const nx = x + sin(radians(angle)) * length * t;
		const ny = y - cos(radians(angle)) * length * t;
		const sway =
			(noise(nx * noiseScale, ny * noiseScale) - 0.5) * width * curveStrength;
		path.push({ x: nx + sway, y: ny });
	}

	// painterly layering
	for (let pass = 0; pass < 3; pass++) {
		pg.noFill();
		pg.strokeWeight(random(3, 6));
		let baseColor = NYLerpColor(fromC, toC, random(0.2, 0.8));
		baseColor.slightRandomize(8, 10, 12);
		pg.stroke(baseColor.h, baseColor.s, baseColor.b, baseColor.a * 0.6);

		pg.beginShape();
		for (let i = 0; i < path.length; i++) {
			const p = path[i];
			const nudge = random(-0.6, 0.6);
			if (i === 0) pg.vertex(p.x + nudge, p.y + nudge);
			else {
				const prev = path[i - 1];
				const midX = (p.x + prev.x) / 2;
				const midY = (p.y + prev.y) / 2;
				pg.quadraticVertex(prev.x, prev.y, midX, midY);
			}
		}
		pg.endShape();
	}
}

function drawFlowBG(_yOffset) {
	tempBG.background(
		_mainColorSet.waterColor.h,
		_mainColorSet.waterColor.s,
		_mainColorSet.waterColor.b,
		0.25
	);

	// big horizontal “acrylic” swaths
	drawMonetWater(_mainColorSet, _yOffset);

	// thin shimmer lines on top
	drawShimmerBands(_yOffset);
}
function drawMonetWater(palette) {
	tempBG.noStroke();

	const base = palette.waterColor.color();
	const mixA = palette.waterShimmer.color();
	const mixB = palette.padReflection.color();

	// number of brush marks — dense layering
	for (let i = 0; i < 800; i++) {
		const x = random(width);
		const y = random(height);
		const w = random(20, 60); // short width
		const h = random(8, 18); // thick height (short, wide strokes)
		const a = random(TWO_PI);
		const c = lerpColor(lerpColor(base, mixA, random(0.4)), mixB, random(0.3));
		const alpha = random(0.08, 0.22);

		tempBG.push();
		tempBG.translate(x, y);
		tempBG.rotate(a + random(-0.1, 0.1)); // vary direction slightly
		tempBG.fill(hue(c), saturation(c), brightness(c), alpha);
		tempBG.ellipse(0, 0, w, h); // soft oval strokes
		tempBG.pop();
	}

	// faint blended overlay to soften edges
	tempBG.filter(BLUR, 2);
}

function drawFlowLine(_x, _y, _length, _thickness, _fromC, _toC, _offset) {
	let strokeCount = max(4, int(_length / 2));
	let nowX = _x,
		nowY = _y;

	for (let i = 0; i < strokeCount; i++) {
		const t = i / (strokeCount - 1);

		const sizeNoise = noise(nowX * 0.01, (nowY + _offset) * 0.01, 4096);
		const rotNoise = noise(nowX * 0.01, (nowY + _offset) * 0.01, 6666);

		const nowSize = _thickness * lerp(0.6, 1.2, sizeNoise);
		const nowRot = 90 + lerp(-40, 40, rotNoise);

		nowX += sin(radians(nowRot)) * 2;
		nowY += -cos(radians(nowRot)) * 2;

		const nowColor = NYLerpColor(_fromC, _toC, t);
		tempBG.noStroke();
		tempBG.fill(nowColor.h, nowColor.s, nowColor.b, 0.6);
		tempBG.circle(nowX, nowY, nowSize);
	}
}

// === new: reflections ===
function drawReflectionPad(pg, x, y, size, palette) {
	// reflect across a soft “waterline” jittered by noise
	const wobble = (yy) => 6 * (noise(x * 0.01, yy * 0.02) - 0.5);
	const steps = 10;
	for (let i = 0; i < steps; i++) {
		const t = i / (steps - 1);
		const yy = y + t * (size * 0.4);
		const r = size * (0.85 - 0.6 * t);
		let c = palette.padReflection.copy();
		c.slightRandomize(6, 6, 6);
		pg.noFill();
		pg.stroke(c.h, c.s, c.b, 0.08 * (1 - t));
		pg.strokeWeight(2.0 - t);
		pg.ellipse(x + wobble(yy), yy + 6 + i * 1.2, r, r * 0.35);
	}
}

function drawReflectionFlower(pg, x, y, palette) {
	const petals = int(random(4, 9));
	for (let i = 0; i < petals; i++) {
		const ang = lerp(-70, 70, i / (petals - 1)) + random(-6, 6);
		const len = random(12, 28);
		const thick = random(6, 14);
		const fromC = palette.flowerOutsideColor.copy();
		const toC = palette.flowerInsideColor.copy();
		fromC.a = 0.15;
		toC.a = 0.08;

		// simplified mirrored petal strokes (downward, smeared)
		const sc = int(len / 1.8);
		let nx = x,
			ny = y + 6;
		for (let s = 0; s < sc; s++) {
			const tt = s / (sc - 1);
			const h = NYLerpColor(fromC, toC, tt);
			pg.stroke(h.h, h.s, h.b, h.a * (1 - tt));
			pg.strokeWeight(thick * 0.5 * (1 - tt));
			pg.point(
				nx + sin(radians(ang + 180)) * 1.2,
				ny + cos(radians(ang + 180)) * 0.8 + random(-0.5, 0.5)
			);
			nx += sin(radians(ang + 180)) * 1.2;
			ny += cos(radians(ang + 180)) * 0.8;
		}
	}
}
// === Monet-like shimmer bands ===
function drawShimmerBands(_yOffset) {
	tempBG.noStroke();

	// how many brush marks to paint
	const marks = 700; // fewer, bolder strokes

	for (let i = 0; i < marks; i++) {
		const x = random(width);
		const y = random(height);
		const w = random(5, 20); // slightly longer
		const h = random(10, 25); // thicker height
		const angle = random(TWO_PI);

		// richer color mixing from your palette
		const base = _mainColorSet.waterColor.color();
		const mixA = _mainColorSet.waterFlowColor.color();
		const mixB = _mainColorSet.waterShimmer.color();
		const mixC = _mainColorSet.padReflection
			? _mainColorSet.padReflection.color()
			: mixB;

		const c = lerpColor(
			lerpColor(base, mixA, random(0.5)),
			lerpColor(mixB, mixC, random(0.5)),
			random(0.6)
		);

		const alpha = random(0.07, 0.35);

		tempBG.push();
		tempBG.translate(x, y);
		tempBG.rotate(angle + random(-0.2, 0.2));
		tempBG.fill(hue(c), saturation(c), brightness(c), alpha);

		// heavier brush mark: oval + short jitter strokes
		for (let j = 0; j < 3; j++) {
			const dx = random(-3, 3);
			const dy = random(-3, 3);
			tempBG.ellipse(dx, dy, w, h);
		}

		tempBG.pop();
	}

	tempBG.filter(BLUR, 0.7);
}

// === painterly noise line ===
function drawNoiseLine(x, y, dir, len, fromC, toC) {
	const steps = int(len / 2);
	let nx = x,
		ny = y;

	for (let i = 0; i < steps; i++) {
		const t = i / (steps - 1);
		const c = NYLerpColor(fromC, toC, t);

		const rotNoise = noise(nx * 0.02, ny * 0.02) * 40 - 20; // small jitter
		const segDir = dir + rotNoise;
		const stepLen = 1.8 + noise(nx * 0.03, ny * 0.03) * 1.2;

		nx += sin(radians(segDir)) * stepLen;
		ny += -cos(radians(segDir)) * stepLen;

		stroke(c.h, c.s, c.b, c.a);
		strokeWeight(random(1, 2.4));
		point(nx, ny);
	}
}

let fishes = [];

function spawnFishes(n = 4) {
	fishes = [];
	for (let i = 0; i < n; i++) {
		fishes.push(
			new Fish(
				random(width * 0.1, width * 0.9),
				random(height * 0.2, height * 0.9)
			)
		);
	}
}

function drawFishLayer(pg) {
	for (let f of fishes) {
		f.draw(pg);
	}
}

function drawDappledLight(pg, palette) {
	pg.noStroke();
	const spots = 40;
	for (let i = 0; i < spots; i++) {
		const cx = random(0.05, 0.95) * width;
		const cy = random(0.05, 0.95) * height;
		const r = random(min(width, height) * 0.05, min(width, height) * 0.18);
		const base = palette.lightDapple;
		for (let t = 1; t >= 0.02; t -= 0.02) {
			const h = processHue(base.h + random(-4, 4));
			const s = base.s;
			const b = base.b;
			pg.fill(h, s, b, 0.02 * t);
			pg.circle(cx + random(-1, 1), cy + random(-1, 1), r * t);
		}
	}
}
function drawCanvasTexture(pg) {
	pg.clear();
	pg.stroke(0, 0, 0, 0.04);
	for (let y = 0; y < height; y += 2) {
		for (let x = 0; x < width; x += 2) {
			const n = noise(x * 0.015, y * 0.015);
			if (n > 0.55) pg.point(x, y);
		}
	}
	// faint diagonal linen
	pg.stroke(0, 0, 0, 0.03);
	for (let i = -height; i < width; i += 6) {
		pg.line(i, 0, i + height, height);
	}
}
function drawVignette() {
	push();
	noFill();
	for (let i = 0; i < 60; i++) {
		const a = map(i, 0, 59, 0.05, 0);
		stroke(0, 0, 0, a);
		strokeWeight(8);
		rect(4 - i, 4 - i, width - 8 + 2 * i, height - 8 + 2 * i, 16);
	}
	pop();
}

// === Painterly Pond Grass Bush (visible on dark water + rich variation) ===
function drawGrassBush(pg, x, y, palette, scale = 3.0) {
	const baseColor = palette.plantColorA.copy();
	const midColor = palette.plantColorB.copy();
	const tipColor = palette.plantHighlightColor.copy();

	const totalBlades = int(random(30, 60));

	for (let i = 0; i < totalBlades; i++) {
		// — placement & shape —
		const offsetX = random(-40, 40) * scale;
		const baseY = y + random(-6, 6) * scale;

		const len = random(90, 220); // varied height
		const width = random(10, 50) * scale * random(0.8, 2.2);
		const angle = random(-20, 20) + random(-10, 10);
		const curveBend = random(-8, 8);

		// — color gradient with visible brightness shift —
		const fromC = baseColor.copy();
		const toC = tipColor.copy();

		// exaggerate color curve so it stands out on dark water
		toC.h = processHue(toC.h + random(-15, 15));
		toC.s = constrain(toC.s * random(0.9, 1.2), 40, 100);
		toC.b = constrain(toC.b * random(1.3, 1.6), 0, 100);

		// multiple passes for painterly layering
		const layers = int(random(2, 5));
		let prevC = fromC.copy();

		for (let p = 0; p < layers; p++) {
			const t = p / (layers - 1);
			const nowC = NYLerpColor(fromC, toC, easeOutSine(t));
			nowC.slightRandomize(4, 6, 6);

			// brighter rim light highlight pass
			if (p === layers - 1 && random() < 0.4) {
				nowC.b = min(100, nowC.b + 25);
				nowC.s *= 0.8;
			}

			drawPetalStroke(
				pg,
				x + offsetX + curveBend * t,
				baseY - t * len * 0.1,
				angle + random(-4, 4),
				len * random(0.8, 1.0),
				width * (1 - t * 0.5),
				prevC,
				nowC
			);

			// occasionally draw twin blade
			if (random() < 0.25 && p === 0) {
				drawPetalStroke(
					pg,
					x + offsetX + random(-8, 8),
					baseY + random(-3, 3),
					angle + random(-12, 12),
					len * random(0.6, 0.9),
					width * 0.7,
					prevC,
					nowC
				);
			}

			prevC = nowC.copy();
		}

		// dark core shadow line
		if (random() < 0.6) {
			const shadowC = baseColor.copy();
			shadowC.b *= 0.4;
			shadowC.a = 0.5;
			drawNoiseLine(
				x + offsetX,
				baseY,
				angle + random(-2, 2),
				len * random(0.8, 1.0),
				shadowC,
				midColor
			);
		}
	}

	// === base shading + light halo ===
	pg.noStroke();
	const rootC = baseColor.copy();
	rootC.a = 0.45;
	pg.fill(rootC.h, rootC.s, rootC.b, rootC.a);
	pg.ellipse(x, y + 15 * scale, 120 * scale, 40 * scale);

	const glow = tipColor.copy();
	glow.a = 0.12;
	glow.b = min(100, glow.b + 30);
	pg.fill(glow.h, glow.s * 0.8, glow.b, glow.a);
	pg.ellipse(x, y - 20 * scale, 140 * scale, 70 * scale);
}
