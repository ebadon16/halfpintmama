// A CSS mock of one filled-in label sheet, shown on the delivery page. It
// exists so the phone view (where the PDF's fields render flat) shows what the
// finished product looks like, instead of an empty-looking form.

const SAMPLE: Array<[string, string, string]> = [
  ["Nesting Ziti", "Oct 14", "350°F, 45 min"],
  ["The House Chili", "Oct 14", "Stovetop, low"],
  ["Aloha Meatballs", "Oct 21", "Crockpot, 3 hr"],
  ["Sourdough English Muffins", "Oct 21", "Toast from frozen"],
  ["Honey Garlic Chicken", "Oct 28", "Instant Pot, 12 min"],
  ["Lactation Banana Bread", "Oct 28", "Thaw overnight"],
  ["Freezer Waffles", "Nov 4", "Toaster"],
  ["Weeknight Butter Chicken", "Nov 4", "Stovetop, low"],
  ["Overnight French Toast Bake", "Nov 11", "350°F, 40 min"],
  ["Italian Mini Quiches", "Nov 11", "350°F, 15 min"],
];

export function LabelSheetPreview() {
  return (
    <div
      className="bg-white rounded-lg shadow-xl border border-warm-beige p-[4%] aspect-[8.5/11] grid grid-cols-2 grid-rows-5 gap-x-[2%]"
      role="img"
      aria-label="Preview of a filled-in sheet of ten freezer labels"
    >
      {SAMPLE.map(([recipe, date, note]) => (
        <div key={recipe} className="p-[6%] flex flex-col justify-start min-w-0">
          <div className="flex items-baseline justify-between gap-2 border-b border-sage/60 pb-[2%] mb-[4%]">
            <span className="font-[family-name:var(--font-crimson)] font-semibold text-deep-sage text-[0.55rem] sm:text-[0.7rem]">
              Rest and Rise
            </span>
            <span className="text-charcoal/60 text-[0.4rem] sm:text-[0.5rem] truncate">
              from the freezer, with love
            </span>
          </div>
          <span className="text-charcoal/60 text-[0.35rem] sm:text-[0.45rem] uppercase tracking-wide">Recipe</span>
          <span className="font-[family-name:var(--font-crimson)] font-semibold text-charcoal text-[0.6rem] sm:text-[0.8rem] truncate">
            {recipe}
          </span>
          <div className="flex gap-3 mt-[3%] min-w-0">
            <div className="min-w-0">
              <span className="block text-charcoal/60 text-[0.35rem] sm:text-[0.45rem] uppercase tracking-wide">Made on</span>
              <span className="font-[family-name:var(--font-crimson)] text-charcoal text-[0.5rem] sm:text-[0.65rem]">{date}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-charcoal/60 text-[0.35rem] sm:text-[0.45rem] uppercase tracking-wide">Reheat</span>
              <span className="font-[family-name:var(--font-crimson)] text-charcoal text-[0.5rem] sm:text-[0.65rem] truncate">{note}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
