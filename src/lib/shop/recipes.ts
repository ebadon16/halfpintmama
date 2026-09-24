// The 35 recipes in Rest & Rise, with what a freezer label needs to say about
// each: how long it keeps, how much a batch makes, and how to get it from the
// freezer to the table. This is the data behind the label PDF's recipe
// dropdown and its auto-fill.
//
// Every line was cross-checked against the FINAL KDP interior (Sep 22 2026):
// the recipe's STORAGE block and its cook-day step. Where Keegan's Canva
// "freezer labels" draft (Sep 23 2026) disagreed with the book, the book won:
// the five casseroles bake 60-75 minutes covered from frozen, not 35-60;
// freezer bags rinse under COOL water, not warm; honey garlic is 15 minutes at
// pressure with a 10-minute release; bone broth keeps 3 months like everything
// else; and slow-cooker bags thaw a FULL 24 hours, not "overnight".
//
// `directions` is plain text (it lands in a PDF form field), written the way
// the book's storage blocks are: a short label, a colon, the step
// ("Reheating from frozen: ..."). Segments are separated by newlines. Keep
// each under ~400 characters so it fits the label at 8.5pt.

export interface Recipe {
  name: string;
  page: number;
  // Shown after the name on the label, e.g. "slow cooker". Book wording, not
  // brand names.
  cooker?: "slow cooker" | "pressure cooker";
  // "Best by 3 months, use within 12 months" for everything but Little Sealed
  // Sandwiches (1–2 months for the bread's sake), straight from the book's
  // storage blocks. Printed on the label, so there is no best-by box to fill.
  keeps: string;
  yield: string;
  directions: string;
}

const KEEPS = "Best by 3 months, use within 12 months";

