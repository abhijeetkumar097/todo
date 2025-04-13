const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MONGO_URL = 'mongodb://admin:password@mongodb:27017';
const DB_NAME = 'local';

app.use(cors());
app.use(express.json());

let db, todosCollection;

MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(DB_NAME);
    todosCollection = db.collection('todos');
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/todos', async (req, res) => {
  const todos = await todosCollection.find().toArray();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const result = await todosCollection.insertOne({ text });
    res.status(201).json({ _id: result.insertedId, text });
  } catch (err) {
    console.error("Error in POST /todos:", err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await todosCollection.updateOne({ _id: new ObjectId(id) }, { $set: { text } });
  const updated = await todosCollection.findOne({ _id: new ObjectId(id) });
  res.json(updated);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await todosCollection.deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true });
});
