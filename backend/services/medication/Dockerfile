FROM python:3.11

WORKDIR /src

COPY ./requirements.txt /src/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt

COPY . /src/medication-service

CMD ["fastapi", "run", "medication-service/main.py", "--port", "8000", "--host", "0.0.0.0"]