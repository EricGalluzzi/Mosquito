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

async function getLastDocumentId(collection){
  documentArray = await collection.find().toArray();
  return (typeof documentArray[documentArray.length - 1] == "undefined") ? -1 : documentArray[documentArray.length - 1]._id;
}





module.exports = {

// async insertObj(obj){
//     try {
//         // Connect the client to the server
//         collection = await run();
        
        
//     //     const insertResult = await collection.createIndex({
//     //     "expirationSet": 1
//     // },
//     // {
//     //     unique: true,
//     //     sparse: true,
//     //     expireAfterSeconds: 604800
//     // });
//     const insertDoc = await collection.insertOne({
//       'entry': [obj],
//       'expirationSet' : new Date(),
//       "dateInterval" : (new Date()).toString().substring(0, 10)

//     }); //
//     console.log('Inserted documents =>', insertDoc);
          
  
  
//       } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//       }
    

// },

async retrieveObj(){ //retrieve entries
    
    try {
        collection = await run();

  
      } finally {
        // Ensures that the client will close when you finish/error
        retrieveDocs = await collection.find().toArray();
        await client.close();
        return retrieveDocs
        
      }
      
      
},
  async handleObj(obj){ //handle new data
    try {
      collection = await run();
      obj["recordedAt"] = (new Date()); //add a date entry with exact time
      const insertDocuments = await collection.updateOne({"sensorID" : obj.sensorID}, 
      {$setOnInsert: {"sensorID" : obj.sensorID}, $push: {"entry" : obj} },  //if found, append, if not, insert. 
      {upsert: true});
    } finally {
      await client.close();
    }
  }

  // async updateObj(obj){
  //   try {
  //     // Connect the client to the server
  //     collection = await run();
  //     // var id = (await collection.find().sort({$natural:-1}).limit(1)[0] == undefined) ? 0 : await collection.find().sort({$natural:-1}).limit(1)[0]['_id'];
      
  //     let id = await getLastDocumentId(collection);
  //     console.log(id);
  //     if(id != -1){
  //       const updateInfo = {
  //         $push: {"entry" : obj}
  //       };
  //       const insertUpdate = await collection.updateOne({_id : id}, updateInfo);
  //       console.log('Updated documents =>', insertUpdate);
  //     }
     
      
      
    
    
       
  // //     const insertResult = await collection.createIndex({
  // //     "expirationSet": 1
  // // },
  // // {
  // //     unique: true,
  // //     sparse: true,
  // //     expireAfterSeconds: 30
  // // });
  
        


  //   } finally {
  //     // Ensures that the client will close when you finish/error
  //     await client.close();
  //   }

  // }
}



