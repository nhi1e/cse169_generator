// object.js
class NYColor {
	constructor(_h, _s, _b, _a = 1.0) {
		this.h = _h;
		this.s = _s;
		this.b = _b;
		this.a = _a;
	}

	copy() {
		return new NYColor(this.h, this.s, this.b, this.a);
	}

	slightRandomize(_hDiff = 10, _sDiff = 12, _bDiff = 12, _aDiff = 0.0) {
		this.h += random(-0.5 * _hDiff, 0.5 * _hDiff);
		this.s += random(-0.5 * _sDiff, 0.5 * _sDiff);
		this.b += random(-0.5 * _bDiff, 0.5 * _bDiff);
		this.a += random(-0.5 * _aDiff, 0.5 * _aDiff);
	}

	color() {
		return color(this.h, this.s, this.b, this.a);
	}

	static newRandomColor(_mainHue) {
		let h = processHue(_mainHue + random(-30, 30));
		let s = random(40, 60);
		let b = random(80, 100);

		return new NYColor(h, s, b);
	}
}

class PlantLili {
	constructor(_x, _y, _tall) {
		this.x = _x;
		this.y = _y;
		this.tall = _tall;

		if (random() < 0.09) this.type = "FLOWER";
		else this.type = "LEAF";

		if (this.type == "FLOWER") {
			this.tall += random(0.0, 1.2) * waterBaseTall;
		}

		this.xOffset = random(-200, 200);
		this.totalSteps = int(this.tall / 0.6);
		this.nowStep = 0;

		let colorType = int(random(0, 3));

		if (colorType == 0) {
			this.fromColor = _mainColorSet.plantColorA.copy();
			this.fromColor.slightRandomize(10, 10, 30);

			this.toColor = _mainColorSet.plantColorB.copy();
			this.toColor.slightRandomize(10, 10, 30);
		} else if (colorType == 1) {
			this.fromColor = _mainColorSet.plantColorB.copy();
			this.fromColor.slightRandomize(10, 10, 30);

			this.toColor = _mainColorSet.plantColorA.copy();
			this.toColor.slightRandomize(10, 10, 30);
		} else if (colorType == 2) {
			this.fromColor = _mainColorSet.plantColorA.copy();
			this.fromColor.slightRandomize(10, 10, 30);

			this.toColor = _mainColorSet.plantColorA.copy();
			this.toColor.slightRandomize(10, 10, 30);
		} else {
			this.fromColor = _mainColorSet.plantColorB.copy();
			this.fromColor.slightRandomize(10, 10, 30);

			this.toColor = _mainColorSet.plantColorB.copy();
			this.toColor.slightRandomize(10, 10, 30);
		}

		this.fromX = _x;
		this.fromY = _y;

		this.toX = _x + this.xOffset;
		this.toY = _y - _tall * 0.6;

		let easingIndex = int(random(0, 8));

		if (easingIndex == 0) this.easingFunc = easeOutSine;
		else if (easingIndex == 1) this.easingFunc = easeInOutSine;
		else if (easingIndex == 2) this.easingFunc = easeOutQuad;
		else if (easingIndex == 3) this.easingFunc = easeInOutQuad;
		else if (easingIndex == 4) this.easingFunc = easeOutBack;
		else if (easingIndex == 5) this.easingFunc = easeInOutBack;
		else if (easingIndex == 6) this.easingFunc = easeOutCirc;
		else if (easingIndex == 7) this.easingFunc = easeInOutCirc;

		let sizeRandom = random();

		if (sizeRandom < 0.4) this.leafSize = random(10, 40);
		else if (sizeRandom < 0.5) this.leafSize = random(120, 280);
		else this.leafSize = random(60, 120);
	}

	drawStep() {
		return false;
	}

