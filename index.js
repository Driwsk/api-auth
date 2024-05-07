const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const db = require('./db');
const hashPassword = require('./midlleWare/hashPassword');
const  User = require('./models/User');
const { generateToken } = require("./midlleWare/authService");


app.use(express.json());

db.sync();

app.get("/", (req, res)=>{
    res.send("Hello Word!");
});

app.listen(port, () => {
    console.log(`app on http://localhost:${port}`);
});

app.post('/register', hashPassword, async (req, res) => {
    try {
        const user = await User.create({...req.body});
        res.send(user);
    } catch (error) {
        console.log(error);
    }
    
});


app.post('/login', async (req, res) => {
     const {email, password} = req.body;
     const user = await User.findOne({where: {email}});
     if (!user) {
           return res.status(401).send('Invalid email or password');
     }
     const passwordMatch = bcrypt.compareSync( password, user.password);
     if (!passwordMatch) {
           return res.status(401).send('Invalid email or password');
        }
        const token = generateToken(user.dataValues);
        delete user.dataValues.password;
        res.send({user, token});
})

