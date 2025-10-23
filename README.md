Các bước chạy:
### Bật môi trường ảo
'.\Scripts\activate'
### Tải thư viện của python về
'pip install -r requirements.txt'
### Tạo Image: làm cho container chứa các thư viện cần dùng cho project
'docker-compose build --no-cache'
### Chạy các container về chuẩn bị cho dự án
'docker compose up -d' -> chạy container sau đó ẩn