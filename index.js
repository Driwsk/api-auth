const express = require("express");
const app = express();
const port = 3000;
const db = require('./db')
const bcrypt = require('bcrypt')
const  User = require('./models/User');

app.use(express.json());

db.sync();

app.get("/", (req, res)=>{
    res.send("Hello Word!");
});

app.listen(port, () => {
    console.log(`app on http://localhost:${port}`);
});

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    res.send(user);
});
