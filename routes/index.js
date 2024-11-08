var express = require('express');
var router = express.Router();


// Test Route
router.get('/', function(req, res, next){
    res.render('index', {title: "Home"});
});

module.exports = router;