FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./

RUN npm i
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8000
CMD [ "node", "server.js" ]