import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateAccessTokens = async function (userId) {
    try {
        const user = await User.findByPk(userId)

        const accessToken = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {expiresIn: "1m"}
        )

        return { accessToken }
    
    } catch (error) {
        return resizeBy.json({status: false , message: "something went wrong while generating access token"})
    }
}

const generateRefreshTokens = async function (userId) {
    try {
        const user = await User.findByPk(userId)

        const refreshToken = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"}
        )

        return refreshToken
    
    } catch (error) {
        return resizeBy.json({status: false , message: "something went wrong while generating access token"})
    }
}

const register_user = async (req,res) => {
    try {
        const {name , email , password} = req.body

        const existedUser = await User.findOne({where: {email}})
        if (existedUser) {
            return res.json({status: false , message: "user already register with these email"})
        }

        const hashedPassword = await bcrypt.hash(password , 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.json({
            status: true,
            message: "user already registered",
            data: user
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const login = async (req ,res) => {
    try {
        
        const {email , password} = req.body

        const existedUser = await User.findOne({where: {email}})
        if (!existedUser) {
            return res.json({status: false , message: "user not found"})
        }

        const isPasswordValid = await bcrypt.compare(password , existedUser.password)
        if (!isPasswordValid) {
            return res.json({status: false , message: "password incorrect"})
        }

        const { accessToken } = await generateAccessTokens(existedUser.id)

        const loggedInUser = await User.findByPk(existedUser.id , {
            attributes: {exclude: ["password"]},
        })

        return res.json({
            status: true,
            message: "user loggedIn successfully",
            data: {
                token: accessToken,
                user: loggedInUser
            }
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const refresh_token =  async (req ,res) => {
    try {

        const {user_id} = req.body;

        if (user_id) {
            return res.json({status: false , message: "user id is required"})
        }

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "user not found"})
        }

        const refreshToken = await generateRefreshTokens(user.id)
        
        return res.json({
            status: true,
            message: "refresh token generated successfully",
            data: refreshToken
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    register_user,
    login,
    refresh_token
}