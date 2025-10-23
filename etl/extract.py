import os
import requests
from dotenv import load_dotenv
from utils.cities import CITIES 
from airflow.decorators import task

load_dotenv(dotenv_path=".env")
TOKEN_API_WEATHER=os.getenv("TOKEN_API_WEATHER")
TOKEN_API_AQ=os.getenv("TOKEN_AIR_QUALITY")

# def handleApi():
#     curl = 'https://api.openweathermap.org/data/2.5/weather?q={city}&appid='
#     curl = f'https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}'

    # url = f"https://api.waqi.info/feed/{city}/?token={TOKEN_AIR_QUALITY}"
    # url_ll=f'https://api.waqi.info/feed/geo:{lat};{lon}/?token={your_token}'

def handleName(city, data):
    data['data']['city']['name'] = city['name']
    return None

def extractWeather(city):
    url = (
            f"https://api.openweathermap.org/data/2.5/weather?"
            f"lat={city['coord']['lat']}&lon={city['coord']['lon']}"
            f"&appid={TOKEN_API_WEATHER}"
        )
    try:
        res = requests.get(url, timeout=5)
        res.raise_for_status()
        data = res.json()
        data['name']=city['name']
        print(f'\033[33mĐã lấy dữ liệu thời tiết của {data['name']}\033[0m')
        return data
    except requests.exceptions.RequestException as e:
        print("\033[31mLỗi khi gọi API:\033[0m", e)
        return None

def extractAQ(city):
    url = f'https://api.waqi.info/feed/geo:\
        {city['coord']['lat']};{city['coord']['lon']}/?token={TOKEN_API_AQ}'
    try:
        res = requests.get(url, timeout=5)
        res.raise_for_status()
        data = res.json()
        handleName(city, data)
        print(f'\033[33mĐã lấy dữ liệu AQ của {data['data']['city']['name']}\033[0m')
        return data
    except requests.exceptions.RequestException as e:
        print("\033[31mLỗi khi gọi API:\033[0m", e)
        return None
    
def extract():
    weather = []
    aq = []
    for city in CITIES:
        weather.append(extractWeather(CITIES[city]))
        aq.append(extractAQ(CITIES[city]))
    return {
        "weather": weather,
        "aq": aq
    }

if __name__ == '__main__':
    # for city in CITIES:
    #     extractWeather(CITIES[city])
    #     extractAQ(CITIES[city])
    print(extractAQ(CITIES['london']))