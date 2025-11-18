import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from extract import extractAQ, extractWeather
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from utils.cities import CITIES
from utils.weatherStatus import STATUS
from airflow.decorators import task

def convertCelsius(Kelvin):
    # Cel = (Fahren - 32) * 5/9
    Cel = Kelvin - 273.15
    return round(Cel, 2)

def evalAQ(pm25):
    if pm25 == -1:
        return "Không có dữ liệu!"
    if pm25 <= 12:
        return "Tốt - ít tác động sức khỏe"
    elif pm25 <= 35.4:
        return "Trung bình - nhóm nhạy cảm chú ý"
    elif pm25 <= 55.4:
        return "Kém - nhóm nhạy cảm có thể bị ảnh hưởng"
    elif pm25 <= 150.4:
        return "Không lành mạnh - mọi người có thể bị ảnh hưởng"
    elif pm25 <= 250.4:
        return "Rất không lành mạnh - hạn chế ra ngoài"
    else:
        return "Nguy hại - hạn chế tối đa ra ngoài"

def roundTime(time, minutes=10):
    rounded_minute = (time.minute//minutes)*minutes
    return time.replace(minute=rounded_minute, second=0, microsecond=0)

def transformWeather(city):
    dataRaw = extractWeather(city)
    weather_id = int(dataRaw['weather'][0]['id'])
    now = datetime.now(ZoneInfo("Asia/Ho_Chi_Minh"))
    dataTrans = [
        str(dataRaw['name']),        # ('Thành phố', str(dataRaw['name'])),
        str(city['country']),        # ('Quốc gia', str(dataRaw['sys']['country'])),
        str(STATUS[weather_id]['name']),        # ('Trạng thái', str(STATUS[weather_id]['name'])),
        str(STATUS[weather_id]['description']),        # ('Mô tả', str(STATUS[weather_id]['description'])),
        convertCelsius(float(dataRaw['main']['temp'])),        # ('Nhiệt độ', convertCelsius(float(dataRaw['main']['temp']))),
        int(dataRaw.get('visibility', -1)),        # ('Tầm nhìn', int(dataRaw['visibility'])),
        float(dataRaw['wind']['speed']),        # ('Gió', float(dataRaw['wind']['speed'])),
        now.date(),        # ('Ngày', now.date().strftime("%Y-%m-%d")),
        now,        # ('Thời gian', now.time().strftime("%H:%M:%S")),
        roundTime(now)        # ('Catching', roundTime(now)) # .time().strftime("%H:%M:%S") => lam tron gio
    ]
    print(f'\033[36mĐã Transform dữ liệu thời tiết {dataTrans[0]}\033[0m')
    return dataTrans

def transformAQ(city):
    dataRaw = extractAQ(city)
    now = datetime.now(ZoneInfo("Asia/Ho_Chi_Minh"))
    dataTrans = [
        str(dataRaw['data']['city']['name']),        # ('Thành phố', str(dataRaw['data']['city']['name'])),
        str(city['country']),        # ('Quốc gia', str(city['country'])),
        evalAQ(int(dataRaw.get('data',{}).get('iaqi', {}).get('pm25', {}).get('v',-1))),   # ('Đánh giá chất lượng', evalAQ(int(dataRaw.get('data',{}).get('iaqi', {}).get('pm25', {}).get('v',-1)))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('pm25', {}).get('v',-1)),  # ('Chỉ số không khí', int(dataRaw.get('data',{}).get('iaqi', {}).get('pm25', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('pm10', {}).get('v',-1)),        # ('Nồng độ bụi(pm10)', int(dataRaw.get('data',{}).get('iaqi', {}).get('pm10', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('o3', {}).get('v',-1)), # ('Chỉ số Ozon', int(dataRaw.get('data',{}).get('iaqi', {}).get('o3', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('no2', {}).get('v',-1)), # ('Chỉ số NO2', int(dataRaw.get('data',{}).get('iaqi', {}).get('no2', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('co', {}).get('v',-1)),   # ('Chỉ số CO', int(dataRaw.get('data',{}).get('iaqi', {}).get('co', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('so2', {}).get('v',-1)), # ('Chỉ số SO2', int(dataRaw.get('data',{}).get('iaqi', {}).get('so2', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('p', {}).get('v',-1)),    # ('Áp suất khí quyển', int(dataRaw.get('data',{}).get('iaqi', {}).get('p', {}).get('v',-1))),
        int(dataRaw.get('data',{}).get('iaqi', {}).get('h', {}).get('v',-1)), # ('Độ ẩm', int(dataRaw.get('data',{}).get('iaqi', {}).get('h', {}).get('v',-1))),
        now.date(),  # ('Ngày', now.date().strftime("%Y-%m-%d")),
        now, # ('Thời gian', now.time().strftime("%H:%M:%S")),
        roundTime(now)    # ('Catching', roundTime(now))
    ]
    print(f'\033[36mĐã Transform dữ liệu AQ {dataTrans[0]}\033[0m')
    return dataTrans

def transform(weather, aq):
    transWeather = []
    transAQ = []
    for w, a, city in weather, aq, CITIES:
        transWeather.append(transformWeather(w))
        transAQ.append(transformAQ(a, CITIES[city]['country']))
    return {
        'transWeather':transWeather, 
        'transAQ':'transAQ'
    }

# if __name__ == '__main__':
    # for city in CITIES:
        # d1 = transformWeather(CITIES['bac-ninh'])
        # d2 = transformAQ(CITIES['bac-ninh'])
        # print(d1, d2)