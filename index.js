const express = require('express')
const cors= require('cors')
const { MongoClient } = require('mongodb');
const app = express()
const port= process.env.PORT || 4000
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ou7jc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
     await client.connect();
      const database = client.db("online_shop");
      const productCollection = database.collection("products");
      const orderCollection = database.collection("orders");
     
   
        app.get('/products',async(req,res)=>{
          const cursor = productCollection.find({});
          const products = await cursor.toArray();
            res.json(products)
            
        })
        
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.json(result)
        });
        app.get('/orders',async(req,res)=>{
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
              res.json(order)
          })
          app.get('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const order = await orderCollection.findOne( { _id: id });
            res.json(order);
        })
          app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
          
               const quantity=parseInt(req.query.quantity);
                const result = await orderCollection.updateOne({ _id: id }, { $set:{ quantity: quantity }}, { upsert: true });
                if(result?.modifiedCount>0){
                  res.json(quantity);
                };
                
           
            
          })
          app.delete('/orders/:id', async (req, res) => {
            const _id = req.params.id;
            const result = await orderCollection.deleteOne({ _id: _id });
            res.json(result);
       
          })
        
       
       
      
     
    } 
    finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', function (req, res) {
    res.send('GET request to the homepage')
  })
  
  // POST method route
app.listen(port,()=>{
    console.log('running the server at port',port);
})