//Hosted on server that has access to the DNS server

const express = require('express'),
        app = express(),
        powershell = require('node-powershell'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        cors = require('cors');


app.use(cors());

//Mongoose init
mongoose.connect(`mongodb://localhost:27017/company-dns`, {
    keepAlive: true
});

//Models
const DNSRecord = require('./models/dnsrecord');
const log = require('./models/log');

//Listen for
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Create Powershell Shell
let powershellConsole = new powershell({
    executionPolicy: 'Bypass'
});

//Function that takes a Powershell command and passes the output to console log
const powershellCommand = (commandOrScript, parametersArr) => {
    powershellConsole.addCommand(commandOrScript,parametersArr);

    return (powershellConsole.invoke()
        .then((output) => output)
        .catch((err) => {
                return console.log(err)
        })
    )
}

//----------------------------------------------------------------ROUTES------------------------------------------------------------------------//
app.get('/', (req, res) => res.send("Hi!"));


//Index DNS Record
app.get('/api/v1/all', (req,res) => {
        DNSRecord.find((err, dnsrecords) => err? console.log(err): res.json(dnsrecords));
});


//Create DNS Record
app.post('/api/v1/addrecord', (req,res) => {
    //console.log(req.body);    
    DNSRecord.create({
            subdomain_name: req.body.subdomain_name,
            alias_name: req.body.alias_name
        },
    (err, addedrecord) => {
        if (err)
        {
            console.log(err);
        }
        else
        { 
            powershellCommand('./scripts/createRecord.ps1',
            [
                {name:"subdomain", value: req.body.subdomain_name},
                {name:"destination", value: req.body.alias_name}
            ])
            .then((stdOutput) => {
                res.json({
                    added: addedrecord,
                    console: stdOutput
                },)
                console.log(stdOutput);
                
            })
            .catch ((err) => {
                res.json(err);
                console.log(err);
            })
        }
    });
});

//Update DNS Record
app.put('/api/v1/updaterecord', (req,res) => {
    DNSRecord.findOneAndUpdate({
        subdomain_name: req.body.subdomain_name
    }, 
    req.body,
    (err, updatedRecord) => { 
        if (err){
            res.json(err)
    } 
        else{
            powershellCommand('./scripts/updateRecord.ps1',
            [
                {name:"subdomain", value: req.body.subdomain_name},
                {name:"destination", value: req.body.alias_name}
            ])
            .then((stdOutput) => {
                res.json({updated: `This record has been updated : ${updatedRecord}`})
                console.log(stdOutput);
            })
            .catch ((err) => {
                res.json(err);
                console.log(err);
            })
    }});
    
});

//Delete DNS Record
app.delete('/api/v1/deleterecord', (req,res) => {
    DNSRecord.findOneAndRemove(
        {
            subdomain_name: req.body.subdomain_name,
            alias_name: req.body.alias_name
        },
        (err, removedRecord) => {
            if(err)
            {
                res.json(err);
            }
            else{
                powershellCommand('./scripts/deleteRecord.ps1',
                [
                    {name:"subdomain", value: req.body.subdomain_name},
                    {name:"aliasToRemove", value: req.body.alias_name}
                ])
                .then((stdOutput) => {
                    res.json({removed: `This record has been removed : ${removedRecord}`})
                    console.log(stdOutput);
                })
                .catch ((err) => {
                    res.json(err);
                    console.log(err);
                })
            }
        })
});




app.listen(3001, process.env.ip, () => console.log("server has started!"));
