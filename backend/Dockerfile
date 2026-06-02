FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

COPY . .

EXPOSE 4000
CMD ["bun", "run", "src/index.ts"]
