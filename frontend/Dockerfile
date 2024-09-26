FROM node:20

WORKDIR /test_playground/frontend
COPY . .

RUN npm ci

# for k6
# RUN gpg -k && \
#     gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
# RUN echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list
# ------

RUN chown -R node:node /test_playground/frontend
RUN chsh -s /bin/bash node

ENV PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright/

RUN groupadd docker && \
usermod -aG docker node && \
npx playwright install --with-deps chromium

USER node