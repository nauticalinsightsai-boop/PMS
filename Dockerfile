# Marketing site (pmstructure.com) — Railway / Docker
# Set Railway Root Directory to repo root (empty), not frontend/.

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY dashboard/frontend/package.json ./dashboard/frontend/
COPY dashboard/backend/package.json ./dashboard/backend/
COPY packages/booking-crm/package.json ./packages/booking-crm/
COPY packages/regional-catalogue/package.json ./packages/regional-catalogue/
COPY packages/site-content/package.json ./packages/site-content/
COPY packages/ui/package.json ./packages/ui/
RUN npm ci --include=dev

FROM deps AS builder
ARG NEXT_PUBLIC_SITE_URL=https://pmstructure.com
ARG NEXT_PUBLIC_API_URL=https://pmstructure.com
ARG NEXT_PUBLIC_MARKETING_SITE_URL=https://pmstructure.com
ARG NEXT_PUBLIC_DASHBOARD_URL=https://pmstructure.com
ARG NEXT_PUBLIC_BASE_PATH=/admin
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MARKETING_SITE_URL=$NEXT_PUBLIC_MARKETING_SITE_URL
ENV NEXT_PUBLIC_DASHBOARD_URL=$NEXT_PUBLIC_DASHBOARD_URL
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
COPY . .
RUN node scripts/verify-marketing-build-env.mjs
RUN npm run build -w @pms/frontend

FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app/frontend

COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/frontend/package.json ./
COPY --from=builder /app/frontend/next.config.ts ./
COPY --from=builder /app/frontend/lib ./lib
# next.config.ts imports keyword SEO redirects from content/seo at runtime
COPY --from=builder /app/frontend/content ./content
COPY --from=builder /app/scripts /app/scripts
COPY --from=builder /app/dashboard ./dashboard
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/app/admin ./app/admin
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next

EXPOSE 3000
CMD ["npm", "run", "start"]
