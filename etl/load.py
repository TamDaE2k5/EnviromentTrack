import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from transform import transformAQ, transformWeather
from utils.cities import CITIES
from clickhouse_connect import get_client
from airflow.decorators import task

from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')
PASS_CLICK_HOUSE=os.getenv('PASS_CLICK_HOUSE')

def loadWeather(data):
    client = get_client(
        host='clickhouse-server',
        port=8123,
        username='default',
        password=PASS_CLICK_HOUSE
    )

    client.command('CREATE DATABASE IF NOT EXISTS enviTrack')
    client.command('USE enviTrack')
    client.command('''
        CREATE TABLE IF NOT EXISTS Weather (
            `Thành phố` String,
            `Quốc gia` String,
            `Trạng thái` String,
            `Mô tả` String,
            `Nhiệt độ` Float32,
            `Tầm nhìn` Int32,
            `Gió` Float32,
            `Ngày` Date,
            `Thời gian` DateTime,
            `Catching` DateTime
    ) ENGINE = MergeTree()
    ORDER BY (`Thành phố`,`Ngày`, `Catching`)
    ''')
    columnName = ["Thành phố", "Quốc gia", "Trạng thái", "Mô tả", "Nhiệt độ",
                  "Tầm nhìn", "Gió", "Ngày", "Thời gian", "Catching"]
    client.insert('Weather', data, column_names=columnName)

    print(f'\033[32mLoad dữ liệu thời tiết thành công\33[0m')
    return None

def loadAQ(data):
    client = get_client(
        host='clickhouse-server',
        port=8123,
        username='default',
        password=PASS_CLICK_HOUSE
    )

    # Load
    client.command('CREATE DATABASE IF NOT EXISTS enviTrack')
    client.command('USE enviTrack')
    client.command('''
        CREATE TABLE IF NOT EXISTS AQ (
            `Thành phố` String,
            `Quốc gia` String,
            `Đánh giá chất lượng` String,
            `Chỉ số không khí` Int32,
            `Nồng độ bụi(pm10)` Int32,
            `Chỉ số Ozon` Int32,
            `Chỉ số NO2` Int32,
            `Chỉ số CO` Int32,
            `Chỉ số SO2` Int32,
            `Áp suất khí quyển` Int32,
            `Độ ẩm` Int32,
            `Ngày` Date,
            `Thời gian` DateTime,
            `Catching` DateTime
    ) ENGINE = MergeTree()
    ORDER BY (`Thành phố`, `Ngày`, `Catching`)
    ''')

    columnName = [ 'Thành phố', 'Quốc gia','Đánh giá chất lượng','Chỉ số không khí',
                  'Nồng độ bụi(pm10)','Chỉ số Ozon','Chỉ số NO2','Chỉ số CO','Chỉ số SO2',
                  'Áp suất khí quyển','Độ ẩm','Ngày','Thời gian','Catching']

    client.insert('AQ', data, column_names=columnName)
    print(f'\033[32mLoad dữ liệu AQ thành công\33[0m')
    return None

def load():
    dtAQ = []
    dtWeather = []
    for city in CITIES:
        dtAQ.append(transformAQ(CITIES[city]))
        dtWeather.append(transformWeather(CITIES[city]))
    loadWeather(dtWeather)
    loadAQ(dtAQ)
    return None

# if __name__ == '__main__':
#     for city in CITIES:
#         loadWeather(CITIES[city])
#         loadAQ(CITIES[city])
