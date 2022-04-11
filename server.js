const express = require("express");
const bodyParser = require("body-parser");
const raw = require("body-parser/lib/types/raw");
const app = express();
var prompt = require('prompt-sync')();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://ferrari-leclerc:07v30vmwrZobzhISpokTLpb55Got8x6dvex0t0A2tFb5cABBobpAX2PoHl5rpPq61I9hPmbRYRAuBQshb8x4pQ==@ferrari-leclerc.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@ferrari-leclerc@'

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


//function to create the database and collection
function createDbC(){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("MyDatabase");
        dbo.createCollection("Customers", function(err, res) {
          if (err) throw err;
          console.log("Collection created!");
          db.close();
        });
    });
}

function populateDb(){
    var pops = [
        { name: 'John', address: 'Highway 71, New York'},
        { name: 'Peter', address: 'Lowstreet 4, San Francisco'},
        { name: 'Amy', address: 'Apple st 652, New York'},
        { name: 'Hannah', address: 'Mountain 21, Princeton'},
        { name: 'Michael', address: 'Valley 345, Princeton'},
        { name: 'Sandy', address: 'Ocean blvd 2, Texas'},
        { name: 'Betty', address: 'Green Grass 1, New York'},
        { name: 'Richard', address: 'Sky st 331, Texas'},
        { name: 'Susan', address: 'One way 98, Princeton'},
        { name: 'Vicky', address: 'Yellow Garden 2, San Francisco'},
        { name: 'Ben', address: 'Park Lane 38, Texas'},
        { name: 'William', address: 'Central st 954, Texas'},
        { name: 'Chuck', address: 'Main Road 989, Washington'},
        { name: 'Viola', address: 'Sideway 1633, San Francisco'}
      ]

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("MyDatabase");
        dbo.collection("Customers").insertMany(pops, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
          });
        });
}

//function to insert records from command line
function insertRec(){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db('MyDatabase');
        var name = prompt('Enter name : ');
        var add = prompt('Enter address : ');
        var myobj = { name: name, address: add }
        dbo.collection('Customers').insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("Record inserted");
          db.close();
        });
      });
}



// Search is implemented directly in post method
app.post("/",function(req,res){
    rawStr = req.body.rawStr;
    var s = rawStr.split(' '); // To search for records matching multiple words from the entered string in db
    s.forEach(convRegex) 
    console.log(s);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("MyDatabase");
        dbo
          .collection("Customers")
          .find({$or: [{name: {$in: s}},{address: {$in: s}}] }) //searches in both the fields for matches 
          .toArray(function (err, result) {
            if (err) throw err;
            console.log(result[0]);
            res.render('index.pug', {"rs":result});
            db.close();
          });
      });

});

// createDbC();
// populateDb();
// insertRec();
// insertRec();



//function for converting array of string to regex format
function convRegex(item, index, arr) {
    arr[index] = new RegExp(item);
}



app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});