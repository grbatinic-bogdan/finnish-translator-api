FROM node:10.15.3
WORKDIR /app

COPY package*.json ./
RUN npm install

# copy contents app contents
COPY . .

#RUN ls -la

# build javascript from typescript
RUN npm run build

EXPOSE 8000
CMD npm run start