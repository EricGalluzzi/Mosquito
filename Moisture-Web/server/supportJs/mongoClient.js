const { MongoClient } = require('mongodb');
require('dotenv').config({ path: __dirname + '/process.env' });
const uri = process.env.MONGO_URI;
// const mongoose = require('mongoose');

const client = new MongoClient(uri);
const dbName = 'MoistureWeb'

async function run(colName) { //connect to client
  await client.connect();
  // Establish and verify connection
  await client.db("admin").command({ ping: 1 });
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const collection = db.collection(colName);
  return collection;
}

async function getLastDocumentId(collection) {
  documentArray = await collection.find().toArray();
  return (typeof documentArray[documentArray.length - 1] == "undefined") ? -1 : documentArray[documentArray.length - 1]._id;
}





module.exports = {


  async retrieveObj(col) { //retrieve entries

    try {
      collection = await run(col);

    } finally {
      // Ensures that the client will close when you finish/error
      retrieveDocs = await collection.find().toArray();
      await client.close();
      return retrieveDocs

    }


  },
  async handleObj(obj) { //handle new data
    try {
      collection = await run("MoistureWeb");
      obj["Date"] = (new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).split(',')[0]; //add a date entry with exact time
      const insertDocuments = await collection.updateOne({ "sensorID": obj.sensorID },
        { $setOnInsert: { "sensorID": obj.sensorID }, $push: { "entry": obj } },  //if found, append, if not, insert. 
        { upsert: true });
    } finally {
      await client.close();
    }
  }
  ,
  

  async findAvgSm(obj, dt, docs) {
    //we're going to retrieve n arrays for n devices
    //find the avg soil moisture for entries matching a specific date 
    //create/update for each matching sensor ID, adding to entries: Date, sensorID, soilMoisture, and VBat, 


    //create a new array of objects, each with a sensorID, soilMoisture for that date, and all the vBats
    try {
      const newDocs = docs.map(y => ({
        "sensorID": y.sensorID,
        "vBat": y.entry[y.entry.length - 1].vBat,
        "sM": y.entry.filter(x => x.Date == dt).length > 0 ? (y.entry.filter(x => x.Date == dt).map(x => x.sM).reduce((accumulator, currentValue) => accumulator + currentValue)) / (y.entry.filter(x => x.Date == dt).length) : 0,//find avg
        "Date": dt
      }))
      
      collection = await run("handleData");
      for (let i = 0; i < newDocs.length; i++){
      let apiPackage = Object.assign(newDocs[i], obj);
      console.log(apiPackage)
      const insertDocuments = await collection.updateOne({ "sensorID": newDocs[i].sensorID },
        { $setOnInsert: { "sensorID": newDocs[i].sensorID }, $push: { "entry": apiPackage } },  //if found, append, if not, insert. 
        { upsert: true })
      }




      console.log(newDocs)
    } finally {
      await client.close()
      //   }
    }


  }
}



