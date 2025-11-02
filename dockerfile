# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de configuración primero (para aprovechar cache)
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias con pnpm
RUN pnpm install

# Copiar todo el código
COPY . .

# Compilar NestJS (genera dist/)
RUN pnpm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar Python (para tus scripts)
RUN apk add --no-cache python3 py3-pip

# Copiar dependencias y dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

# Si usas Python
COPY requirements.txt .
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

# Puerto (Render lo detecta automáticamente, pero por si acaso)
EXPOSE 3000

CMD ["node", "dist/main.js"]
