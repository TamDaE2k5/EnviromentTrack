from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def helloAirflow():
    print(f'\33[32mHello Apache Airflow!!\33[0m')
    return None

def printTime():
    time = datetime.now().strftime("%d-%m-%Y %S:%M:%H")
    print(time)
    return None

with DAG(
    dag_id='myFirstDag',
    start_date=datetime(2025,10,22),
    schedule='*/1 * * * *',
    tags=['First Dag'],
) as dag:
    firstTask = PythonOperator(
        task_id = 'Hello',
        python_callable=helloAirflow
    )

    secondTask = PythonOperator(
        task_id = 'time',
        python_callable=printTime
    )

    firstTask>>secondTask