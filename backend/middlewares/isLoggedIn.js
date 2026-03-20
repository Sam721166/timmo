import jwt from "jsonwebtoken"

const isLoggedIn = async (req, res, next) => {
    try {
        
        let token = req.cookies?.token
        
        if (!token) {
            // Try Authorization header (Bearer token)
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.slice(7) // Remove "Bearer " prefix
            }
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "You need to login first"
            })
        }
        
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data
        next()
    } catch (err) {
        console.log("error in isLogged in middleware: ", err);
        return res.status(401).json({
            success: false,
            msg: "Invalid token"
        })
    }
}

export {isLoggedIn}