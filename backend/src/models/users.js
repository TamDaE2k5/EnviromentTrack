import { client } from "../libs/connectDB.js";

export const user = async ()=>{
    try {
        const nameDB = 'enviTrack';
        await client.command({query:`CREATE DATABASE IF NOT EXISTS ${nameDB}`});
        await client.command({
            query: `CREATE TABLE IF NOT EXISTS ${nameDB}.users
            (
                name String,
                nickName String,
                hashPw String,
                city String,
                country String,
                email String
            )
            ENGINE = MergeTree()
            ORDER BY (email)
            `
        })
        console.log('Đã khởi tạo bảng users trong enviTrack');
        
    } catch (error) {
        console.error("lỗi khi khởi tạo! ",error);
    }
}