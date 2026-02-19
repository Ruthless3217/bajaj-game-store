# Build and serve all games from Angular Shell assets
# No need to serve games independently - they're included in the Shell build

FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY scripts scripts/

# Copy all projects
COPY angular-shell angular-shell/
COPY Scramble-Words Scramble-Words/
COPY life-goals life-goals/
COPY quiz-game quiz-game/

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Build everything (games + shell)
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built Shell (which includes all games)
COPY --from=builder /app/angular-shell/dist/gamification /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
