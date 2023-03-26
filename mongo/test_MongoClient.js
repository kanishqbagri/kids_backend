const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// Mongo Bulk import:
//mongoimport --host cluster0.imfkbzy.mongodb.net  --username app_admin --password otGeJXi2xYFyDhT7 --authenticationDatabase admin --db ooc --collection puzzles --file ./GotPuzzles.json --jsonArray


const url = 'mongodb+srv://app_admin:otGeJXi2xYFyDhT7@cluster0.imfkbzy.mongodb.net/kids?retryWrites=true&w=majority'; // Replace with your own MongoDB URL
// const url = 'mongodb://<username>:<password>@<hostname>:<port>/<database>'; // replace with your own values


const uri = "mongodb+srv://app_admin:otGeJXi2xYFyDhT7@cluster0.imfkbzy.mongodb.net/kids?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connect to the MongoDB database
client.connect(() => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to MongoDB database');
  }
});



// Use the body-parser middleware to parse the request body
app.use(bodyParser.json());

// Define a GET API endpoint to retrieve data from the MongoDB database
app.get('/api/puzzles', async (req, res) => {
  try {
    const collection = client.db().collection('puzzles');

    // Query the MongoDB collection for all restaurants
    const puzzles = await collection.find({}).toArray();

    // Return the puzzles as a JSON response
    res.json(puzzles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


app.post('/api/puzzles', async (req, res) => {
  try {
    const collection = client.db().collection('puzzles');

    // Extract the data from the request body
    const { Category, Question, Answer } = req.body;

    // Create a new document to insert into the collection
    const doc = {  _id: new ObjectId(), Category, Question, Answer };
    console.log("Iserted Document: ", doc);

    // Insert the document into the collection
    const result = await collection.insertOne(doc);
    console.log('Insert result:', result);

    if (result.insertedCount === 0) {
      throw new Error('Failed to insert document');
    }
    res.json(result.ops[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  finally{
    client.close();
  }
});


// Define a GET API endpoint to retrieve data from the MongoDB database
app.get('/api/restaurants', async (req, res) => {
  try {
    const collection = client.db().collection('restaurants');

    // Query the MongoDB collection for all restaurants
    const restaurants = await collection.find({}).toArray();

    // Return the restaurants as a JSON response
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }  finally{
    client.close();
  }
});


// Define a POST API endpoint to retrieve data from the MongoDB database
app.post('/api/restaurants', async (req, res) => {
  try {
    const collection = client.db().collection('restaurants');

    // Query the MongoDB collection for all restaurants
    const restaurants = await collection.find({}).toArray();

    // Return the restaurants as a JSON response
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});



// insert a document into a collection
app.post('/api/p', (req, res) => {
  const db = client.db('kids'); // replace with your own value
  const collection = db.collection("puzzles");

  collection.insertOne(req.body, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(result.ops[0]);
    }
    
  });
});

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
