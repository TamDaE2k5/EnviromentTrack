export const profile = async (req, res)=>{
    try {
        const user = req.user
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.error('Serrver is error', error)
    }
}