// Pulls the front cover out of the KDP hardcover cover PDF into the image the
// shop page shows, so the site can never drift from the book that ships.
//
//   npx tsx scripts/shop/cover-from-print-file.mjs ~/Downloads/.../RestAndRise-COVER-KDP-*.pdf
//
// Do NOT derive the front panel by assuming the cover is wrap + trim + spine +
// trim + wrap. A hardcover case is bigger than the book block and has hinge
// channels either side of the spine, so that arithmetic lands about a quarter
// inch off and the crop looks visibly off-centre. The cover artwork is
// symmetric about its own middle, so the front panel's centre is the mirror of
// the back panel's, and that is what this measures.
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const src = process.argv[2];
if (!src || !fs.existsSync(src)) throw new Error("pass the path to the KDP cover PDF");

const py = `
import fitz, sys
d = fitz.open(sys.argv[1]); p = d[0]
W, H = p.rect.width/72, p.rect.height/72
words = p.get_text("words")
front = [w for w in words if (w[0]+w[2])/2/72 > W/2 + 0.7]
back  = [w for w in words if (w[0]+w[2])/2/72 < W/2 - 0.7]
fc = (min(w[0] for w in front)/72 + max(w[2] for w in front)/72)/2
bc = (min(w[0] for w in back)/72  + max(w[2] for w in back)/72)/2
mirror = W/2 + (W/2 - bc)
if abs(fc - mirror) > 0.05:
    raise SystemExit(f"front centre {fc:.3f} and mirrored back centre {mirror:.3f} disagree; check the cover by eye")
y0 = (H-10)/2
p.get_pixmap(dpi=200, clip=fitz.Rect((fc-3.5)*72, y0*72, (fc+3.5)*72, (y0+10)*72)).save(sys.argv[2])
print(f"front centre {fc:.4f} in, matches the mirrored back to {abs(fc-mirror)*25.4:.2f} mm")
`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cover-"));
const png = path.join(tmp, "front.png");
console.log(execSync(`python3 -c ${JSON.stringify(py)} ${JSON.stringify(src)} ${JSON.stringify(png)}`).toString().trim());
execSync(`sips -s format jpeg -s formatOptions 88 ${JSON.stringify(png)} --out public/images/rest-and-rise-cover.jpg`, { stdio: "ignore" });
console.log("wrote public/images/rest-and-rise-cover.jpg", fs.statSync("public/images/rest-and-rise-cover.jpg").size, "bytes");
