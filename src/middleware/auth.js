const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        //estekhraje token as user
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "thisismynodejscourse");
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            error: "Please authenticate!"
        });
    }
}

//ataching the address of auth to export that's why we don't need paranteces
module.exports = auth;