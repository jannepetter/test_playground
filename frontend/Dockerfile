FROM node:20

WORKDIR /test_playground/frontend

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN chsh -s /bin/bash node


RUN groupadd docker && \
usermod -aG docker node

USER node