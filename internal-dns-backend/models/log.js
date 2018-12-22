const mongoose = require("mongoose");


let LogSchema = new mongoose.Schema({
    alias_name: String,
    user: String,
    fqdn: String,
    timestamp: {
        type: Date,
        default: Date.now()
    }    

});

module.exports = mongoose.model("Log", LogSchema);