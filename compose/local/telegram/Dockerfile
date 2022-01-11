FROM python:3.9-slim-bullseye

WORKDIR /app

RUN pip install -U pip

COPY ./telegram/bot/requirements.txt .
RUN pip install -r requirements.txt

# Create an executable starting script
COPY ./compose/local/telegram/start /start
RUN chmod +x /start

COPY ./telegram .

WORKDIR /app/bot
