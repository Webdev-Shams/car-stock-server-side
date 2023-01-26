const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.csb9mjt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        
        const carCollection = client.db('car-inventory').collection('cars');

        app.get('/cars', async(req,res) => {
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        
        });

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const car = await carCollection.findOne(query);
            res.send(car);
        })

        app.post('/car', async (req, res) => {
            const newService = req.body;
            const result = await carCollection.insertOne(newService);
            res.send(result);
        })

        app.delete('/car/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const erase = await carCollection.deleteOne(query);
            res.send(erase);
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateCar = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set : updateCar
            }
            const result = await carCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })       
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('Running!!!');
})

app.listen(port, () => {
    console.log('Listening Loud to port', port );
})