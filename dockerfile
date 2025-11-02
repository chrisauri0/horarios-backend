# Imagen base ligera de Node + Alpine
FROM node:20-alpine

# Instala Python3 y pip
RUN apk add --no-cache python3 py3-pip

# Establece directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias Node
COPY package*.json ./
RUN npm install --omit=dev

# Copia dependencias Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del proyecto
COPY . .

# Puerto del backend
EXPOSE 3000

# Comando de arranque
CMD ["npm", "run", "start:prod"]