	drawLeaf() {
		const cx = this.toX;
		const cy = this.toY;
		const baseSize = this.leafSize;

		push();
		translate(cx, cy);
		rotate(random(-PI / 10, PI / 10));

		const base = this.fromColor.copy();
		const highlight = this.toColor.copy();
		base.slightRandomize(8, 10, 12);
		highlight.slightRandomize(6, 8, 6);

		const density = map(baseSize, 50, 300, 120, 400, true);
		const strokeCount = int(random(density * 0.8, density * 1.2));

		noStroke();
		fill(base.h, base.s, base.b, 0.5);
		ellipse(0, 0, baseSize * 0.75, baseSize * 0.5);

		blendMode(MULTIPLY);

		for (let i = 0; i < strokeCount; i++) {
			// Concentric placement: more clustered near center for big pads
			const rNorm = pow(random(), 0.9); // more strokes near center
			const angle = random(TWO_PI);
			const dist = rNorm * baseSize * 0.4;
			const x = cos(angle) * dist;
			const y = sin(angle) * dist * 0.65;

			// Color gradation
			const t = dist / (baseSize * 0.5);
			const c = NYLerpColor(base, highlight, 1 - t);
			c.slightRandomize(4, 6, 6);

			// Brush geometry — thicker, overlapping for larger leaves
			const w = random(map(baseSize, 40, 300, 6, 20));
			const h = random(map(baseSize, 40, 300, 3, 10));
			const alpha = map(t, 0, 1, 0.9, 0.45) * random(0.8, 1.3);

			fill(c.h, c.s, c.b, alpha);

			push();
			translate(x + random(-1, 1), y + random(-1, 1));
			rotate(angle + random(-0.4, 0.4));
			ellipse(0, 0, w, h);
			pop();
		}
		if (baseSize > 180) {
			tempBG.push();
			tempBG.translate(cx, cy);
			tempBG.fill(base.h, base.s * 0.9, base.b * 1.1, 0.15);
			tempBG.noStroke();
			tempBG.ellipse(0, 0, baseSize * 0.9, baseSize * 0.6);
			tempBG.pop();
		}

		blendMode(BLEND);
		noFill();
		stroke(highlight.h, highlight.s * 0.5, highlight.b * 1.1, 0.2);
		strokeWeight(2);
		ellipse(0, 0, baseSize * 0.8, baseSize * 0.5);

		pop();
	}

	drawFlower() {
		if (this.type !== "FLOWER") return;

		// render a small bush of painterly grass instead of a flower
		const scale = random(0.8, 1.4);
		drawGrassBush(tempBG, this.toX, this.toY, _mainColorSet, scale);
	}
}

class Fish {
	constructor(x, y, bodyW = random(80, 180)) {
		this.x = x;
		this.y = y;
		this.angle = random(TWO_PI);
		this.bodyW = bodyW;
		this.bodyH = bodyW * 0.25 + random(3);
		this.transparency = 255;
		const fishSet = _mainColorSet.fish;

		this.mainColor = fishSet.mainColor.color();
		this.stripeColor = fishSet.stripeColor.color();
		this.outlineColor = fishSet.outlineColor.color();
		this.finColor = fishSet.finColor.color();
		this.spotColor = fishSet.spotColor.color();

		// geometry samples along spine (body curve)
		this.spine = [];
		this.numNodes = 10;
		for (let i = 0; i < this.numNodes; i++) {
			let t = i / (this.numNodes - 1);
			let x = lerp(-this.bodyW / 2, this.bodyW / 2, t);
			let y = sin(t * PI * random(0.9, 1.1)) * this.bodyH * 0.1 * random(-1, 1);
			this.spine.push([x, y]);
		}
	}
	draw(pg) {
		pg.push();
		pg.translate(this.x, this.y);
		pg.rotate(this.angle);
		pg.noStroke();

		// Layer 1 — outline
		pg.fill(
			hue(this.outlineColor),
			saturation(this.outlineColor),
			brightness(this.outlineColor),
			0.6
		);
		this.renderBody(pg, 1.2, 0.25);

		// Layer 2 — stripes
		pg.fill(
			hue(this.stripeColor),
			saturation(this.stripeColor),
			brightness(this.stripeColor),
			0.9
		);
		this.renderBody(pg, 0.9, 0.15);

		// Layer 3 — main body
		pg.fill(
			hue(this.mainColor),
			saturation(this.mainColor),
			brightness(this.mainColor),
			0.9
		);
		this.renderBody(pg, 0.6, 0.25);

		const spotCount = int(random(10, 20));
		for (let i = 0; i < spotCount; i++) {
			const t = random();
			const idx = floor(t * (this.spine.length - 1));
			const nextIdx = min(idx + 1, this.spine.length - 1);
			const lerpT = t * (this.spine.length - 1) - idx;
			const xBase = lerp(this.spine[idx][0], this.spine[nextIdx][0], lerpT);
			const yBase = lerp(this.spine[idx][1], this.spine[nextIdx][1], lerpT);

			// Compute local direction + body half-width
			const dx = this.spine[nextIdx][0] - this.spine[idx][0];
			const dy = this.spine[nextIdx][1] - this.spine[idx][1];
			const theta = -atan2(dy, dx);

			// same curve logic as body shape
			const bell = 1.0 - pow((t - 0.5) / 0.5, 2); // 0..1..0 shape
			const halfWidth = this.bodyH * (0.6 + 0.5 * bell);

			// place spots within half width
			const offset = random(-halfWidth * 0.8, halfWidth * 0.8);
			const sx = xBase + sin(theta) * offset;
			const sy = yBase + cos(theta) * offset;

			const sr = random(this.bodyH * 0.3, this.bodyH * 0.8);
			const hueShift = random([-25, -10, 0, 10, 25]);
			const c = color(
				(hue(this.mainColor) + hueShift + 360) % 360,
				random(50, 90),
				random(60, 100),
				random(0.4, 0.75)
			);

			pg.fill(c);
			pg.ellipse(sx, sy, sr, sr * random(0.8, 1.2));
		}

		// fins (left/right)
		this.renderFin(pg, -this.bodyW * 0.15, this.bodyH * 0.5, 1);
		this.renderFin(pg, -this.bodyW * 0.15, -this.bodyH * 0.5, -1);

		// tail fan
		this.renderTail(pg, this.bodyW * 0.5, 0, 0.7);

		// head glint
		pg.fill(0, 0, 100, 0.2);
		pg.ellipse(-this.bodyW * 0.35, 0, this.bodyH * 0.8, this.bodyH * 0.5);

		pg.pop();
	}

