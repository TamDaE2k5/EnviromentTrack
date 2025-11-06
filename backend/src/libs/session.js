import { randomUUID } from 'crypto'
import { client } from './connectDB.js'
import { format } from 'path'

// create session
export const createSession = async(nickName, refreshToken, TTL = 15)=>{
    try {
        const sessionID = randomUUID()
        const createAt = new Date()
        const expireAt = new Date(Date.now() + TTL*24*60*60*1000)
        // kiem tra co con session cu ko
        const checkSession = await client.query(
            {
                query:`SELECT * FROM enviTrack.sessions
                    WHERE nickName = {nickName:String}`,
                query_params:{nickName},
                format:'JSONEachRow',
            }
        )
        const tmp = await checkSession.json()
        if(tmp.length>0){
            await client.command(
                {
                    query:`ALTER TABLE enviTrack.sessions
                        DELETE WHERE nickName = {nickName:String}`,
                    query_params:{nickName},
                    format:'JSONEachRow',
                }
            )
        }
        await client.insert({
            table: 'enviTrack.sessions',
            values:[
                {
                    sessionID,
                    nickName,
                    refreshToken,
                    createAt: createAt.toISOString().replace('T', ' ').split('.')[0],
                    expireAt: expireAt.toISOString().replace('T', ' ').split('.')[0],
                },
            ],
            format:'JSONEachRow',
        })
        console.log(`Đã tạo session cho ${nickName}`)
        return {sessionID, expireAt}
    } catch (error) {
        console.error('Đã xảy ra lỗi', error)
    }   
}

export const findSession = async(refreshToken)=>{
    try {
        const checkSession = await client.query(
        {
            query:`SELECT * FROM enviTrack.sessions
                WHERE refreshToken = {refreshToken:String}
                LIMIT 1`,
            query_params:{refreshToken},
            format:'JSONEachRow',
        }
        )

        const result = await checkSession.json()
        if(result.length>0){
            console.log(`Đã tìm được sessionID cho ${result[0].nickName}`)
            return result[0]
        }   
        else{
            console.log(`Session not found for ${refreshToken}`)
            return null
        }
    } catch (error) {
        console.error(`Error: `, error)        
    }
}

export const deleteSession = async(sessionID)=>{
    try {
        await client.command(
            {
                query:`ALTER TABLE enviTrack.sessions
                    DELETE WHERE sessionID = {sessionID:UUID}`,
                query_params:{sessionID: sessionID.sessionID},
                format:'JSONEachRow'
            }
        )
        console.log(`Đã xóa session ${sessionID.sessionID}`)
    } catch (error) {
        console.error('Error', error)
    }
}