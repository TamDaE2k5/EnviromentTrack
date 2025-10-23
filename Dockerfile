FROM apache/airflow:2.10.2-python3.12

# Cài đặt các package hệ thống cần thiết và làm sạch cache ngay trong cùng một layer
USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends libpq-dev gcc \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Chuyển sang user airflow và cài đặt requirements
USER airflow
COPY --chown=airflow:0 requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt \
 && rm -f /tmp/requirements.txt