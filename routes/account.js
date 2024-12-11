var express = require('express');
var router = express.Router();
var User = require("../models/user");
const jwt = require("jwt-simple");
const fs = require('fs');

const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

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

router.post("/addDevice", function (req, res){
    if (!req.headers["x-auth"]){
        return res.status(401).json({success: false, msg: "Missing X-Auth header"});
    }
    const token = req.headers["x-auth"];
    const newDevice = req.body.device;

    try {
        const decoded = jwt.decode(token, secret);

        User.findOneAndUpdate(
            {email: decoded.email},
            {$addToSet : {device: newDevice}},
            {new: true},
            (err, user) =>{
            if (err){
                res.status(400).json({success: false, message: "Error contacting DB. Please contact support."});
                return;
            }

            res.status(200).json({success: true, user: user});
            
        });
    }
    catch (ex){
        res.status(401).json({success: false, message: "Invalid JWT"});
    }
})

module.exports = router;