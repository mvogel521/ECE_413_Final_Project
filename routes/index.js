const express = require('express');
var router = express.Router();


// Test Route
router.get('/', (req, res) =>{
    res.send('Hello World');
})

module.exports = router;