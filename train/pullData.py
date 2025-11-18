import csv
from clickhouse_connect import get_client
client = get_client(
    host='localhost',
    port=8123,
    username='default',
    password='Nghiemtam05@'
)

result = client.query("SELECT * FROM enviTrack.AQ")

with open("AQ_raw.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    # Ghi header
    writer.writerow(result.column_names)

    # Ghi dữ liệu
    writer.writerows(result.result_rows)

print("✔ Xuất CSV thành công!")