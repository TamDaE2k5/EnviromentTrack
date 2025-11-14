from etl.transform import transformAQ, transformWeather
from utils.cities import CITIES
import smtplib
from email.message import EmailMessage

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')
PASS_CLICK_HOUSE=os.getenv('PASS_CLICK_HOUSE')

email_address = "Your gmail"
email_password = "Your password app"
smtp_server = "smtp.gmail.com"
smtp_port = 587

def evalAQ(pm25):
    if pm25 == -1:
        return "Không có dữ liệu!"
    if pm25 <= 12:
        return "Hãy ra ngoài hít thở không khí trong lành nào!"
    elif pm25 <= 35.4:
        return "Chất lượng không khí tạm ổn. Nếu bạn là người nhạy cảm với bụi thì nên chú ý!"
    elif pm25 <= 150.4:
        return "Nên nhớ đeo khẩu trang trước khi ra ngoài. Vì chỉ số không khí đang rất tệ!"
    elif pm25 <= 250.4:
        return "Nơi bạn đang sinh sống có chỉ số không khí cực tệ. Bạn không nên ra ngoài bây giờ!"
    else:
        return "Nơi này bị ô nhiễm không khí rất nặng. Cần chuyển nơi sinh sống gấp nếu muốn sống lâu hơn!"

def evalWeather(input):
    if input in ['Giông bão', 'Mưa phùn', 'Mưa', 'Bão táp']:
        return f'Nên hạn chế ra ngoài vì thời tiết đang là {input}. Nếu ra ngoài cần mang theo áo mưa/ô che chắn tránh bị cảm.'
    elif input == 'Tuyết rơi':
        return f'Nên mặc áo ấm trước khi ra ngoài.'
    elif input in ['Sương mù có bụi', 'Sương mù']:
        return f'Cẩn thận khi lái xe vào thời điểm hiện tại, có sương mù cản trở tầm nhìn!'
    elif input in ['Bụi', 'Khói bụi', 'Cát', 'Tro bụi']:
        return f'Hãy cẩn thận, hiện tại đang rất nhiều bụi hoặc bụi cát'
    elif input in ['Trong xanh', 'Mây', 'Gió']:
        return f'Thời tiết rất phù hợp cho một ngày tràn đầy năng lượng với vui chơi/làm việc!'


def sendMail():
    from clickhouse_connect import get_client
    client = get_client(
        host='clickhouse-server',
        port=8123,
        username='default',
        password=PASS_CLICK_HOUSE
    )

    data = client.query('''
        SELECT city, groupArray(email) AS emails
        FROM enviTrack.users
        GROUP BY city
        ORDER BY city
    ''')

    rows = [dict(zip(data.column_names, row)) for row in data.result_rows]
    
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(email_address, email_password)

        for row in rows:
            city = row['city']
            transDataWeather = transformWeather(CITIES[city])
            transDataAQ = transformAQ(CITIES[city])
            subject = 'Báo cáo về môi trường ngày hôm nay'
            body = f'''
Xin chào!

Dưới đây là thông tin về môi trường hiện tại ở {transDataWeather[0]} - {transDataWeather[1]}.
Hôm nay thời tiết {transDataWeather[2]}. Cụ thể là {transDataWeather[3]}, nhiệt độ hiện tại {transDataWeather[4]}°C.
{evalWeather(transDataWeather[2])}

Hãy lưu ý chỉ số không khí hiện tại là {evalAQ(transDataAQ[3])}. Cụ thể: {transDataAQ[2]}.
Vì vậy: {evalAQ(transDataAQ[3])}

Trân trọng!

Lưu ý: vui lòng Reply 'Đã nhận' để chúng tôi có thể nhận thức bạn đã nhận mail của chúng tôi 
'''
            for mail in row['emails']:
                mail=mail.strip()
                msg = EmailMessage()
                msg['Subject'] = subject
                msg['From'] = email_address
                msg['To'] = mail
                msg.set_content(body)
                server.send_message(msg)
                print(f"Email sent successfully to {mail}!")