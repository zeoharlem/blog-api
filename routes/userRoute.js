const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/usersController');
const {userValidationMiddleware} = require("../middleware/validationMiddleware");


userRoute.post('/login', userController.userLogin);
userRoute.post('/register', userValidationMiddleware, userController.userRegister);

module.exports = userRoute;