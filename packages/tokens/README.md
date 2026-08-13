# @shacdn/tokens

Design tokens for shacdn. Source of truth remains `src/styles/` in the repo; this package re-exports them for workspace / `file:` installs.

```scss
@use '@shacdn/tokens/variables.scss' as *;
```

```ts
import '@shacdn/tokens/theme-init';
import '@shacdn/tokens/globals.scss';
```

Copy into another app with `npm run shacdn:install -- /path/to/app` (writes `src/styles/` + `src/lib/cn.ts`).
