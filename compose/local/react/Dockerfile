FROM node:16

WORKDIR /app

COPY ./dashboard/package.json ./package.json
COPY ./client/package.json ./client/package.json

# Change permissions for node_modules
RUN mkdir -p /app/node_modules/.cache
RUN chown node /app/node_modules/.cache

# Install both prod and dev dependencies
RUN npm install --force && npm cache clean --force

# Link 2 modules together in development (synchronize changes)
RUN cd /app/client && npm link && cd /app && npm link redirink-node-client

COPY ./dashboard .
COPY ./client ./client

ENV PATH ./node_modules/.bin/:$PATH


# Transfer build script
COPY ./compose/local/react/build.sh /build.sh
RUN chmod +x /build.sh
