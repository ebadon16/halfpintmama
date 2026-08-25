// What the shop sells, and what each purchase entitles the buyer to.
//
// The store has two phases. During the preorder window the printable freezer
// labels come free with the book and CANNOT be bought on their own — that
// exclusivity is the entire reason to preorder rather than wait. At launch the
// offer inverts: the book stops including them and they go on sale separately.

export type ShopPhase = "preorder" | "launched";

export type ProductId = "book" | "labels";

export type Entitlement = "labels";

export interface Product {
  id: ProductId;
  name: string;
  kind: "physical" | "digital";
  // Stripe holds the price, so the shop page and the charge can never disagree
  // and Keegan can reprice without a deploy. This names the env var carrying
  // the Stripe Price ID.
  priceEnv: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  book: {
    id: "book",
    name: "Rest and Rise",
    kind: "physical",
    priceEnv: "STRIPE_PRICE_BOOK",
  },
  labels: {
    id: "labels",
    name: "Printable Freezer Labels",
    kind: "digital",
    priceEnv: "STRIPE_PRICE_LABELS",
  },
};

// Defaults to "preorder": the conservative choice, since it never puts the
// labels on sale on their own. Nothing can sell at all without Stripe keys.
export function getShopPhase(): ShopPhase {
  return process.env.SHOP_PHASE === "launched" ? "launched" : "preorder";
}

export function purchasableProducts(phase: ShopPhase): Product[] {
  if (phase === "launched") return [PRODUCTS.book, PRODUCTS.labels];
  return [PRODUCTS.book];
}

export function isPurchasable(id: ProductId, phase: ShopPhase): boolean {
  return purchasableProducts(phase).some((p) => p.id === id);
}

// What an order grants, given the phase THE ORDER WAS PLACED IN — never the
// current phase. Fulfilment reads the phase back off the Stripe session so a
// flip mid-payment can't change what a buyer was promised when they clicked buy.
export function entitlementsFor(
  productIds: readonly ProductId[],
  phase: ShopPhase
): Entitlement[] {
  const granted = new Set<Entitlement>();

  for (const id of productIds) {
    if (id === "labels") granted.add("labels");
    // The preorder bonus. After launch the book carries no digital goods.
    if (id === "book" && phase === "preorder") granted.add("labels");
  }

  return [...granted];
}

export function requiresShipping(productIds: readonly ProductId[]): boolean {
  return productIds.some((id) => PRODUCTS[id]?.kind === "physical");
}
