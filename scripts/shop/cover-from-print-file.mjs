// Pulls the front cover out of the KDP hardcover cover PDF into the image the
// shop page shows, so the site can never drift from the book that ships.
//
//   npx tsx scripts/shop/cover-from-print-file.mjs ~/Downloads/.../RestAndRise-COVER-KDP-*.pdf
//
// Do NOT derive the front panel by assuming the cover is wrap + trim + spine +
// trim + wrap. A hardcover case is bigger than the book block and has hinge
// channels either side of the spine, so that arithmetic lands about a quarter
// inch off and the crop looks visibly off-centre. Instead this measures two
// things that are each centred on the front panel by design, the cover photo
// and the title line, and refuses if they disagree. (An earlier version
// mirrored the back panel's text; the back is left-aligned, so that drifted
// once the front gained its credential line.)
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
# The title is the topmost line on the front panel; its words share a baseline.
top = min(w[1] for w in front)
title = [w for w in front if abs(w[1] - top) < 5]
tc = (min(w[0] for w in title)/72 + max(w[2] for w in title)/72)/2
photos = [i["bbox"] for i in p.get_image_info() if (i["bbox"][0]+i["bbox"][2])/2/72 > W/2]
if not photos:
    raise SystemExit("no image on the front panel; check the cover by eye")
big = max(photos, key=lambda r: (r[2]-r[0])*(r[3]-r[1]))
pc = (big[0] + big[2])/2/72
if abs(tc - pc) > 0.05:
    raise SystemExit(f"title centre {tc:.3f} and photo centre {pc:.3f} disagree; check the cover by eye")
fc = pc
y0 = (H-10)/2
p.get_pixmap(dpi=200, clip=fitz.Rect((fc-3.5)*72, y0*72, (fc+3.5)*72, (y0+10)*72)).save(sys.argv[2])
print(f"front centre {fc:.4f} in from the photo; title agrees to {abs(tc-pc)*25.4:.2f} mm ({' '.join(w[4] for w in title)})")
`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cover-"));
const png = path.join(tmp, "front.png");
// Written to a file, not passed with -c: a JSON-quoted script keeps its \n
// escapes literal under /bin/sh and Python rejects it as a syntax error.
const script = path.join(tmp, "front.py");
fs.writeFileSync(script, py);
console.log(execSync(`python3 ${JSON.stringify(script)} ${JSON.stringify(src)} ${JSON.stringify(png)}`).toString().trim());
execSync(`sips -s format jpeg -s formatOptions 88 ${JSON.stringify(png)} --out public/images/rest-and-rise-cover.jpg`, { stdio: "ignore" });
console.log("wrote public/images/rest-and-rise-cover.jpg", fs.statSync("public/images/rest-and-rise-cover.jpg").size, "bytes");
