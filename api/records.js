const loadJSONFromFile = require('./bootstrapData');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3100;
const mongoUrl = 'mongodb+srv://app_admin:otGeJXi2xYFyDhT7@cluster0.imfkbzy.mongodb.net/?retryWrites=true&w=majority'; // Replace with your own MongoDB URL
const collectionName = 'mycollection'; // Replace with your own collection name

// Define API endpoint to fetch records
app.get('/api/records', (req, res) => {
  MongoClient.connect(mongoUrl, (err, client) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error connecting to database');
    }
    const db = client.db();
    const collection = db.collection(collectionName);
    collection.find().toArray((err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error fetching records from database');
      }
      res.json(result);
    });
  });
});

 // Define API endpoint to fetch a specific record from document database
 app.get('/api/records/:id', function(req, res) {
    MongoClient.connect(mongoUrl, (err, client) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error connecting to database');
        }
        const db = client.db();
    const collection = db.collection(collectionName);
    const id = req.params.id;

    // Query the database to retrieve the record with the specified ID
    collection.findOne({ _id: ObjectId(id) }, function(err, doc) {
      assert.equal(null, err);
      res.send(doc);
    });
  });

 // Define API endpoint to insert a new record into document database
 app.post('/api/records', function(req, res) {
  const collection = db.collection('mycollection');
  const record = req.body;

  // Insert the new record into the database
  collection.insertOne(record, function(err, result) {
    assert.equal(null, err);
    res.send(result.ops[0]);
  });
});

// Define API endpoint to insert multiple records into document database
app.post('/api/records/bulk', function(req, res) {
  const collection = db.collection('mycollection');
  const records = req.body;

  // Insert the multiple records into the database
  collection.insertMany(records, function(err, result) {
    assert.equal(null, err);
    res.send(result.ops);
  });
});

// Define API endpoint to load JSON data from local file
app.get('/api/data', function(req, res) {
  const filePath = '../utils/GotPuzzles.json';

  // Load JSON data from file
  const jsonData = loadJSONFromFile(filePath);

  if (jsonData) {
    // Send JSON data in response
    res.send(jsonData);
  } else {
    // Send error response if there was an error loading JSON data
    res.status(500).send('Error loading JSON data from file');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

});
