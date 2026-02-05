const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const htmlEscapeRegex = /[&<>"']/g;

export function escapeHtml(str: string): string {
  return str.replace(htmlEscapeRegex, (char) => htmlEscapes[char]);
}
