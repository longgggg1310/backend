require('dotenv').config();

const express = require("express")
const apiRoutes = require('./route/api')
const mongoose = require('mongoose')
const {connection} = require('./config/database')
const app = express()
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/",apiRoutes)

;(async () => {
    try {
      await connection().then();
      app.listen(port, hostname, () => {
        console.log(`Example app listening on port ${port}`);
      })
    }
    catch (error) {
        console.log('hehe', error);
      }
  })()