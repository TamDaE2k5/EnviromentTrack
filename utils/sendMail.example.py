def sendMail():
    from etl.extract import extractAQ, extractWeather
    from etl.transform import transformAQ, transformWeather
    from utils.cities import CITIES
    import smtplib
    from email.message import EmailMessage

    transDataWeather = transformWeather(CITIES['ha-noi'])
    transDataAQ = transformAQ(CITIES['ha-noi'])

    email_address = ""
    email_password = ""
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    msg = EmailMessage()

    subject = 'Báo cáo về môi trường ngày hôm nay'


    body = f'''
        Xin chào!

        Dưới đây là thông tin về môi trường hiện tại ở {transDataWeather[0]} - {transDataWeather[1]}.
        Hôm nay thời tiết {transDataWeather[2]}. Cụ thể là {transDataWeather[3]}, nhiệt độ hiện tại {transDataWeather[4]}°C.
        Hãy lưu ý chỉ số không khí hiện tại là {transDataAQ[3]}. Cụ thể: {transDataAQ[2]}.
        Vì vậy hãy đeo khẩu trang khi ra ngoài.

        Trân trọng!

        Lưu ý: đây là mail tự động vui lòng Reply 'Đã nhận' để chúng tôi có thể nhận thức bạn đã nhận mail của chúng tôi 
    '''

    # file_path = 'C:\\Users\\LENOVO\\Downloads\\Licenses.csv'
    # with open(file_path, 'rb') as f:
    #     file_data = f.read()
    #     import mimetypes
    #     mime_type, _ = mimetypes.guess_type(file_path)
    #     if mime_type is None:
    #         mime_type = 'application/octet-stream'
    #     main_type, sub_type = mime_type.split('/', 1)
        
    #     msg.add_attachment(file_data, maintype=main_type, subtype=sub_type, filename=file_path)

    address = [
            ]

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(email_address, email_password)
        # server.send_message(msg)
        for mail in address:
            msg = EmailMessage()  # tạo mới mỗi lần gửi
            msg['Subject'] = subject
            msg['From'] = email_address
            msg['To'] = mail
            msg.set_content(body)

            server.send_message(msg)
            print(f"Email sent successfully to {mail}!")