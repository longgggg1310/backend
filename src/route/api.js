const express = require('express');
const {userValidator, validate} = require('../middlewares/validator');

const routerAPI = express.Router();

const {postUpdateUserAPI} = require("../controller/apiController");

routerAPI.post('/users', userValidator, validate ,postUpdateUserAPI)


module.exports = routerAPI;
