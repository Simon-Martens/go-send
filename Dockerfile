# Build stage for frontend
FROM node:24-alpine AS frontend-builder

WORKDIR /build/views

COPY views/package*.json ./
RUN npm ci

COPY views/ ./
RUN npm run build

# Build stage for Go backend
FROM golang:1.24-alpine AS backend-builder

RUN apk add --no-cache gcc musl-dev sqlite-dev

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .
COPY --from=frontend-builder /build/views/dist ./views/dist

RUN CGO_ENABLED=1 go build -o send-server .

# Runtime stage
FROM alpine:latest

RUN apk add --no-cache ca-certificates sqlite-libs

WORKDIR /app

COPY --from=backend-builder /build/send-server .
COPY --from=frontend-builder /build/views/dist ./views/dist

RUN mkdir -p /app/data/uploads /app/userfrontend

EXPOSE 8080

CMD ["./send-server"]
