FROM node:20

ARG BUILD_TYPE=production

WORKDIR /test_playground/frontend
COPY . .

RUN chown -R node:node /test_playground/frontend

RUN chsh -s /bin/bash node

RUN if [ "$BUILD_TYPE" = "development" ]; then \
    groupadd docker && \
    usermod -aG docker node; \
    fi

USER node

RUN npm ci