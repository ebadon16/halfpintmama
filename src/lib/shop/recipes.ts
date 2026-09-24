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
// `directions` is plain text (it lands in a PDF form field): a capitalised
// lead word, a space, the step. Segments are separated by newlines. Keep each
// under ~330 characters so it fits the label at 9pt.

export interface Recipe {
  name: string;
  page: number;
  // Shown after the name on the label, e.g. "slow cooker". Book wording, not
  // brand names.
  cooker?: "slow cooker" | "pressure cooker";
  // "about 3 months" for almost everything: the book's "best within 3 months,
  // use within 12". Little Sealed Sandwiches are the one exception.
  keeps: string;
  yield: string;
  directions: string;
}

const KEEPS = "about 3 months";

export const RECIPES: readonly Recipe[] = [
  {
    name: "Classic Artisan Sourdough Loaf",
    page: 48,
    keeps: KEEPS,
    yield: "1 loaf or 12 slices",
    directions:
      "TOAST slices straight from frozen, 2–3 minutes.\n" +
      "WHOLE LOAF thaw wrapped at room temp for several hours or overnight, then warm at 350°F for about 15 min. Skip the fridge.",
  },
  {
    name: "Easy Sourdough Sandwich Bread",
    page: 50,
    keeps: KEEPS,
    yield: "1 loaf · about 12 slices",
    directions:
      "TOAST straight from frozen.\n" +
      "SOFT SLICE thaw at room temp 30–45 min. Skip the fridge; it speeds up staling.",
  },
  {
    name: "Sourdough Cinnamon Raisin Bread",
    page: 52,
    keeps: KEEPS,
    yield: "1 loaf · about 12 slices",
    directions:
      "TOAST straight from frozen.\n" +
      "SOFT SLICE thaw at room temp 30–45 min. Skip the fridge; it speeds up staling.",
  },
  {
    name: "Sourdough Tortillas",
    page: 54,
    keeps: KEEPS,
    yield: "24 tortillas",
    directions: "REHEAT from frozen in a dry skillet over medium heat, about 30 sec per side. No thawing needed.",
  },
  {
    name: "Sourdough Puff Pastry",
    page: 56,
    keeps: KEEPS,
    yield: "1 batch",
    directions:
      "THAW overnight in the fridge before using. Never at room temp: the butter softens and you lose the layers.\n" +
      "BAKE as the recipe you are making directs.",
  },
  {
    name: "Sourdough English Muffins",
    page: 58,
    keeps: KEEPS,
    yield: "10–12 muffins",
    directions: "TOAST straight from frozen, no thawing needed.",
  },
  {
    name: "Sourdough Naan",
    page: 62,
    keeps: KEEPS,
    yield: "8 naan",
    directions:
      "REHEAT from frozen in a dry skillet over low to medium-low, 2–3 min per side, until soft and warmed through.\n" +
      "FINISH brush with melted garlic butter (3–4 Tbsp butter, 4 cloves garlic, 2 tsp cilantro) right off the pan.",
  },
  {
    name: "Loaded Breakfast Tacos",
    page: 66,
    keeps: KEEPS,
    yield: "24 tacos",
    directions:
      "REHEAT from frozen: unwrap, wrap in a damp paper towel. Microwave 1 min, then 30-sec bursts until steaming hot throughout. Rest 30 sec.\n" +
      "CRISPIER finish in a dry skillet, 30 sec to 1 min per side.",
  },
  {
    name: "Bacon Egg and Cheese Muffin Sandwiches",
    page: 68,
    keeps: KEEPS,
    yield: "about 10 sandwiches",
    directions: "REHEAT from frozen: unwrap. Microwave 1 min, then 30-sec bursts until steaming hot all the way through.",
  },
  {
    name: "One-Handed Breakfast Pockets",
    page: 70,
    keeps: KEEPS,
    yield: "6 pockets",
    directions:
      "BAKE from frozen on parchment at 400°F for 28–32 min, until deep golden. Brush with egg wash first. Tent with foil the last 10 min if browning fast.\n" +
      "COOL 5 min before eating; the filling holds heat.",
  },
  {
    name: "Italian Mini Quiches",
    page: 72,
    keeps: KEEPS,
    yield: "12 mini quiches",
    directions:
      "REHEAT from frozen on parchment at 350°F for 10–12 min, until steaming hot through. No thawing needed.\n" +
      "FASTER microwave 60–90 sec (softer crust).",
  },
  {
    name: "Freezer Waffles",
    page: 74,
    keeps: KEEPS,
    yield: "about 4–6 waffles",
    directions: "REHEAT from frozen: toaster on medium-high, one cycle. No thawing needed.",
  },
  {
    name: "Overnight Sourdough French Toast Bake",
    page: 76,
    keeps: KEEPS,
    yield: "about 9 portions",
    directions:
      "REHEAT from frozen: microwave a portion 60–90 sec, or 350°F oven for 8–10 min until heated through. The oven brings the streusel back best.",
  },
  {
    name: "Aloha Meatballs",
    page: 80,
    cooker: "slow cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "THAW in the fridge a full 24 hours.\n" +
      "COOK on low 4–6 hrs or high 2–3 hrs.\n" +
      "FINISH 30 min before serving: whisk 1 Tbsp cornstarch into ¼ cup hot liquid from the pot, stir back in, lid off.\n" +
      "SERVE over rice or on slider rolls.",
  },
  {
    name: "The House Chili",
    page: 82,
    cooker: "slow cooker",
    keeps: KEEPS,
    yield: "serves 8–10",
    directions:
      "THAW in the fridge a full 24 hours.\n" +
      "COOK on low 6–8 hrs or high 3–4 hrs.\n" +
      "FINISH too thin: crack the lid for the last hour. Too thick: stir in a splash of broth.\n" +
      "SERVE with cheese, sour cream, tortilla chips or avocado.",
  },
  {
    name: "Khao Tom: Thai Ginger and Rice Soup",
    page: 84,
    cooker: "slow cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "THAW in the fridge a full 24 hours.\n" +
      "COOK on low 6–8 hrs or high 3–4 hrs, until the chicken shreds.\n" +
      "FINISH shred the chicken, return it to the broth, stir in two big spoonfuls of cooked rice.\n" +
      "SERVE with extra rice, green onions and cilantro.",
  },
  {
    name: "Pressure Cooker Chicken Bone Broth",
    page: 86,
    keeps: KEEPS,
    yield: "8–10 cups",
    directions:
      "THAW move a jar to the fridge two nights before you need it; a quart takes a while. Quicker: stand the sealed jar in a bowl of cool water.\n" +
      "FREEZE with headspace; the liquid expands.",
  },
  {
    name: "Honey Garlic Chicken",
    page: 88,
    cooker: "pressure cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "FROM FROZEN run the sealed bag under cool tap water 30–60 sec, slide the block into the pot. High Pressure 15 min, natural release 10 min, then quick release. Thickest piece 165°F.\n" +
      "FROM THAWED (a full 24 hrs in the fridge) High Pressure 8 min.\n" +
      "FINISH Sauté: whisk 2 Tbsp cornstarch into ¼ cup hot liquid, stir back in until glossy. Shred the chicken, return to the pot.\n" +
      "SERVE over rice.",
  },
  {
    name: "Weeknight Butter Chicken",
    page: 90,
    cooker: "pressure cooker",
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "FROM FROZEN run the sealed bag under cool tap water 30 sec, add to the pot. High Pressure 15 min, natural release 10 min. Thickest piece 165°F.\n" +
      "FROM THAWED (a full 24 hrs in the fridge) High Pressure 8 min.\n" +
      "FINISH blend the sauce smooth, then Sauté with 4 Tbsp butter, 1/3 cup cream and 1 tsp garam masala for 5–10 min. Return the chopped chicken.\n" +
      "SERVE with naan or over rice.",
  },
  {
    name: "Freezer Pork Shoulder: Three Ways",
    page: 92,
    cooker: "pressure cooker",
    keeps: KEEPS,
    yield: "one 4 lb bag · serves 4–6",
    directions:
      "COOK FROM FROZEN add 1 cup water or broth, drop in the frozen pork. High Pressure 90 min, natural release 20–25 min. Shred, lift out of the liquid.\n" +
      "THEN carnitas: broil 4–5 min for crispy edges. Barbecue: warm in sauce, pile on baked potatoes. Hoisin: crisp in a hot skillet, toss with the sauce, serve over rice.",
  },
  {
    name: "Nesting Ziti",
    page: 98,
    keeps: KEEPS,
    yield: "serves 8–10",
    directions:
      "FROM FROZEN remove the plastic, keep the foil on. 375°F covered 75 min, then uncovered 15 min until golden and bubbly; center 165°F. Rest 10 min.\n" +
      "FROM THAWED (24–36 hrs in the fridge) 375°F covered 45 min, uncovered 15 min; center 165°F.",
  },
  {
    name: "Better Than the Box Beef and Pasta Bake",
    page: 100,
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "FROM FROZEN remove the plastic, keep the foil on. 375°F covered 75 min, then uncovered 15–20 min until bubbly and browning; center 165°F. Rest 5–10 min.\n" +
      "FROM THAWED (24–36 hrs in the fridge) 375°F covered 35 min, uncovered 15 min; center 165°F.",
  },
  {
    name: "Creamy Confetti Chicken Casserole",
    page: 102,
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "FROM FROZEN remove the plastic, keep the foil on. 375°F covered 70 min, then uncovered 15–20 min until bubbly and golden; center 165°F. Rest 5–10 min.\n" +
      "FROM THAWED (24–36 hrs in the fridge) 375°F covered 30 min, uncovered 10–15 min; center 165°F.",
  },
  {
    name: "Barbecue Chicken and Sweet Potato Casserole",
    page: 104,
    keeps: KEEPS,
    yield: "serves 6–8",
    directions:
      "FROM FROZEN do not thaw. Remove the plastic, keep the foil on. 400°F covered 60 min, then uncovered 20 min until the panko is golden; center 165°F. Rest 10 min so the layers set.\n" +
      "FROM THAWED (24–36 hrs in the fridge) 400°F covered 30 min, uncovered 15 min; center 165°F.",
  },
  {
    name: "Enchiladas That Show Up for You",
    page: 106,
    keeps: KEEPS,
    yield: "8–10 enchiladas",
    directions:
      "FROM FROZEN do not thaw. Remove the plastic, keep the foil on. 375°F covered 65 min, then uncovered 15 min until bubbly; center 165°F. Rest 5 min.\n" +
      "FROM THAWED (24–36 hrs in the fridge) 375°F covered 25 min, uncovered 15 min; center 165°F.",
  },
  {
    name: "Mini Sourdough Discard Pizzas",
    page: 110,
    keeps: KEEPS,
    yield: "about 24 mini pizzas",
    directions:
      "LUNCHBOX pack frozen with an ice pack in the morning; ready by lunch.\n" +
      "REHEAT air fryer 350°F for 4–5 min (crispiest), toaster oven 375°F for 6–8 min, or oven 375°F for 8–10 min.",
  },
  {
    name: "Sourdough Puff Pastry Pinwheels",
    page: 112,
    keeps: KEEPS,
    yield: "30 pinwheels",
    directions:
      "FROZEN BAKED pack frozen with an ice pack for lunch (soft by midday), or air fryer 350°F for 3–4 min.\n" +
      "FROZEN UNBAKED bake from frozen at 375°F for 20–26 min, until golden.",
  },
  {
    name: "Little Sealed Sandwiches",
    page: 114,
    keeps: "best within 1–2 months",
    yield: "12 sandwiches",
    directions:
      "LUNCHBOX pack frozen with an ice pack; thawed by lunch.\n" +
      "NEEDED NOW room temp 30–45 min, or microwave 20–30 sec and no more. The jelly gets very hot.",
  },
  {
    name: "Lactation Chocolate Chip Cookies",
    page: 118,
    keeps: KEEPS,
    yield: "about 18 cookies",
    directions:
      "BAKE dough from frozen at 350°F for 10–12 min, edges golden and centers slightly soft. Sprinkle with flaky salt while warm.\n" +
      "FROZEN BAKED thaw at room temp about 20 min, or 300°F oven for 5 min.",
  },
  {
    name: "Lactation Banana Bread",
    page: 120,
    keeps: KEEPS,
    yield: "1 loaf · about 10 slices",
    directions:
      "REHEAT from frozen: microwave a slice 45–60 sec and butter it warm, or 300°F oven for 10–12 min. Or thaw a slice on the counter overnight.",
  },
  {
    name: "Lactation Peanut Butter Truffles",
    page: 122,
    keeps: KEEPS,
    yield: "16 truffles",
    directions: "EAT straight from frozen (best this way).\nSOFTER room temp 10–15 min, or the fridge overnight.",
  },
  {
    name: "Lactation Chocolate Bark",
    page: 124,
    keeps: KEEPS,
    yield: "20–24 pieces",
    directions: "EAT straight from frozen (best this way).\nSOFTER room temp about 5 min.",
  },
  {
    name: "Lemon Blueberry Oat Lactation Muffins",
    page: 126,
    keeps: KEEPS,
    yield: "18 muffins",
    directions:
      "REHEAT from frozen: microwave 30–60 sec and butter it warm, or 300°F oven for 12–15 min. Or thaw on the counter about 30 min.",
  },
  {
    name: "Oat and Honey Lactation Energy Balls",
    page: 128,
    keeps: KEEPS,
    yield: "20 balls",
    directions: "EAT straight from frozen; they soften in a minute or two in your hand.\nROOM TEMP about 10 min if you prefer.",
  },
  {
    name: "Apricot Cranberry Lactation Granola Bars",
    page: 130,
    keeps: KEEPS,
    yield: "20 bars",
    directions:
      "THAW at room temp 20–30 min for the chewiest texture, or microwave 20–30 sec. Straight from frozen works too, just firmer.",
  },
];

// Names only, in book order: the dropdown's option list.
export const BOOK_RECIPES: readonly string[] = RECIPES.map((r) => r.name);

// What the label prints under the name: "about 3 months · serves 6–8 · slow
// cooker". The cooker lives here rather than in the title so the longest
// titles still fit the recipe box.
export function recipeMeta(r: Recipe): string {
  return [r.keeps, r.yield, r.cooker].filter(Boolean).join(" · ");
}

// The dropdown shows the book title exactly.
export function recipeLabel(r: Recipe): string {
  return r.name;
}

export function findRecipe(label: string): Recipe | undefined {
  return RECIPES.find((r) => r.name === label);
}
