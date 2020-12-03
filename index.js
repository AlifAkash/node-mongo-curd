const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID

const password = "NSba9ZHi5TB5HKQe";

const uri = "mongodb+srv://organicUser:NSba9ZHi5TB5HKQe@cluster0.bm8ip.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
            console.log(err);
        })
    })

    app.get("/product/:id", (req, res) => {
        productCollection.find({_id : ObjectID(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log("product added successfully");
            res.redirect("/");
        })
    })

    app.patch("/update/:id", (req, res) => {
        productCollection.updateOne({_id : ObjectID(req.params.id)}, {
            $set : {price : req.body.price, quantity : req.body.quantity}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    app.delete("/delete/:id", (req, res) => {
        productCollection.deleteOne({_id : ObjectID(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })

});


app.listen(3000);