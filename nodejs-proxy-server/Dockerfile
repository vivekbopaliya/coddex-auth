# ---- Build Stage ----
FROM --platform=linux/amd64 node:18 AS build

WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm install

COPY src/ src/
COPY tsconfig.json ./
RUN npm run build

# ---- Final Stage ----
FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/package.json ./
COPY --from=build /build/dist ./dist

# Debug: Check what we have
RUN ls -la dist/
RUN cat package.json
RUN which node
RUN node --version

# Try running the start command directly instead of npm
CMD ["node", "dist/server.js"]