const express = require("express");
//for uploading files to server
const multer = require("multer");
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    //creating REST API
    //Baraye tedade dastoorate ziad estefade az awaite behtaar ast nesbat be then
    try {
        await user.save();
        console.log(user);
        const token = await user.generateAuthToken();
        console.log(token);
        //201 is a created message
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});


// ******** Check the password comparison! Error while loging!!!!!!!!*************

router.post('/users/login', async (req, res) => {
    try {

        console.log(req.body.email, req.body.password);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log(user);
        const token = await user.generateAuthToken();
        console.log(token);
        res.send({ user, token });

    } catch (error) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
    req.user.tokens = [];
    await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/users', async (req, res) => {
    //{} means that return everithing. There is no filter
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        //500 = internal server error
        res.status(500).send();
    }
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/users/:id', async (req, res) => {
    //making sure that this operation is valid
    //send the keys.
    //returns an array
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid updates!"
        });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }

});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

//creates a folder called avatars
const upload = multer({
    dest: 'avatars'
});


//upload.single('avatar') : means that the key name of the file must be avatar
router.post('/users/me/avatar', upload.single('avatar'), (req, res)=>{    
    res.send();
});

module.exports = router;