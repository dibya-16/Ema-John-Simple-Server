const express = require('express')
const bodyParser=require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guhkckm.mongodb.net/?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
//console.log(process.env.DB_USER);




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emajohnStore").collection("products");
        const orderCollection = client.db("emajohnStore").collection("orders");

        //console.log("database connected");
        //add new products or insert products
        app.post("/addProducts",async(req,res)=>{
            const product=req.body;
            //console.log("new product added",product);
            const result = await productCollection.insertOne(product)//insertMany()
           
            res.send(result);
        
            
          })
          //get products
         app.get('/products',async(req,res)=>{
        const query = {};
        const cursor = productCollection.find(query);//.find(query).limit(4) ebhabe just 4 tah dekhabo emn fix korte pari 
        const products = await cursor.toArray();
        res.send(products);
        
        })
        //get single product
        app.get("/products/:key",async(req,res)=>{
           
            const query = {key:req.params.key};
            const result = await productCollection.findOne(query);//or find(query).toArray();r tokhn single ektar jonno res.send(result[0]) hoto..
            res.send(result);
          })
          //product keys post
          app.post("/productsByKeys",async(req,res)=>{
            const productKeys=req.body;
            
            const result = await productCollection.find({key:{$in:productKeys}}).toArray();
           
            res.send(result);
        
            
          })
           //add new orders or insert orders
        app.post("/addOrder",async(req,res)=>{
            const order=req.body;
            //console.log("new product added",product);
            const result = await orderCollection.insertOne(order)//insertMany()
           
            res.send(result);
        
            
          })
    }
    
    finally {
      //await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port);