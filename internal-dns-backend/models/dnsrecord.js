const mongoose = require("mongoose");


let DNSRecordSchema = new mongoose.Schema({
    record_type: String,
    subdomain_name: String,
    alias_name: {
        type: String,
        required: true
    },
    fqdn: String,
    last_change: {
        type: Date,
        default: Date.now()
    }    

});

module.exports = mongoose.model("DNSRecord", DNSRecordSchema);