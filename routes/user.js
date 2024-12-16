var express = require('express');
var router = express.Router();
var User = require("../models/user");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
var Particle = require('particle-api-js');
const fs = require('fs');


const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

router.post("/create", function (req, res){
    User.findOne({email: req.body.email}, function (err, user){
        if (err) {
            res.status(401).json({success: false, err: err});
            return;
        }
        else if (user){
            res.status(401).json({success: false, msg: "This email is already being used."});
            return;
        }
        else{
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            const newUser = new User({
                email: req.body.email,
                password: passwordHash,
                device: req.body.device
            });

            var particle = new Particle();
            var token;

            particle.login({username: req.body.email, password: passwordHash}).then(
            function(data) {
                token = data.body.access_token;
            },
            function (err) {
                console.log('Could not log in.', err);
            }
            );

            particle.claimDevice({ deviceId: req.body.device, auth: token }).then(function(data) {
                console.log('device claim data:', data);
              }, function(err) {
                console.log('device claim err:', err);
              });

            newUser.save(function (err, User){
                if (err){
                    res.status(400).send(err);
                }
                else{
                    let msg = "User info has been saved.";
                    res.status(201).json({success: true, message: msg});
                    console.log(msg);
                }
            })
        }
    })

})

router.post("/logIn", function (req,res){
    User.findOne({email: req.body.email}, function (err, user){

        if (err){
            res.status(400).send(err);
            return;
        }
        else if (!user){
            console.log("NOT USER")
            res.status(401).json({error: "Login failure!"});
            return;
        }
        else {
            const test = bcrypt.compareSync(req.body.password, user.password);

            if (bcrypt.compareSync(req.body.password, user.password)){

                const token = jwt.encode({email: user.email}, secret);
                
                user.lastAccess = new Date();

                user.save((err, user) => {
                    console.log("User's last access has been updated.");
                });
                res.status(201).json({success: true, token: token, msg: "Login success"});
            }
            else {
                res.status(401).json({success: false, msg: `Email or password invalid.`});
            }
        }
    })
})

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

        
        var particle = new Particle();
        var token1;
        
        particle.login({username: decoded.email, password: decoded.password}).then(
            function(data) {
                token1 = data.body.access_token;
            },
            function (err) {
                console.log('Could not log in.', err);
            }
            );

            particle.claimDevice({ deviceId: req.body.device, auth: token1 }).then(function(data) {
                console.log('device claim data:', data);
              }, function(err) {
                console.log('device claim err:', err);
              });
    }
    catch (ex){
        res.status(401).json({success: false, message: "Invalid JWT"});
    }
})

router.get("/getDevices", function (req, res){
    const token = req.headers["x-auth"];
    try {
        const decoded = jwt.decode(token, secret);

        User.find({email: decoded.email}, "email device", function (err, user){
            if (err){
                res.status(400).json({success: false, message: "Error contacting DB. Please contact support."});
            }
            else {
                res.status(200).json({msg: "success", user: user});
            }
        });
    }
    catch (ex){
        console.log(ex)
        res.status(401).json({success: false, message: "Invalid JWT"});
    }
})


module.exports = router;