import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Half Pint Mama: Nourishing Motherhood From Scratch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #FAF7F2 0%, #F4EDE2 60%, #E8DDD0 100%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            color: "#6B7F5F",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span>From the ER to the Kitchen</span>
          <span>halfpintmama.com</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#6B7F5F",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Half Pint Mama
          </div>

          <div
            style={{
              width: 240,
              height: 4,
              background: "#C17B68",
              borderRadius: 2,
            }}
          />

          <div
            style={{
              fontSize: 44,
              color: "#3D3D3D",
              fontStyle: "italic",
              maxWidth: 900,
              lineHeight: 1.25,
            }}
          >
            Nourishing Motherhood From Scratch
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#3D3D3D",
            opacity: 0.7,
          }}
        >
          Sourdough · Family Travel · DIY · Mama Life
        </div>
      </div>
    ),
    { ...size }
  );
}
