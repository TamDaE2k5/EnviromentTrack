import urllib.request

url = "https://airflow.apache.org/docs/apache-airflow/3.1.0/docker-compose.yaml"
urllib.request.urlretrieve(url, "docker-compose.yaml")
print("\33[32mĐã tải xong docker-compose.yaml\33[0m")
