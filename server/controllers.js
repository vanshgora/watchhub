const { getDb } = require("./dbconfig");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const db = getDb();
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "your_jwt_secret_key",
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};


const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const db = getDb();

        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            phone,
            password: hashedPassword
        };

        const userCreated = await usersCollection.insertOne(newUser);

        console.log(userCreated);

        await db.collection('usercart').insertOne({ userId: userCreated.insertedId, products: [] });

        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const db = getDb();
        const products = await db.collection("products").find({}).toArray();

        res.json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error while fetching products" });
    }
};

const getUserCart = async (req, res) => {
    try {
        const db = getDb();
        const userId = req.user._id;
        console.log(req.user)
        const userCart = await db.collection("usercart").findOne({ userId: userId });

        res.status(200).json({
            message: "User cart fetched successfully",
            userCart
        });
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.status(500).json({ message: "Server error while fetching user cart" });
    }
};

module.exports = { login, signup, getAllProducts, getUserCart }