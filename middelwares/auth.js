import jwt from 'jsonwebtoken';
 

export const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            status: "fail",
            message: "you are not logged in"
        })
    }

    try {
        let decoded = jwt.verify(authorization, process.env.SECRET)
        req.id = decoded.id
        req.role = decoded.role
        next()
    }
    catch (err) {
        return res.status(401).json({
            status: "fail",
            message: "you are not authentication"
        })
    }

}

export const restrectTo = (...roles) =>{
    return (req, res, next) =>{
        if (!roles.contains(req.role)){
            return res.status(403).json({
                status: "fail",
                message: "you are not authorized to perform this action"
            });
        }else{
            next()
        }
    }
}
