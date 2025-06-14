const UserModel = require("../models/user");
const {StatusCodes, ReasonPhrases, getReasonPhrase} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});

        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(`${email} does not exist`);
        }

        const isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid password"});
        }

        const requestBody = {id: user._id, email: user.email};

        const token = jwt.sign(requestBody, config.JWT_SECRET, {expiresIn: config.EXPIRE_TIME});

        res.status(StatusCodes.OK).json({
            status: true,
            message: getReasonPhrase(StatusCodes.OK),
            token: token,
        });
    } catch (error) {
        next(error);
    }
};

const userRegister = async (req, res, next) => {
    const {email, password, first_name, last_name} = req.body;
    try {
        const userFound = await UserModel.findOne({email});

        if (userFound) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: `${email} Already Existed`});
        }

        const user = await UserModel.create(
            {
                first_name,
                last_name,
                password,
                email,
            }
        );

        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            msg: `User created ${getReasonPhrase(StatusCodes.OK)}`,
            user,
        });
    } catch (error) {
        console.log("SignUpError", error);
        next(error);
    }
};

module.exports = {
    userRegister,
    userLogin
}