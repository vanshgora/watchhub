const jwt = require("jsonwebtoken");
const { getDb } = require("./dbconfig");
const { ObjectId } = require('mongodb');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");

        const db = getDb();
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId )});


        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;