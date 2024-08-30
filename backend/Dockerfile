FROM python:3.12.4-slim-bookworm

ARG USER_ID=1000
ARG GROUP_ID=1000
ARG BUILD_TYPE=production

WORKDIR /test_playground/backend
COPY ./requirements.txt .

RUN apt-get update && apt-get install -y libpq-dev && \
    pip3 install -r requirements.txt

RUN groupadd -g ${GROUP_ID} vscode && \
    useradd -u ${USER_ID} -g ${GROUP_ID} -m vscode

COPY . .

RUN chown -R vscode:vscode /test_playground/backend
RUN chsh -s /bin/bash vscode

RUN if [ "$BUILD_TYPE" = "development" ]; then \
    groupadd docker && \
    usermod -aG docker vscode; \
    fi

USER vscode

# EXPOSE 8000

# CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000 & celery -A backend worker --loglevel=info"]
# CMD ["python", "manage.py", "runserver","0.0.0.0:8000"]
# CMD ["python3", "-m", "http.server", "8000"]
