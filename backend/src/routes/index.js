const { Router } = require('express');
const router = Router();

const User = require('../model/User');

const jwt = require('jsonwebtoken');
const TOKEN_KEY = 'secretkey';

router.get('/', (req, res) => {
    res.send('Hello World')
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({email, password});
    await newUser.save();
    const token = jwt.sign({_id: newUser._id}, TOKEN_KEY);
    res.status(200).json({token});
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(401).send("The email dosen't exist");
    if(user.password !== password) return res.status(401).send("Wrong Password");
    const token = jwt.sign({_id: user._id}, TOKEN_KEY);
    res.status(200).json({token});
});

router.get('/tasks', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'task one',
            description: 'lorem ipsum',
            date: '2020-06-28T12:49:25.068Z'
        },
        {
            _id: 2,
            name: 'task two',
            description: 'lorem two sdfsdfsdf ghfgjhg mn',
            date: '2020-06-28T12:49:25.068Z'
        },
        {
            _id: 3,
            name: 'task three',
            description: 'lorem three sdfsdfsdf ghfgjhg mn',
            date: '2020-06-28T12:49:25.068Z'
        }
    ])
});

router.get('/private-tasks', verifyToken, (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'task one',
            description: 'lorem ipsum',
            date: '2020-06-28T12:49:25.068Z'
        },
        {
            _id: 2,
            name: 'task two',
            description: 'lorem two sdfsdfsdf ghfgjhg mn',
            date: '2020-06-28T12:49:25.068Z'
        },
        {
            _id: 3,
            name: 'task three',
            description: 'lorem three sdfsdfsdf ghfgjhg mn',
            date: '2020-06-28T12:49:25.068Z'
        }
    ])
});

async function verifyToken(req, res, next){
    
    if (!req.headers.authorization) {
        return res.status(401).send('Unauhtorized Request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauhtorized Request');
    }
    console.log(token);
    const payload = await jwt.verify(token, TOKEN_KEY);

    req.userId = payload.id;

    next();
}

module.exports = router;