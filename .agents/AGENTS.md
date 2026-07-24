# General Guidelines

- **Always Push Live**: Since this is a live project connected to Vercel, ALWAYS push changes to the repository (`git add . && git commit -m "..." && git push`) after completing any significant feature or fix so that they are deployed live immediately. Do this without needing explicit user prompting.

<!-- - **Leverage fcc-claude for Heavy Logic**: When encountering heavy logic, complex algorithms, or refactoring, delegate tasks to `fcc-claude-mcp` to conserve primary agent token quotas, using the `mcp-call.js` wrapper. -->
- **Maintain LocalStorage Integrity**: Ensure all calendar and event state transformations are fully synced with `StorageService.js` to prevent state loss on page reloads.
- **Premium CSS Aesthetics**: Adhere strictly to the modern glassmorphism design tokens defined in `index.css`. Avoid hardcoded colors and use Tailwind only if explicitly requested.

- **Auto Proceed with Plans**: Automatically proceed to execution for all implementation plans without waiting for explicit user confirmation, unless there are major blocking questions.

