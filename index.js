const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();
const host = process.env.HOST;

const cors = require("cors");
const bodyParser = require("body-parser");


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://192.168.0.131:3000",
      "http://192.168.0.239:3000",
      "http://192.168.0.115:3000",
      "http://192.168.0.121:3000",
      "http://192.168.0.129:3000",
      "https://admin-atal-foundation.netlify.app",
      "https://atal-foundation.netlify.app",
      "http://82.29.167.130:3002",
      "http://82.29.167.130:3003"
    ],
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const connectDB = require('./app/dbConfig/dbConfig');
connectDB();


require("./app/routes")(app);
require("./app/routes/media")(app);

app.get("/", (req, res) => {

  return res.status(200).send({
    error: false,
    message: "Welcome to the Atal Foundation....",
  });
});

const port = process.env.PORT || 5050;


app.listen(port,  () =>
  console.log(`🚀 Server is Running at port:http://${host}:${port}`)
);

