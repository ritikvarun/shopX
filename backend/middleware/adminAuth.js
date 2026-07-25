import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        let token = req.cookies?.token
        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1]
            } else {
                token = req.headers.authorization
            }
        }

        if(!token) {
            return res.status(401).json({message:"Not Authorized Login Again"})
        }
        
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        if(!verifyToken){
            return res.status(401).json({message:"Not Authorized Login Again, Invalid token"})
        }
        req.adminEmail = process.env.ADMIN_EMAIL

        next()
            
    } catch (error) {
        console.log("adminAuth error:", error.message)
        return res.status(401).json({message:`adminAuth error ${error.message}`})
    }
}

export default adminAuth