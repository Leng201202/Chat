import jwt from 'jsonwebtoken';

export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'90day'
    })
    res.cookie("jwt",token,{
        maxAge:90*24*60*60*1000,
        httpOnly:true,
        sameSite:"none",
        secure: true
    })
    return token;
}