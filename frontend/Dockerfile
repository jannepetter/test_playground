FROM node:20

ARG BUILD_TYPE=production

WORKDIR /test_playground/frontend
COPY . .

RUN npm ci

RUN chown -R node:node /test_playground/frontend
RUN chsh -s /bin/bash node

ENV PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright/

RUN if [ "$BUILD_TYPE" = "development" ]; then \
groupadd docker && \
usermod -aG docker node && \
npx playwright install --with-deps chromium; \
# usermod -aG docker node; \
fi

USER node