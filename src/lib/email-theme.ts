// Brand colors for transactional email HTML, which cannot use CSS variables.
// Every value clears WCAG AA 4.5:1 for the text placed on it (ratio per entry).
// Single source of truth shared by the comment notifications and the shop.
export const EMAIL = {
  terracottaFrom: "#A0562F", // white on it: 5.43
  terracottaTo: "#8A4A2E",   // white on it: 6.78
  sageFrom: "#5C6B52",       // white on it: 5.71
  sageTo: "#4A5845",         // white on it: 7.57
  cream: "#F5F1E8",
  border: "#E6DFD3",
  text: "#3A3A38",           // on cream: 10.11
  muted: "#5F5F5B",          // on cream: 5.69
  footer: "#6B6B66",         // on white: 5.36
  accent: "#4A5845",         // decorative left border
  link: "#A0562F",           // on cream: 5.0
} as const;
