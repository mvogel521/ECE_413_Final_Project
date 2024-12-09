var express = require('express');
var router = express.Router();
var User = require("../models/user");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
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

module.exports = router;