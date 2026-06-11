# Lessons

- **"Sitewide" copy sweeps must end with a zero-match verification grep.** The June 2026 "mama of three" update missed the homepage hero subhead ("Mama of Two", title-case with a literal `&` in JSX). Before claiming a sitewide text change is done, run `rg -in "<old phrase>"` (case-insensitive, `-a` for unicode-heavy files) across src/ and public/ and confirm zero hits.
