// --- color.js ---
function getRandomColorSet() {
	let sets = [];

	// --- Deep Blue + Warm Koi Orange Palette (Image 1) ---
	sets.push({
		// Water & reflections
		waterColor: NYColorFromHex("#022F40"),
		waterFlowColor: NYColorFromHex("#89A89E"),
		waterShimmer: NYColorFromHex("#D4E1E0"),
		waterGround: NYColorFromHex("#09596A"),
		waterSurfaceColor: NYColorFromHex("#0593BC"),

		// Leaves & pads
		plantColorA: NYColorFromHex("#C5D592"),
		plantColorB: NYColorFromHex("#56C3C0"),
		plantContrastColor: NYColorFromHex("#EAD992"),
		plantHighlightColor: NYColorFromHex("#F8D175"),

		// Flowers
		flowerInsideColor: NYColorFromHex("#F4B5C1", 0.8),
		flowerOutsideColor: NYColorFromHex("#790B44", 0.8),

		// Pistil / center
		pistilColorA: NYColorFromHex("#EAD992", 0.6),
		pistilColorB: NYColorFromHex("#F8D175", 0.6),

		// Lighting / shimmer
		lightDapple: NYColorFromHex("#D4E1E0"),
		padReflection: NYColorFromHex("#A3A5C3"),

		// 🐟 Fish (based on image #1)
		fish: {
			mainColor: NYColorFromHex("#F29C50"), // orange-gold
			stripeColor: NYColorFromHex("#F25F29"), // vivid coral-orange
			outlineColor: NYColorFromHex("#243840"), // deep pond blue outline
			finColor: NYColorFromHex("#495E6D", 0.55), // slate-gray fin
			spotColor: NYColorFromHex("#BF2E21"), // red-orange accent
		},
	});

	// --- Fiery Koi Palette (Image 2) ---
	sets.push({
		waterGround: NYColorFromHex("#050606"),
		waterColor: NYColorFromHex("#495E6D"),
		waterFlowColor: NYColorFromHex("#C8C1BA"),
		waterShimmer: NYColorFromHex("#E69100"),
		padReflection: NYColorFromHex("#D75D00"),

		plantColorA: NYColorFromHex("#A29859"),
		plantColorB: NYColorFromHex("#5C6534"),
		plantContrastColor: NYColorFromHex("#E69100"),
		plantHighlightColor: NYColorFromHex("#F2E9D8"),

		// Flowers
		flowerInsideColor: NYColorFromHex("#FBDDBB", 0.9), // peachy inner petals
		flowerOutsideColor: NYColorFromHex("#F8F8F8", 0.9), // coral outer petals

		pistilColorA: NYColorFromHex("#E69100", 0.7),
		pistilColorB: NYColorFromHex("#C8C1BA", 0.7),

		lightDapple: NYColorFromHex("#E69100"),

		// 🐟 Fish (based on image #2)
		fish: {
			mainColor: NYColorFromHex("#E70F00"), // bright red-orange
			stripeColor: NYColorFromHex("#D75D00"), // deep orange stripe
			outlineColor: NYColorFromHex("#050606"), // black outline
			finColor: NYColorFromHex("#C8C1BA", 0.45), // pale gray fin
			spotColor: NYColorFromHex("#E69100"), // gold highlight
		},
	});

	// --- Muted Earthy Koi Palette (Dark Water Variant) ---
	sets.push({
		waterGround: new NYColor(0, 0, 3), // almost black
		waterColor: new NYColor(0, 0, 3),
		waterFlowColor: new NYColor(0, 0, 10),
		waterShimmer: new NYColor(0, 0, 30), // faint reflection
		padReflection: new NYColor(0, 0, 20),

		plantColorA: NYColorFromHex("#0D2306"), // dark muted greens
		plantColorB: NYColorFromHex("#1D2E07"),
		plantContrastColor: NYColorFromHex("#96AC04"), // soft highlight contrast
		plantHighlightColor: NYColorFromHex("#A7DB0E"),

		flowerInsideColor: new NYColor(0, 0, 30, 0.8),
		flowerOutsideColor: new NYColor(0, 0, 100, 0.8),

		pistilColorA: new NYColor(180, 99, 100, 0.6),
		pistilColorB: new NYColor(20, 100, 100, 0.6),

		lightDapple: NYColorFromHex("#ffffff"),

		// 🐟 Fish (same as your muted earthy koi)
		fish: {
			mainColor: NYColorFromHex("#C05746"), // brick orange
			stripeColor: NYColorFromHex("#93867F"), // taupe stripe
			outlineColor: NYColorFromHex("#363333"), // dark charcoal
			finColor: NYColorFromHex("#BDBBB6", 0.55), // soft gray fin
			spotColor: NYColorFromHex("#BF2E21"), // warm red-orange spot
		},
	});

	// --- Forest Garden Monet Palette (new, from green + clay tone references) ---
	sets.push({
		// Water & reflections
		waterGround: NYColorFromHex("#384330"), // deep moss green
		waterColor: NYColorFromHex("#4d4d3b"), // murky olive reflection
		waterFlowColor: NYColorFromHex("#aed0be"), // pale mint reflection
		waterShimmer: NYColorFromHex("#96b565"), // sunlit ripple green
		padReflection: NYColorFromHex("#9ea46d"), // muted olive pad tint

		// Leaves & pads
		plantColorA: NYColorFromHex("#85943e"), // olive green
		plantColorB: NYColorFromHex("#122c08"), // deep forest tone
		plantContrastColor: NYColorFromHex("#9ea46d"), // lighter yellow-green
		plantHighlightColor: NYColorFromHex("#f5eded"), // subtle light reflection

		// Flowers
		flowerInsideColor: NYColorFromHex("#cc816f", 0.9), // dusty coral
		flowerOutsideColor: NYColorFromHex("#5b292a", 0.9), // dark clay rose

		// Pistil / center
		pistilColorA: NYColorFromHex("#f5eded", 0.6), // soft cream
		pistilColorB: NYColorFromHex("#9ea46d", 0.6), // olive-yellow glow

		// Lighting / shimmer
		lightDapple: NYColorFromHex("#aed0be"),

		fish: {
			mainColor: NYColorFromHex("#cc816f"), // clay-red body
			stripeColor: NYColorFromHex("#9ea46d"), // muted olive stripe
			outlineColor: NYColorFromHex("#122c08"), // dark green outline
			finColor: NYColorFromHex("#aed0be", 0.5), // translucent mint-green fin
			spotColor: NYColorFromHex("#5b292a"), // deep crimson spot
		},
	});

	return random(sets);
}
