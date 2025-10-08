function NYLerpHue(_hueA, _hueB, _t) {
	let hueA = _hueA;
	let hueB = _hueB;

	let hueDiff = abs(hueB - hueA);

	if (abs(hueB - 360 - hueA) < hueDiff) {
		hueB -= 360;
	} else if (abs(hueB + 360 - hueA) < hueDiff) {
		hueB += 360;
	} else {
		return lerp(_hueA, _hueB, _t);
	}

	let resultHue = lerp(hueA, hueB, _t);

	if (resultHue < 0) {
		resultHue += 360;
	} else if (resultHue > 360) {
		resultHue -= 360;
	}

	return resultHue;
}

function NYLerpColor(_colorA, _colorB, _t) {
	let _hue = NYLerpHue(_colorA.h, _colorB.h, _t);
	let _sat = lerp(_colorA.s, _colorB.s, _t);
	let _bri = lerp(_colorA.b, _colorB.b, _t);
	let _alpha = lerp(_colorA.a, _colorB.a, _t);

	return new NYColor(_hue, _sat, _bri, _alpha);
}

function NYLerpP5Color(_colorA, _colorB, _t) {
	let hueA = hue(_colorA);
	let hueB = hue(_colorB);

	let hueDiff = abs(hueB - hueA);

	if (abs(hueB - 360 - hueA) < hueDiff) {
		hueB -= 360;
	} else if (abs(hueB + 360 - hueA) < hueDiff) {
		hueB += 360;
	} else {
		return lerpColor(_colorA, _colorB, _t);
	}

	let satA = saturation(_colorA);
	let briA = brightness(_colorA);
	let alphaA = alpha(_colorA);

	let satB = saturation(_colorB);
	let briB = brightness(_colorB);
	let alphaB = alpha(_colorB);

	let resultHue = lerp(hueA, hueB, _t);
	let resultSat = lerp(satA, satB, _t);
	let resultBri = lerp(briA, briB, _t);
	let resultAlpha = lerp(alphaA, alphaB, _t);

	if (resultHue < 0) {
		resultHue += 360;
	} else if (resultHue > 360) {
		resultHue -= 360;
	}

	return color(resultHue, resultSat, resultBri, resultAlpha);
}

function processHue(_hue) {
	let result = _hue % 360;
	if (result < 0) {
		result += 360;
	}
	return result;
}


function NYColorFromHex(hex, alpha = 1.0) {
	// temporarily use p5 color() to decode
	const c = color(hex);
	const h = hue(c);
	const s = saturation(c);
	const b = brightness(c);
	return new NYColor(h, s, b, alpha);
}

function shareLink() {
	// make sure the current seed is encoded in the URL
	const params = new URLSearchParams();
	params.set("seed", SEED);
	const url = `${location.origin}${location.pathname}?${params.toString()}`;

	// copy the URL to clipboard
	navigator.clipboard
		.writeText(url)
		.then(() => {
			alert(
				`Pond link copied!\n\n${url}\n\nShare it — anyone who opens it will see your exact pond!`
			);
		})
		.catch((err) => {
			console.error("Clipboard copy failed:", err);
			alert(
				"Couldn't copy link automatically. You can copy it manually:\n" + url
			);
		});
}

function makeUI() {
	const pad = 8;
	const shareBtn = createButton("Share Pond");
	shareBtn.position(pad, pad);
	shareBtn.mousePressed(shareLink);

	seedInput = createInput(SEED.toString());
	seedInput.position(pad, pad + 40);
	seedInput.size(120);

	applyBtn = createButton("Load Seed");
	applyBtn.position(pad + 130, pad + 40);
	applyBtn.mousePressed(() => {
		const newSeed = int(seedInput.value());
		localStorage.setItem("pondSeed", newSeed);
		location.reload();
	});

	const saveBtn = createButton("Save Image");
	saveBtn.position(pad, pad + 80);
	saveBtn.mousePressed(() => {
		const filename = "pond_(seed_=_" + SEED + ")";
		saveCanvas(filename, "png");
	});

	const clearBtn = createButton("Clear Seed");
	clearBtn.position(pad + 130, pad + 80);
	clearBtn.mousePressed(() => {
		localStorage.removeItem("pondSeed");
		location.reload();
	});
	const readmeBtn = createButton("Readme");
	readmeBtn.position(pad, pad + 120);
	readmeBtn.mousePressed(() => {
		window.open("https://github.com/nhi1e/cse169_generator#readme", "_blank");
	});
}

function stateToURL() {
	const params = new URLSearchParams();
	params.set("seed", SEED);
	const newUrl = `${location.origin}${location.pathname}?${params.toString()}`;
	history.replaceState(null, "", newUrl);
}

function loadSeedFromURL() {
	const params = new URLSearchParams(location.search);
	if (params.has("seed")) {
		const urlSeed = int(params.get("seed"));
		if (!isNaN(urlSeed)) {
			SEED = urlSeed;
			randomSeed(SEED);
			noiseSeed(SEED);
			console.log("Loaded seed from URL:", SEED);
		}
	}
}
