# Freezer Prep Checklist PDF

Source for `public/downloads/rest-and-rise-freezer-prep-checklist.pdf`.

To regenerate after editing `checklist.html`, render it to PDF with headless
Chrome (Letter, printBackground: true), e.g. via Playwright:

```js
await page.goto("file://.../checklist.html");
await page.pdf({ path: "public/downloads/rest-and-rise-freezer-prep-checklist.pdf", format: "Letter", printBackground: true });
```

Content mirrors the book's Chapter 11 session schedule and the Freezer
Inventory Checklist — keep them in sync if the book changes.
