import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from airflow import DAG
from datetime import datetime
from airflow.operators.python import PythonOperator

from utils.sendMail import sendMail
from etl.load import load

with DAG(
    dag_id='enviTrack',
    start_date=datetime(2025,10,22),
    schedule='* */6 * * *',
    tags=['project enviTrack'],
    catchup=False
) as dag:
    etl = PythonOperator(
        task_id = 'ETL',
        python_callable=load
    )
    send = PythonOperator(
        task_id = 'send_mail',
        python_callable=sendMail
    )

    etl>>send