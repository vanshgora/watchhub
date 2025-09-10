const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./dbconfig");
const { login, signup, getAllProducts, getUserCart, updateCart } = require("./controllers");
const authMiddleware = require("./middlewares");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express server is running!");
});

app.post("/login", login);
app.post("/signup", signup);
app.patch("/updateusercart", authMiddleware, updateCart);
app.get("/getproducts", authMiddleware, getAllProducts);
app.get("/getusercart", authMiddleware, getUserCart);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDB();
});
