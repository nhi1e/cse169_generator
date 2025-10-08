// --- sketch.js ---
let lilis = [];
let tempBG, textureFG, reflectionLayer, lightLayer;

let waterBaseTall = 300;
let _mainColorSet;
let SEED;

let paintType = "PORTRAIT";
let paintXRange = [0.2, 0.8];
let paintYRange = [-0.1, 1.4];

async function setup() {
	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	colorMode(HSB);

	loadSeedFromURL();
	if (!SEED) SEED = int(Date.now() % 1e9); // fallback random seed
	randomSeed(SEED);
	noiseSeed(SEED);
	stateToURL(); // immediately store it in the link

	const storedSeed = localStorage.getItem("pondSeed");
	if (storedSeed) {
		SEED = int(storedSeed);
	} else {
		SEED = int(Date.now() % 1e9);
	}

	// === new: per-refresh seed for repeatable randomness ===
	//SEED = int((Date.now() % 1e9));
	randomSeed(SEED);
	noiseSeed(SEED);

	_mainColorSet = getRandomColorSet();

	tempBG = createGraphics(width, height);
	tempBG.colorMode(HSB);

	reflectionLayer = createGraphics(width, height);
	reflectionLayer.colorMode(HSB);
	reflectionLayer.clear();

	lightLayer = createGraphics(width, height);
	lightLayer.colorMode(HSB);
	lightLayer.clear();

	textureFG = createGraphics(width, height);
	textureFG.colorMode(HSB);
	textureFG.clear();

	// base water tone (very low alpha wash)
	background(
		_mainColorSet.waterGround.h,
		_mainColorSet.waterGround.s,
		_mainColorSet.waterGround.b
	);

	image(tempBG, 0, 0);

	// === scene population (fewer, more intentional pads) ===
	let plantCount = int(60 + random(15));
	for (let i = 0; i < plantCount; i++) {
		let newX = random(0.1, 0.9) * width;
		let newY = random(0.0, 1.0) * height;
		let sameSpotCount = int(random(1, 4));
		for (let j = 0; j < sameSpotCount; j++) {
			lilis.push(
				new PlantLili(
					newX + random(-20, 20),
					newY + random(-20, 20),
					waterBaseTall
				)
			);
		}
	}
	let totalSteps = int(waterBaseTall / 0.6);
	for (let i = 0; i < totalSteps; i++) {
		for (let j = 0; j < lilis.length; j++) lilis[j].drawStep();

		if (i % 18 === 0) {
			tempBG.clear();
			drawFlowBG(i); // watery strands
			drawShimmerBands(i); // Monet shimmer

			image(tempBG, 0, 0);
		}
		await sleep(1);
	}
	tempBG.clear();
	drawFlowBG(frameCount); // watery strands
	drawShimmerBands(frameCount); // Monet shimmer
	image(tempBG, 0, 0);

	spawnFishes(int(random(3, 6)));
	for (let f of fishes) f.draw(this);

	for (let i = 0; i < lilis.length; i++) {
		if (lilis[i].type === "LEAF") {
			lilis[i].drawLeaf();
			drawReflectionPad(
				reflectionLayer,
				lilis[i].toX,
				lilis[i].toY,
				lilis[i].leafSize,
				_mainColorSet
			);
			await sleep(1);
		}
	}

	drawFlowBG(frameCount);
	drawShimmerBands(frameCount);

	push();
	blendMode(OVERLAY);
	pop();

	// === flowers ===
	for (let i = 0; i < lilis.length; i++) {
		if (lilis[i].type === "FLOWER") {
			lilis[i].drawFlower();
			drawReflectionFlower(
				reflectionLayer,
				lilis[i].toX,
				lilis[i].toY,
				_mainColorSet
			);
			await sleep(1);
		}
	}

	// reflections (beneath shimmer)
	push();
	blendMode(MULTIPLY);
	image(reflectionLayer, 0, 0);
	pop();

	// dappled light
	drawDappledLight(lightLayer, _mainColorSet);
	push();
	blendMode(OVERLAY);
	image(lightLayer, 0, 0);
	pop();

	// canvas texture
	drawCanvasTexture(textureFG);
	push();
	tint(0, 0, 100, 0.25);
	image(textureFG, 0, 0);
	pop();

	// vignette
	drawVignette();

	makeUI(); // builds the small buttons (Share, Save, etc.)
}

function draw() {
	// static painting after build
	// optional: slow koi movement
}

// === util ===
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
