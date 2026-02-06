Do a comprehensive scan of the entire Half Pint Mama codebase looking for issues across these categories:

1. **Security**: XSS, injection, open redirects, missing validation, secrets in code, unsafe patterns
2. **SEO**: Missing metadata, missing canonical URLs, missing OG tags, missing structured data, broken sitemap/robots
3. **Error Handling**: Unhandled promises, missing try-catch, unsafe JSON.parse, missing error boundaries
4. **Performance**: Missing image optimization (unoptimized prop, missing sizes), unused imports, large bundles
5. **Accessibility**: Missing aria-labels, missing alt text, missing form labels, focus management issues
6. **Best Practices**: Console.log/error in client code, hardcoded values that should be env vars, TypeScript errors, missing type safety

Check EVERY file in src/app, src/components, src/lib, src/sanity. Report findings as a numbered list with:
- File path + line number
- Severity (Critical / High / Medium / Low)
- Description of the issue
- Suggested fix

Only report REAL actionable issues, not style preferences. If everything is clean, say so.
