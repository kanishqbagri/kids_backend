const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3100;
const mongoUrl = 'mongodb+srv://app_admin:otGeJXi2xYFyDhT7@cluster0.imfkbzy.mongodb.net/?retryWrites=true&w=majority'; // Replace with your own MongoDB URL
const collectionName = 'mycollection'; // Replace with your own collection name


// Create a new route handler
const router = express.Router();

// Define the API endpoint
router.get('/gk', (req, res) => {
  // Extract query parameters
  const { category, difficulty } = req.query;

  // Construct the MongoDB query
  const query = {};
  if (category) {
    query.category = category;
  }
  if (difficulty) {
    query.difficulty = difficulty;
  }

  // Connect to MongoDB
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      res.status(500).json({ error: 'Failed to connect to database' });
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Execute the query and apply pagination
    const questionCount = parseInt(req.query.count) || 25; // Get the question count from the query parameters or default to 20
    const lastTwoBitsSum = parseInt(req.query.offset) || 0; // Get the lastTwoBitsSum from the query parameters or default to 0
    const startOffset = lastTwoBitsSum + 1;
    const startIndex = startOffset - 1;
    const endIndex = startIndex + questionCount;
    const pageNumber = parseInt(req.query.page) || 1;
    const skipCount = (pageNumber - 1) * questionCount;

    collection
      .find(query)
      .skip(startIndex)
      .limit(questionCount)
      .toArray((err, data) => {
        if (err) {
          console.error('Error executing MongoDB query:', err);
          res.status(500).json({ error: 'Failed to fetch data from database' });
          return;
        }

        res.json(data);
      });

    // Close the MongoDB connection
    client.close();
  });
});

// Register the router middleware
app.use('/api', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
