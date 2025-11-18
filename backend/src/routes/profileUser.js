import express from 'express'
import { profile, updateProfile } from '../controllers/profileUser.js'
const router = express.Router()
router.get('/profile', profile)
router.put('/profile', updateProfile)
export default router