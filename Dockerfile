FROM python:3.10

WORKDIR /app

COPY api/requirements.txt .

RUN pip install -r /app/requirements.txt

RUN pip install psycopg2-binary

RUN pip install resend==0.8.0

COPY . .

CMD [ "python", "api/app.py" ]