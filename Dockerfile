FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG PUBLIC_PATH
ARG STYLE_NONCE
ARG VERSION
ARG GIT_COMMIT
ARG MODULE_NAME

ENV PUBLIC_PATH=${PUBLIC_PATH}
ENV STYLE_NONCE=${STYLE_NONCE}
ENV VERSION=${VERSION}
ENV GIT_COMMIT=${GIT_COMMIT}
ENV MODULE_NAME=${MODULE_NAME}

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=builder /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/locations.conf /etc/nginx/conf.d/locations.conf

RUN mkdir -p /var/cache/nginx /var/cache/nginx/client_temp /var/run/nginx \
    && chown -R nginx:nginx /usr/share/nginx /var/cache/nginx /var/run/nginx

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]