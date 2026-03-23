FROM node:22-alpine AS base

# --- Dependencies stage ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# --- Build stage ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args become env vars at build time
ARG GOOGLE_CLOUD_PROJECT
ARG GOOGLE_CLOUD_LOCATION=us-central1

ENV GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT}
ENV GOOGLE_CLOUD_LOCATION=${GOOGLE_CLOUD_LOCATION}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- Runtime stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

# ADC is provided automatically by Cloud Run's service account.
# The @google/genai SDK with vertexai:true picks up credentials
# from the metadata server — no .env or key files needed.
#
# GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION are set via
# --set-env-vars in the deploy command.

CMD ["node", "server.js"]
