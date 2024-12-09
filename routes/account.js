var express = require('express');
var router = express.Router();
var User = require("../models/user");
const jwt = require("jwt-simple");

router.get("/status", function (req, res){
    if (!req.headers["x-auth"]){
        return res.status(401).json({success: false, msg: "Missing X-Auth header"});
    }
    const token = req.headers["x-auth"];

    try {
        const decoded = jwt.decode(token, secret);

        User.find({email: decoded.email}, "email lastAccess", function (err, user){
            if (err){
                res.status(400).json({success: false, message: "Error contacting DB. Please contact support."});
            }
            else {
                res.status(200).json(user);
            }
        });
    }
    catch (ex){
        res.status(401).json({success: false, message: "Invalid JWT"});
    }
})

module.exports = router;