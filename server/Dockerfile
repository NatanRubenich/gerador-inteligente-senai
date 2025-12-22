# Usar Node.js 20 LTS
FROM node:20-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src ./src

# Expor porta (Cloud Run usa a variável PORT)
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["node", "src/index.js"]
