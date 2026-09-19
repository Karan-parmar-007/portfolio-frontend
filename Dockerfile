FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ARG VITE_PORTFOLIO_API_URL=/api/portfolio
ARG VITE_APPS_API_URL=https://app.karanparmar.in/api/allprojects
ARG VITE_APPS_FRONTEND_URL=https://app.karanparmar.in
ARG VITE_SSO_API_URL=/api/auth
ARG VITE_SSO_FRONTEND_URL=https://auth.karanparmar.in
ENV VITE_PORTFOLIO_API_URL=${VITE_PORTFOLIO_API_URL}
ENV VITE_APPS_API_URL=${VITE_APPS_API_URL}
ENV VITE_APPS_FRONTEND_URL=${VITE_APPS_FRONTEND_URL}
ENV VITE_SSO_API_URL=${VITE_SSO_API_URL}
ENV VITE_SSO_FRONTEND_URL=${VITE_SSO_FRONTEND_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

LABEL org.opencontainers.image.source=https://github.com/Karan-parmar-007/portfolio-frontend
LABEL org.opencontainers.image.description="Portfolio frontend for karanparmar.in"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
