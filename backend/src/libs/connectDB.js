import { createClient } from '@clickhouse/client'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

const client = new createClient(
    {
        url: 'http://localhost:8123',
        username: 'default',
        password: process.env.PASS_CLICK_HOUSE,
    }
)

export  { client }