import { client } from "../libs/connectDB.js";

export const session = async ()=>{
    try {
        const nameDB = 'enviTrack'
        await client.command({
            query:`CREATE TABLE IF NOT EXISTS ${nameDB}.sessions
            (
                sessionID UUID,
                nickName String,
                refreshToken String,
                createAt DateTime Default now(),
                expireAt DateTime
            )
            ENGINE = MergeTree()
            ORDER BY(nickName, expireAt)
            TTL expireAt DELETE;`
        })
        console.log('Đã khởi tạo bảng sessions trong enviTrack')
    } catch (error) {
        console.error('Xuất hiện lỗi', error)
    }
}