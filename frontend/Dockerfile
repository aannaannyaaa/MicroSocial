FROM node:20-alpine

WORKDIR /app

# Install Expo CLI
RUN npm install -g @expo/cli

COPY package*.json ./
RUN npm install

COPY . .

# Install EAS CLI for builds
RUN npm install -g eas-cli

EXPOSE 8081

# Start Expo dev server
# CMD ["sh", "-c", "npm expo start --host 0.0.0.0 --port 8081 --dev-client"]
CMD ["npm", "start"]
