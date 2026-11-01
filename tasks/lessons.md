# Lessons

- **"Sitewide" copy sweeps must end with a zero-match verification grep.** The June 2026 "mama of three" update missed the homepage hero subhead ("Mama of Two", title-case with a literal `&` in JSX). Before claiming a sitewide text change is done, run `rg -in "<old phrase>"` (case-insensitive, `-a` for unicode-heavy files) across src/ and public/ and confirm zero hits.

- **Date-relative copy must be read against today's date before it goes out.** The Nov 1 2026 delay
  notice said the late-October ship date "is not going to make that" and "rather tell you now than let
  the date pass quietly", a day after the date had already passed. Templates that name a promised date
  must use wording that holds both before and after it ("I have to move that date"), and any one-off
  send gets a tense check against the calendar first.

