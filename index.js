const express = require("express");
const app = express();

require("dotenv").config();
const host = process.env.HOST;

const cors = require("cors");
const bodyParser = require("body-parser");


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const connectDB = require('./app/dbConfig/dbConfig');
connectDB();



require("./app/routes")(app);

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

