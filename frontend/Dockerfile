FROM node:20

WORKDIR /test_playground/frontend
COPY . .

RUN npm ci

RUN chown -R node:node /test_playground/frontend
RUN chsh -s /bin/bash node

ENV PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright/

RUN groupadd docker && \
usermod -aG docker node && \
npx playwright install --with-deps chromium

USER node