	renderBody(pg, sizeA, sizeB) {
		pg.beginShape(TRIANGLE_STRIP);
		for (let i = 0; i < this.spine.length; i++) {
			let dx, dy;
			if (i === 0) {
				dx = this.spine[1][0] - this.spine[0][0];
				dy = this.spine[1][1] - this.spine[0][1];
			} else {
				dx = this.spine[i][0] - this.spine[i - 1][0];
				dy = this.spine[i][1] - this.spine[i - 1][1];
			}
			const theta = -atan2(dy, dx);
			const t = i / (this.spine.length - 1);
			const b = bezierPoint(3, this.bodyH * sizeA, this.bodyH * sizeB, 2, t);
			const x1 = this.spine[i][0] - sin(theta) * b;
			const y1 = this.spine[i][1] - cos(theta) * b;
			const x2 = this.spine[i][0] + sin(theta) * b;
			const y2 = this.spine[i][1] + cos(theta) * b;
			pg.vertex(x1, y1);
			pg.vertex(x2, y2);
		}
		pg.endShape();
	}

	renderTail(pg, x, y, sizeOffset) {
		pg.push();
		pg.translate(x, y);
		pg.fill(this.mainColor);
		pg.beginShape(TRIANGLE_STRIP);
		const steps = 8;
		for (let n = 0; n < steps; n++) {
			let t = n / (steps - 1);
			const b = bezierPoint(2, this.bodyH, this.bodyH * sizeOffset, 0, t);
			const x1 = t * this.bodyH * 1.2;
			const y1 = -b;
			const x2 = t * this.bodyH * 1.2;
			const y2 = b;
			pg.vertex(x1, y1);
			pg.vertex(x2, y2);
		}
		pg.endShape();
		pg.pop();
	}

	renderFin(pg, x, y, flip) {
		pg.push();
		pg.translate(x, y);
		pg.rotate(random(-PI / 8, PI / 8));
		pg.fill(this.finColor);
		pg.beginShape();
		const steps = 6;
		for (let n = 0; n <= steps; n++) {
			const t = n / steps;
			const px = lerp(0, this.bodyH * 1.5, t);
			const py = flip * sin(t * PI) * this.bodyH * 0.7;
			pg.vertex(px, py);
		}
		pg.endShape();
		pg.pop();
	}
}
