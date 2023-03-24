const express = require('express');
const mainRoutes = express.Router();
 
const mainController = require('../controllers/mainController.js');
const auth = require('../middlewares/auth.js');

mainRoutes.get("/home", auth, mainController.home);
mainRoutes.get("/", auth,  mainController.home);
mainRoutes.get("/login",  mainController.login);
mainRoutes.post("/login",  mainController.loginUserAccount);
mainRoutes.post("/logout",  mainController.logoutUserAccount);

mainRoutes.post("/send_message",  auth,mainController.sendMessage);


module.exports = mainRoutes;