export const RECIPES: readonly Recipe[] = [
  {
    name: "Classic Artisan Sourdough Loaf",
    page: 48,
    keeps: KEEPS,
    yield: "1 loaf or 12 slices",
    directions:
      "Reheating from frozen: toast slices straight from the freezer, 2–3 minutes.\nWhole loaf: thaw wrapped at room temperature for several hours or overnight, then warm at 350°F for about 15 minutes. Skip the fridge.",
  },
  {
    name: "Easy Sourdough Sandwich Bread",
    page: 50,
    keeps: KEEPS,
    yield: "1 loaf · about 12 slices",
    directions:
      "Reheating from frozen: toast straight from the freezer.\nFor a soft slice: thaw at room temperature 30–45 minutes. Skip the fridge; it speeds up staling.",
  },
  {
    name: "Sourdough Cinnamon Raisin Bread",
    page: 52,
    keeps: KEEPS,
    yield: "1 loaf · about 12 slices",
    directions:
      "Reheating from frozen: toast straight from the freezer.\nFor a soft slice: thaw at room temperature 30–45 minutes. Skip the fridge; it speeds up staling.",
  },
  {
    name: "Sourdough Tortillas",
    page: 54,
    keeps: KEEPS,
    yield: "24 tortillas",
    directions:
      "Reheating from frozen: warm in a dry skillet over medium heat, about 30 seconds per side. No thawing needed.",
  },
  {
    name: "Sourdough Puff Pastry",
    page: 56,
    keeps: KEEPS,
    yield: "1 batch",
    directions:
      "Thawing: overnight in the refrigerator, never at room temperature; the butter softens and you lose the layers.\nBaking: follow the recipe you are making.",
  },
  {
    name: "Sourdough English Muffins",
    page: 58,
    keeps: KEEPS,
    yield: "10–12 muffins",
    directions:
      "Reheating from frozen: straight into the toaster, no thawing needed.",
  },
  {
    name: "Sourdough Naan",
    page: 62,
    keeps: KEEPS,
    yield: "8 naan",
    directions:
      "Reheating from frozen: dry skillet over low to medium-low heat, 2–3 minutes per side, until soft and warmed through.\nTo finish: brush with melted garlic butter (3–4 Tbsp butter, 4 cloves garlic, 2 tsp cilantro) right off the pan.",
  },
  {
    name: "Loaded Breakfast Tacos",
    page: 66,
    keeps: KEEPS,
    yield: "24 tacos",
    directions:
      "Reheating from frozen: unwrap, wrap in a damp paper towel. Microwave 1 minute, then in 30-second bursts until steaming hot throughout. Rest 30 seconds.\nCrispier: finish in a dry skillet, 30 seconds to 1 minute per side.",
  },
  {
    name: "Bacon Egg and Cheese Muffin Sandwiches",
    page: 68,
    keeps: KEEPS,
    yield: "about 10 sandwiches",
    directions:
      "Reheating from frozen: unwrap. Microwave 1 minute, then in 30-second bursts until steaming hot all the way through.",
  },
  {
    name: "One-Handed Breakfast Pockets",
    page: 70,
    keeps: KEEPS,
    yield: "6 pockets",
    directions:
      "Baking from frozen: on parchment at 400°F for 28–32 minutes, until deep golden. Brush with egg wash first. Tent with foil for the last 10 minutes if browning fast.\nTo serve: cool 5 minutes before eating; the filling holds heat.",
  },
  {
    name: "Italian Mini Quiches",
    page: 72,
    keeps: KEEPS,
    yield: "12 mini quiches",
    directions:
      "Reheating from frozen: on parchment at 350°F for 10–12 minutes, until steaming hot through. No thawing needed.\nFaster: microwave 60–90 seconds (softer crust).",
  },
  {
    name: "Freezer Waffles",
    page: 74,
    keeps: KEEPS,
    yield: "about 4–6 waffles",
    directions:
      "Reheating from frozen: toaster on medium-high, one cycle. No thawing needed.",
  },
  {
    name: "Overnight Sourdough French Toast Bake",
    page: 76,
    keeps: KEEPS,
    yield: "about 9 portions",
    directions:
      "Reheating from frozen: microwave a portion 60–90 seconds, or 350°F oven for 8–10 minutes until heated through. The oven brings the streusel back best.",
  },
  {
    name: "Aloha Meatballs",
    page: 80,
    cooker: "slow cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Thawing: in the refrigerator a full 24 hours.\nCooking: slow cooker on low 4–6 hours or high 2–3 hours.\nTo finish: 30 minutes before serving, whisk 1 Tbsp cornstarch into ¼ cup hot liquid from the pot, stir back in, lid off.\nTo serve: over rice or on slider rolls.",
  },
  {
    name: "The House Chili",
    page: 82,
    cooker: "slow cooker",
    keeps: KEEPS,
    yield: "serves 8–10",
    directions:
      "Thawing: in the refrigerator a full 24 hours.\nCooking: slow cooker on low 6–8 hours or high 3–4 hours.\nToo thin: crack the lid for the last hour. Too thick: stir in a splash of broth.\nTo serve: with cheese, sour cream, tortilla chips or avocado.",
  },
  {
    name: "Khao Tom: Thai Ginger and Rice Soup",
    page: 84,
    cooker: "slow cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Thawing: in the refrigerator a full 24 hours.\nCooking: slow cooker on low 6–8 hours or high 3–4 hours, until the chicken shreds.\nTo finish: shred the chicken, return it to the broth, stir in two big spoonfuls of cooked rice.\nTo serve: with extra rice, green onions and cilantro.",
  },
  {
    name: "Pressure Cooker Chicken Bone Broth",
    page: 86,
    keeps: KEEPS,
    yield: "8–10 cups",
    directions:
      "Thawing: move a jar to the refrigerator two nights before you need it; a quart takes a while. Quicker: stand the sealed jar in a bowl of cool water.\nFreezing: leave headspace; the liquid expands.",
  },
  {
    name: "Honey Garlic Chicken",
    page: 88,
    cooker: "pressure cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Cooking from frozen: rinse the sealed bag under cool tap water 30–60 seconds, then into the pot. High Pressure 15 minutes, natural release 10 minutes, then quick release. Check 165°F.\nCooking from thawed (24 hours in the fridge): High Pressure 8 minutes.\nTo finish: on Sauté, whisk 2 Tbsp cornstarch into ¼ cup hot liquid, stir back in until glossy. Shred the chicken into the sauce. Serve over rice.",
  },
  {
    name: "Weeknight Butter Chicken",
    page: 90,
    cooker: "pressure cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Cooking from frozen: rinse the sealed bag under cool tap water 30 seconds, then into the pot. High Pressure 15 minutes, natural release 10 minutes. Check 165°F.\nCooking from thawed (24 hours in the fridge): High Pressure 8 minutes.\nTo finish: blend the sauce smooth, then simmer on Sauté with 4 Tbsp butter, 1/3 cup cream and 1 tsp garam masala, 5–10 minutes. Add the chopped chicken back. Serve with naan or rice.",
  },
  {
    name: "Freezer Pork Shoulder: Three Ways",
    page: 92,
    cooker: "pressure cooker",
    keeps: KEEPS,
    yield: "one 4 lb bag · serves 4–6",
    directions:
      "Cooking from frozen: add 1 cup water or broth, drop in the frozen pork. High Pressure 90 minutes, natural release 20–25 minutes. Shred, lift out of the liquid.\nCarnitas: broil 4–5 minutes for crispy edges. Barbecue: warm in sauce, pile on baked potatoes. Hoisin: crisp in a hot skillet, toss with the sauce, serve over rice.",
  },
  {
    name: "Nesting Ziti",
    page: 98,
    keeps: KEEPS,
    yield: "serves 8–10",
    directions:
      "Baking from frozen: remove the plastic, keep the foil on. 375°F covered 75 minutes, then uncovered 15 minutes until golden and bubbly; center 165°F. Rest 10 minutes.\nBaking from thawed (24–36 hours in the refrigerator): 375°F covered 45 minutes, uncovered 15 minutes; center 165°F.",
  },
  {
    name: "Better Than the Box Beef and Pasta Bake",
    page: 100,
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Baking from frozen: remove the plastic, keep the foil on. 375°F covered 75 minutes, then uncovered 15–20 minutes until bubbly and browning; center 165°F. Rest 5–10 minutes.\nBaking from thawed (24–36 hours in the refrigerator): 375°F covered 35 minutes, uncovered 15 minutes; center 165°F.",
  },
  {
    name: "Creamy Confetti Chicken Casserole",
    page: 102,
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Baking from frozen: remove the plastic, keep the foil on. 375°F covered 70 minutes, then uncovered 15–20 minutes until bubbly and golden; center 165°F. Rest 5–10 minutes.\nBaking from thawed (24–36 hours in the refrigerator): 375°F covered 30 minutes, uncovered 10–15 minutes; center 165°F.",
  },
  {
    name: "Barbecue Chicken and Sweet Potato Casserole",
    page: 104,
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "Baking from frozen: do not thaw. Remove the plastic, keep the foil on. 400°F covered 60 minutes, then uncovered 20 minutes until the panko is golden; center 165°F. Rest 10 minutes so the layers set.\nBaking from thawed (24–36 hours in the refrigerator): 400°F covered 30 minutes, uncovered 15 minutes; center 165°F.",
  },
  {
    name: "Enchiladas That Show Up for You",
    page: 106,
    keeps: KEEPS,
    yield: "8–10 enchiladas",
    directions:
      "Baking from frozen: do not thaw. Remove the plastic, keep the foil on. 375°F covered 65 minutes, then uncovered 15 minutes until bubbly; center 165°F. Rest 5 minutes.\nBaking from thawed (24–36 hours in the refrigerator): 375°F covered 25 minutes, uncovered 15 minutes; center 165°F.",
  },
  {
    name: "Mini Sourdough Discard Pizzas",
    page: 110,
    keeps: KEEPS,
    yield: "about 24 mini pizzas",
    directions:
      "Lunchbox: pack frozen with an ice pack in the morning; ready by lunch.\nReheating: air fryer 350°F for 4–5 minutes (crispiest), toaster oven 375°F for 6–8 minutes, or oven 375°F for 8–10 minutes.",
  },
  {
    name: "Sourdough Puff Pastry Pinwheels",
    page: 112,
    keeps: KEEPS,
    yield: "30 pinwheels",
    directions:
      "Frozen baked: pack frozen with an ice pack for lunch (soft by midday), or air fryer 350°F for 3–4 minutes.\nFrozen unbaked: bake from frozen at 375°F for 20–26 minutes, until golden.",
  },
  {
    name: "Little Sealed Sandwiches",
    page: 114,
    keeps: "Best by 1–2 months, use within 12 months",
    yield: "12 sandwiches",
    directions:
      "Lunchbox: pack frozen with an ice pack; thawed by lunch.\nIn a hurry: room temperature 30–45 minutes, or microwave 20–30 seconds and no more. The jelly gets very hot.",
  },
  {
    name: "Lactation Chocolate Chip Cookies",
    page: 118,
    keeps: KEEPS,
    yield: "about 18 cookies",
    directions:
      "Baking from frozen (dough): 350°F for 10–12 minutes, edges golden and centers slightly soft. Sprinkle with flaky salt while warm.\nFrozen baked: thaw at room temperature about 20 minutes, or 300°F oven for 5 minutes.",
  },
  {
    name: "Lactation Banana Bread",
    page: 120,
    keeps: KEEPS,
    yield: "1 loaf · about 10 slices",
    directions:
      "Reheating from frozen: microwave a slice 45–60 seconds and butter it warm, or 300°F oven for 10–12 minutes. Or thaw a slice on the counter overnight.",
  },
  {
    name: "Lactation Peanut Butter Truffles",
    page: 122,
    keeps: KEEPS,
    yield: "16 truffles",
    directions:
      "Serving from frozen: straight from the freezer is the best way.\nSofter: room temperature 10–15 minutes, or the refrigerator overnight.",
  },
  {
    name: "Lactation Chocolate Bark",
    page: 124,
    keeps: KEEPS,
    yield: "20–24 pieces",
    directions:
      "Serving from frozen: straight from the freezer is the best way.\nSofter: room temperature about 5 minutes.",
  },
  {
    name: "Lemon Blueberry Oat Lactation Muffins",
    page: 126,
    keeps: KEEPS,
    yield: "18 muffins",
    directions:
      "Reheating from frozen: microwave 30–60 seconds and butter it warm, or 300°F oven for 12–15 minutes. Or thaw on the counter about 30 minutes.",
  },
  {
    name: "Oat and Honey Lactation Energy Balls",
    page: 128,
    keeps: KEEPS,
    yield: "20 balls",
    directions:
      "Serving from frozen: straight from the freezer; they soften in a minute or two in your hand.\nRoom temperature: about 10 minutes if you prefer.",
  },
  {
    name: "Apricot Cranberry Lactation Granola Bars",
    page: 130,
    keeps: KEEPS,
    yield: "20 bars",
    directions:
      "Thawing: room temperature 20–30 minutes for the chewiest texture, or microwave 20–30 seconds. Straight from frozen works too, just firmer.",
  },
];

// Names only, in book order: the dropdown's option list.
export const BOOK_RECIPES: readonly string[] = RECIPES.map((r) => r.name);

// What the label prints under the name: only the best-by line. Yields are
// deliberately left off (a buyer may portion a batch differently than the
// book), and the cooker is already named in the directions.
export function recipeMeta(r: Recipe): string {
  return r.keeps;
}

// The dropdown shows the book title exactly.
export function recipeLabel(r: Recipe): string {
  return r.name;
}

export function findRecipe(label: string): Recipe | undefined {
  return RECIPES.find((r) => r.name === label);
}
