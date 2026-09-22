# PRDS Core

**Public product surface** — Curated public clients, thin CLI/API client, public transport contracts, documentation, and demonstrable interface.

## Boundary

- **Visibility**: Public
- **No proprietary engine dependency** in browser/client artifacts or public builds
- Hosted records remain authenticated and entitled
- Consumes `@prds/types` and `@prds/ui` (public DTOs/components only)
- API calls authenticated via JWT + tier gate

## Architecture

```
prds-core/
├── apps/
│   ├── dashboard/          # Cloudflare Pages (React + Hono Functions)
│   │   └── src/            # ProspectsTable, DealPipeline, CommsInbox, Auth
│   └── api/                # Cloudflare Workers (Hono)
│       └── src/            # prospects, deals, jobs, keys, enrichment routes
├── wrangler.toml           # Bindings: Hyperdrive, KV, Queues, Analytics
└── seed.yaml
```

## Dependencies

- `@prds/types` (public DTOs) — build dependency
- `@prds/ui` (Radix/ShadCN components) — build dependency
- `prds-engine` via Workers API — authenticated API/RPC
- `prds-commerce` — entitlement checks (authenticated API/RPC)
- `prds-admin` — broker share verification (authenticated API/RPC)

## Deployment

- **Staging**: Auto on push to `main` (Cloudflare Pages preview + Workers)
- **Production**: Manual promotion (GitHub Environment approval)

## Local Development

```bash
wrangler dev --env staging
```

## Governance

- Lane: `evolve-platform` (platform consolidation)
- Owner: Platform team
- Seed: `seed.yaml` registered with ORGANVM/Limen