# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Inject Vite envs at build time from build-args
ARG VITE_PORTFOLIO_API_URL
ARG VITE_SSO_API_URL
ARG VITE_SSO_FRONTEND_URL
ENV VITE_PORTFOLIO_API_URL=${VITE_PORTFOLIO_API_URL}
ENV VITE_SSO_API_URL=${VITE_SSO_API_URL}
ENV VITE_SSO_FRONTEND_URL=${VITE_SSO_FRONTEND_URL}

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Don't cache the HTML shell
    location = /index.html {
        add_header Cache-Control "no-store, max-age=0";
    }

    # Cache static assets aggressively (Vite hashes filenames)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
