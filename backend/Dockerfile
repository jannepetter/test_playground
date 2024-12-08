FROM python:3.12.4-slim-bookworm

ARG USER_ID=1000
ARG GROUP_ID=1000

ENV DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE}

WORKDIR /test_playground/backend
COPY ./requirements.txt .

RUN apt-get update && apt-get install -y libpq-dev --no-install-recommends && \
    pip3 install -r requirements.txt --no-cache-dir

RUN groupadd -g ${GROUP_ID} vscode && \
    useradd -u ${USER_ID} -g ${GROUP_ID} -m vscode

COPY . .

RUN chown -R vscode:vscode /test_playground/backend
RUN chsh -s /bin/bash vscode

RUN groupadd docker && \
    usermod -aG docker vscode

USER vscode

ENTRYPOINT [ "./entry.sh" ]
CMD ["python", "manage.py", "runserver" , "0.0.0.0:8000"]

# CMD ["python3", "-m", "http.server", "8000"]
