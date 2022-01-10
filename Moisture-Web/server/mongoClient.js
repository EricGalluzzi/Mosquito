const {MongoClient} = require('mongodb');
require('dotenv').config({ path: __dirname + '/process.env' });
const uri = process.env.MONGO_URI;
// const mongoose = require('mongoose');

const client = new MongoClient(uri);
const dbName = 'MoistureWeb'

async function run(){ //connect to client
    await client.connect();
        // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection('MoistureWeb');
    return collection;
}
4




module.exports = {

async insertObj(obj){
    try {
        // Connect the client to the server
        collection = await run();
        obj['expirationSet'] = new Date();
        const insertDoc = await collection.insertOne(obj); //
    //     const insertResult = await collection.createIndex({
    //     "expirationSet": 1
    // },
    // {
    //     unique: true,
    //     sparse: true,
    //     expireAfterSeconds: 30
    // });
    console.log('Inserted documents =>', insertDoc);
          
  
  
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    

},

async retrieveObj(){
    
    try {
        collection = await run();
        
        
        
  
  
      } finally {
        // Ensures that the client will close when you finish/error
        retrieveDocs = await collection.find().toArray();
        await client.close();
        return retrieveDocs
        
        
        
        
      }
      
      
    
}
}



