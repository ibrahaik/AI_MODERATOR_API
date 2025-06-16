# Usa una imagen ligera de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto NestJS
RUN npm run build

# Define el comando para ejecutar la app al iniciar el contenedor
CMD ["node", "dist/main"]
