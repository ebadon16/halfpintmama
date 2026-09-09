# Freezer Prep Checklist PDF

Source for `public/downloads/rest-and-rise-checklist-2a418ce2.pdf`, the free
download on `/checklist` (the URL printed in the book). The hashed filename keeps
the raw file out of search; the page itself is the front door.

To regenerate after editing `checklist.html`, render it with headless Chrome
(Letter, printBackground, preferCSSPageSize):

```
node ~/.research/_hpm_checklist_pdf.mjs "$PWD/scripts/checklist-pdf/checklist.html" public/downloads/rest-and-rise-checklist-2a418ce2.pdf
```

Then refresh the page-1 preview: `qlmanage -t -s 1200 -o . <pdf>` and
`sips -Z 900` it into `public/images/freezer-prep-checklist-preview.png`.

Content mirrors the book's Chapter 11 session schedule and the Freezer
Inventory Checklist. Keep them in sync if the book changes.
