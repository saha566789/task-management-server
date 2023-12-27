const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkenfit.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const taskCollection = client.db('taskDb').collection('addTask');
      

    app.get('/addTask/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await taskCollection.find(query).toArray()
      res.send(result)
  })
    app.post('/addTask', async (req, res) => {
        const newProduct = req.body;
        const result = await taskCollection.insertOne(newProduct);
        res.send(result);
    })
    app.delete('/addTask/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)
  })

  app.put('/addTask/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedTask = req.body;
      updatedTask.update = new Date();
      const task = {
          $set: {
              priority: updatedTask.priority,
              title: updatedTask.title,
              description: updatedTask.description,
              deadline: updatedTask.deadline,
              status: updatedTask.status,
              update: updatedTask.update
          }
      }
      const result = await taskCollection.updateOne(filter, task, options)
      res.send(result)

  })

  app.patch("/addTask", async (req, res) => {
    const id = req.query.id;
    const data = req.body;
    const query = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            status: data.status,
        },
    };
    const result = await taskCollection.updateOne(query, updatedDoc);
    res.send(result);
});


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('task is sitting')
  })
  
  app.listen(port, () => {
    console.log(`task is sitting on port ${port}`);
  })