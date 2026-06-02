FROM oven/bun:1

WORKDIR /app

COPY backend/package.json backend/bun.lock* backend/bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

COPY backend .

EXPOSE 4000
CMD ["bun", "run", "src/index.ts"]
