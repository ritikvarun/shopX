import jwt from 'jsonwebtoken'


const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies
        console.log("isAuth middleware - token:", token ? "exists" : "missing")
        
        if(!token){
            return res.status(401).json({message:"User does not have token"})
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        if(!verifyToken){
            return res.status(401).json({message:"User does not have a valid token"})
        }
        req.userId = verifyToken.userId
        console.log("isAuth - userId set to:", req.userId)
        next()

    } catch (error) {
         console.log("isAuth error:", error.message)
    return res.status(500).json({message:`isAuth error ${error.message}`})
        
    }
}

export default isAuth