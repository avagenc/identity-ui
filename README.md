# identity-ui

A small helper frontend for experimenting with the auth service — sign-in,
sign-up, and Google OAuth flows. Not a production app; it exists to try out and
validate authentication behavior.

## Stack

- SvelteKit (Svelte 5), adapter-node
- Supabase auth (`@supabase/ssr`)

## Run

```bash
bun install
bun run dev
```

Configure environment variables from `.env.example` first.
