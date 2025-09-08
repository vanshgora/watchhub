const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./dbconfig");
const { login, signup } = require("./controllers");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express server is running!");
});

app.post("/login", login);
app.post("/signup", signup);
app.patch("/updateusercart", login);
app.get("/getproducts", login);
app.get("/getusercart", login);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDB();
});
