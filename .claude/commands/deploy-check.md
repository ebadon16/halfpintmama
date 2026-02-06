Run a full deploy readiness check:

1. Run `npm run build` and verify it passes with zero errors
2. Run `git status` to check for uncommitted changes
3. If there are changes:
   - Show a summary of what changed
   - Commit with a descriptive message
   - Push to origin/master
4. If working tree is clean, confirm "Nothing to deploy — already up to date."

Always verify the build passes BEFORE committing. Never push broken code.
