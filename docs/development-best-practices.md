# Development Best Practices

This document outlines best practices to prevent common linting and TypeScript errors before they reach CI/CD.

## Pre-Commit Hooks

### Setup Husky + lint-staged

Install dependencies:
```bash
pnpm add -D husky lint-staged
```

Initialize Husky:
```bash
npx husky init
pnpm exec husky set .husky/pre-commit "pnpm lint-staged"
```

Create `.lintstagedrc.json`:
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

This will:
- Run ESLint and fix auto-fixable issues before each commit
- Run Prettier to format code
- Prevent commits with linting errors

## IDE/Editor Configuration

### VS Code Settings

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.strictNullChecks": true,
  "typescript.preferences.noImplicitAny": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features (built-in)

## Manual Checks Before Committing

### Run Linting Locally
```bash
pnpm lint
```

### Run Type Checking
```bash
pnpm tsc --noEmit
```

### Run Full Build
```bash
pnpm build
```

**Best Practice**: Always run `pnpm build` locally before pushing to catch all errors that CI will find.

## Common Error Prevention Tips

### 1. Avoid `any` Types
- Always use explicit types
- Use `unknown` if the type is truly unknown, then narrow it
- Use type inference when possible
- Example:
  ```typescript
  // ❌ Bad
  let config: any;
  
  // ✅ Good
  let config: {
    provider_type: 'saml' | 'oidc';
    // ... rest of config
  };
  ```

### 2. Remove Unused Variables/Imports
- VS Code will gray out unused imports - remove them immediately
- Use ESLint rule: `@typescript-eslint/no-unused-vars`
- Configure to warn/error on unused variables

### 3. Escape HTML Entities in JSX
- Use `&apos;` instead of `'`
- Use `&quot;` instead of `"`
- Use `&amp;` instead of `&`
- Or use template literals: `` `${variable}'s text` ``

### 4. TypeScript Strict Mode
Already enabled in `tsconfig.json` ✅
- Keeps strict type checking
- Helps catch errors at compile time

## Enhanced ESLint Configuration

Consider adding stricter rules to `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "react/no-unescaped-entities": "error"
  }
}
```

## CI/CD Improvements

Ensure your CI pipeline runs:
1. `pnpm lint` - ESLint checks
2. `pnpm tsc --noEmit` - Type checking
3. `pnpm build` - Full production build (catches everything)

The GitHub Actions workflow should fail on any of these steps.

## Quick Reference: Pre-Push Checklist

Before pushing code:
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] No TypeScript errors in IDE
- [ ] No ESLint warnings/errors
- [ ] All tests pass (if you add tests)
- [ ] Code is formatted consistently

## Automatic Fixes

Many errors can be auto-fixed:
```bash
# Fix ESLint issues
pnpm lint --fix

# Format code with Prettier (if configured)
pnpm format
```
