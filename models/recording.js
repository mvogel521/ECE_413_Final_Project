const db = require ("../db");

const recordingSchema = new db.Schema({
    temp1: String,
    temp2: String,
});

const Recording = db.model("Recording", recordingSchema);

module.exports = Recording;