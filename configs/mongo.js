'use strict';

const MongoClient = require('mongodb').MongoClient;

class MongoConnection {
  constructor(){
    this.connectMongo();
  }

  async connectMongo() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
    const MONGODB_DB = process.env.MONGODB_DB || 'pemro';
    const client = await MongoClient.connect(MONGODB_URI, {
      useUnifiedTopology: true
    });
    this.dbClient = client.db(MONGODB_DB);
  }
  
  async insertOne(data, collection) {
    return await this.dbClient.collection(collection).insertOne(data);
  }
  
  async insertMany(data, collection) {
    return await this.dbClient.collection(collection).insertMany(data);
  }
  
  async find(query, collection) {
    return await this.dbClient.collection(collection).find(query).toArray();
  }
  
  async findOne(query, collection) {
    return await this.dbClient.collection(collection).findOne(query);
  }
  
  async clearCollection(collection) {
    return await this.dbClient.collection(collection).deleteMany({});
  }
  
  async pull(query, data, collection) {
    return await this.dbClient.collection(collection).update(query, {
      $pull: data
    });
  }
  
  async updateOne(query, data, collection) {
    return this.dbClient.collection(collection)
      .updateOne(query, {
        $set: data
      });
  }
  
  async push(query, data, collection) {
    return this.dbClient.collection(collection)
      .updateOne(query, {
        $push: data
      });
  }
  
  async getLastRecord(query, collection){
    return this.dbClient.collection(collection).find(query).limit(1).sort({
      $natural: -1
    }).toArray();
  }
  
  async delete(query, collection){
    return this.dbClient.collection(collection).deleteOne(query);
  }

  getClient(){
    return this.dbClient;
  }
}

module.exports = new MongoConnection();
