import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { shopCopy } from "@/lib/shop/catalog";
import { getShopStatus } from "@/lib/shop/status";

// The share card for /shop: the book itself, not the site-wide banner. Read
// once at module scope; nothing here depends on the request. Assets live in
// private/shop, which next.config already traces into the function bundle.
export const alt = "Rest & Rise: Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dir = join(process.cwd(), "private", "shop");
const cover = `data:image/jpeg;base64,${await readFile(join(dir, "og-cover.jpg"), "base64")}`;
const [semibold, italic] = await Promise.all([
  readFile(join(dir, "fonts", "CrimsonText-SemiBold.ttf")),
  readFile(join(dir, "fonts", "CrimsonText-Italic.ttf")),
]);

export default async function OgImage() {
  // Same badge the page shows, so a card shared during preorder says so and
  // one shared after launch does not. Static pages bake the phase in at build
  // and a phase flip needs a redeploy anyway.
  const { badge } = shopCopy(getShopStatus());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(180deg, #F5F1E8 0%, #EEE8DE 60%, #E6DFD3 100%)",
          fontFamily: "Crimson",
          padding: "60px 72px",
          position: "relative",
        }}
      >
        <img
          src={cover}
          width={357}
          height={510}
          alt=""
          style={{
            width: 357,
            height: 510,
            borderRadius: 6,
            boxShadow: "0 24px 48px rgba(58, 58, 56, 0.28)",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 64,
            flexGrow: 1,
            color: "#3A3A38",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#4A5845",
              fontWeight: 600,
            }}
          >
            Half Pint Mama
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 104,
              fontWeight: 600,
              color: "#4A5845",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Rest &amp; Rise
          </div>

          <div style={{ marginTop: 26, width: 160, height: 4, background: "#A0562F", borderRadius: 2 }} />

          <div
            style={{
              marginTop: 26,
              fontSize: 34,
              fontStyle: "italic",
              lineHeight: 1.25,
              maxWidth: 620,
            }}
          >
            Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery
          </div>

          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "#A0562F",
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              {badge}
            </div>
            <div style={{ fontSize: 24, color: "#3A3A38", opacity: 0.8 }}>halfpintmama.com/shop</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Crimson", data: semibold, weight: 600, style: "normal" },
        { name: "Crimson", data: italic, weight: 400, style: "italic" },
      ],
    }
  );
}
