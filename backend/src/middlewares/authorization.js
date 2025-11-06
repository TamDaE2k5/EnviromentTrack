import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({path : '../.env'})

export const protectRoute = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(401).json({ mess: 'Không có token trong header!' })
    }

    // Cắt lấy token (Bearer <token>)
    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ mess: 'Token không hợp lệ!' })
    }

    // Xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ mess: 'Token hết hạn hoặc không hợp lệ!' })
      }

      // Lưu thông tin user vào req để dùng ở route sau
      req.user = user
      next() // Cho phép đi tiếp
    })
  } catch (error) {
    console.error('Lỗi xác thực token:', error)
    return res.status(500).json({ mess: 'Lỗi server khi xác thực token' })
  }
}
