import bcrypt from 'bcrypt'
import { client } from '../libs/connectDB.js'
import { createSession, findSession, deleteSession } from '../libs/session.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { format } from 'morgan'

export const signUp = async (req, res)=>{
    try {
        // kiểm tra form có đầy đủ thông tin hay không
        const {name, nickName, pw, city, country, email} = req.body
        if(!name || !nickName || !pw || !city || !country || !email){
            return res.status(400).json({mess:'Vui lòng điền hết các thông tin!'})
        }
        // kiểm tra nickname/email có tồn tại chưa
        const checkUser = await client.query(
            {
                query: `SELECT * FROM enviTrack.users 
                    WHERE nickName = {nickName:String} OR email = {email:String}
                    LIMIT 1`,
                query_params:{
                    nickName, email
                },
                format:'JSONEachRow',
            }
        )
        const tmp = await checkUser.json()
        if(tmp.length>0){
            return res.status(409).json({mess:'Đã tồn tại email hoặc nickname'})
        }
        // mã hoá mật khẩu
        const hashPw = await bcrypt.hash(pw, 10)
        // tạo user mới
        await client.insert({
            table:'enviTrack.users',
            values:[
                {name, nickName, hashPw,city, country, email},
            ],
            format:'JSONEachRow',
        })
        // return
        return res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        console.error('Lỗi hệ thống ', error)
        return res.status(500).json({mess:'Server is error'})
    }
}

const ACCESS_TOKEN_TTL = '30m'
const REFRESH_TOKEN_TTL = 15*24*60*60*1000
export const logIn = async (req, res)=>{
    try {
        // lấy input
        const {nickName, pw} = req.body
        if(!nickName || !pw){
            return res.status(400).json({mess:'Thiếu thông tin!'})
        }
        // so sánh hashPw và pw, nickName và nickName
            // so sánh nickName
        const checkUser = await client.query({
            query:`SELECT * FROM enviTrack.users
                WHERE nickName = {nickName:String}`,
            query_params:{
                nickName
            },
            format:'JSONEachRow',
        })

        const result = await checkUser.json()
        if(result.length === 0){
            return res.status(404).json({mess:"Tên đăng nhập hoặc mật khẩu sai"})
        }

        const user = result[0]
        
            // so sánh mật khẩu
        const isUser = await bcrypt.compare(pw, user.hashPw)
        if(!isUser){
            return res.status(404).json({mess:'Tên đăng nhập hoặc mật khẩu sai'})
        }
        // tạo access token từ jwt
        const accessToken = jwt.sign(
            {nickName}, process.env.JWT_SECRET, {expiresIn:ACCESS_TOKEN_TTL}
        )
        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex')
        // lưu refresh token vao DB
        await createSession(nickName, refreshToken)
        // trả refresh token về cookie 
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        })
        // trả access token về cho respone
        return res.status(200).json({mess:`${nickName} đã đăng nhập thành công, accessToken = ${accessToken}`})
    } catch (error) {
        console.error('Lỗi hệ thống ', error)
        return res.status(500).json({mess:'Server is error'})
    }
}

export const logOut = async (req, res)=>{
    try {
        // lấy refreshToken từ cookie của client
        const token = req.cookies?.refreshToken
        // nếu tồn tại refreshToken -> lấy luôn sessionsID
        if(!token){
            console.log('Session không tồn tại.')
            return res.status(400).json({mess:'cookie không chứa refreshToken'})
        }
        // xoá session, cookie thông qua sessionID
        
        const sessionID = await findSession(token)
        if(sessionID){
            await deleteSession(sessionID)
            console.log(`Đã xoá sessionID: ${sessionID.sessionID}`)
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        })
        // return 204
        console.log(`Đã xoá session và cookie`)
        return res.status(204).send()
    } catch (error) {
        console.error('Error when delete session, cookie', error)
        return res.status(500).json({mess:'Error when delete session, cookie'})
    }
}