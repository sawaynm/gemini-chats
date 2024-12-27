FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional OS packages if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-here>"

WORKDIR /workspace

# Install dependencies early to take advantage of Docker caching
COPY package*.json ./
RUN chown -R node:node /workspace

USER node
RUN npm install

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose port 3000 for Next.js development server
EXPOSE 3000
