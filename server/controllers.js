const { getDb } = require("./dbconfig");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const db = getDb();

        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;

        console.log(req.body);

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            contact,
            password: hashedPassword
        };

        const db = getDb();

        const usersCollection = db.collection('users');

        await usersCollection.insertOne(newUser);

        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports =  { login, signup }