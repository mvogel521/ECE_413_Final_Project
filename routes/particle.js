var express = require('express');
var router = express.Router();
var User = require("../models/user");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// Generate a random API Key
const API_KEY = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log(`Generated API Key: ${API_KEY}`); // Print the generated API Key on server startup

router.post('/report', (req, res) => {
    const { API_Key } = req.body; // Extract only the API_Key from the request body
    // Check if API Key is valid
    const isValidApiKey = API_Key === API_KEY;

    // Log the request body and validation result
    console.log('Received JSON:', JSON.stringify(req.body, null, 4));
    console.log('Validation Result:', isValidApiKey ? 'Success' : 'Failure');

    // Respond with the original JSON and validation result
    if (isValidApiKey) {
        res.status(200).json({
            message: 'Success!',
            received: req.body, // Echo back the full received JSON
        });
    } else {
        
        res.status(403).json({
            message: 'Failure: Invalid API Key',
            received: req.body, // Echo back the full received JSON
        });
    }
});

module.exports = router;