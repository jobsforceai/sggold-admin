# Admin Frontend

Next.js admin dashboard for bullion assets.

## Key rules implemented

- No critical API keys in client components.
- All backend calls are in `actions/assets.ts` as server actions.
- UI consumes only server-resolved data.

## Run

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```
