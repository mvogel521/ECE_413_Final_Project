var express = require('express');
var router = express.Router();
var Recording = require("../models/recording");
var User = require("../models/user");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// Generate a random API Key
const API_KEY = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log(`Generated API Key: ${API_KEY}`); // Print the generated API Key on server startup


router.post('/report', async (req, res) => {
    const { API_Key } = req.body; // Extract only the API_Key from the request body

    // Check if API Key is valid
    const isValidApiKey = API_Key === API_KEY;

    // Log the request body and validation result
    console.log('Received JSON:', JSON.stringify(req.body, null, 4));
    console.log('Validation Result:', isValidApiKey ? 'Success' : 'Failure');

    if (!isValidApiKey) {
        return res.status(403).json({
            message: 'Failure: Invalid API Key',
            received: req.body, // Echo back the full received JSON
        });
    }

    try {
        // Save the new record
        const newRecord = new Recording({
            userid: req.body.userid,
            temp1: req.body.temp1,
            temp2: req.body.temp2, // Assuming temp2 is correctly passed in req.body
        });

        await newRecord.save(); // Wait for the record to be saved
        console.log('Record info has been saved.');

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: 'Record saved and user updated successfully.',
            record: newRecord,
        });
    } catch (err) {
        // Catch and handle any errors
        console.error('Error processing the request:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request.',
            error: err.message,
        });
    }
});

router.get('/getRecordings', async (req, res) => {
    try {
        const records = await Recording.find();

        return res.status(200).json({
            success: true,
            records: records,
        });
    } catch (err) {
        console.error('Error processing the request:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request.',
            error: err.message,
        });
    }
});



module.exports = router;