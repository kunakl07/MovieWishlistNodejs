const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddlewares = require("../middlewares/auth");

router.get('/login', authMiddlewares.chechSessionExists, userController.loginPage);

router.post('/login', userController.handleLogin);

router.get('/register', userController.registerPage);

router.post('/register', userController.handleRegister);

router.post('/logout', userController.logout);

module.exports = router;