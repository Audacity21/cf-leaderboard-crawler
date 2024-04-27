const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://2000031281cse:edllSKPcs0J49ArC@sample.x7pg0pj.mongodb.net/cfdata',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  });

// Define a GET endpoint to fetch all data from the 'dataset' collection
app.get('/api/data', async (req, res) => {
  try {
    // Fetch all documents from the 'dataset' collection
    const data = await User.find({});
    res.json(data); // Send the data as JSON response
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' }); // Send 500 status code on error
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('./cronjob'); // Start the cron job