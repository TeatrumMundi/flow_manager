# Database Scripts

This folder contains standalone TypeScript scripts for database operations that run outside of the Next.js application.

## Environment Variable Loading

All scripts in this folder automatically load environment variables from `.env.local` using `dotenv-flow/config`. This includes:

- `DATABASE_URL` - Database connection string
- `AUTH_SECRET` - Authentication secret
- Any other environment variables defined in `.env.local`

## Available Scripts

### User Management

- `listUsers.ts` - List all users in the database
- `createUser.ts` - Interactive script to create new users
- `deleteUser.ts` - Interactive script to delete users

### Utilities

- `readDbURL.ts` - Display the current database URL

## Running Scripts

Use npm scripts to run these:

```bash
npm run db:listUsers    # List all users
npm run db:createUser   # Create a new user (interactive)
npm run db:deleteUser   # Delete a user (interactive)
npm run db:readDbURL    # Show database URL
```

## How Environment Variables Are Loaded

Each script includes `import "dotenv-flow/config";` at the top, which:

1. Automatically loads `.env.local` (highest priority)
2. Falls back to `.env` if `.env.local` doesn't exist
3. Supports environment-specific files like `.env.development.local`
4. Follows the standard dotenv priority order

## Why Scripts Are Excluded from Web Build

- The root project's `tsconfig.json` excludes this folder, so Next.js and the TypeScript compiler won't include or type-check these files in the website build.
- Keep scripts that are not part of the web app in this folder to prevent accidental bundling.

## Adding New Scripts

When creating new scripts in this folder:

1. Add `import "dotenv-flow/config";` as the first import
2. Use relative paths for internal imports (e.g., `../src/DataBase/schema`)
3. Add appropriate npm script in `package.json` under the `db:` namespace
4. Ensure your script checks for required environment variables before proceeding

Example template:

```typescript
import "dotenv-flow/config";
// ... other imports

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set!");
  process.exit(1);
}

// ... your script logic
```
