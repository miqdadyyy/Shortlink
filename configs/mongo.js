const MongoClient = require('mongodb').MongoClient;

class MongoConnection {
  static async connectMongo() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
    const MONGODB_DB = process.env.MONGODB_DB || 'pemro';
    const client = await MongoClient.connect(MONGODB_URI, {
      useUnifiedTopology: true
    });
    return client.db(MONGODB_DB);
  }
  
  static async insertOne(data, collection) {
    const dbClient = await this.connectMongo();
    return await dbClient.collection(collection).insertOne(data);
  }
  
  static async insertMany(data, collection) {
    const dbClient = await this.connectMongo();
    return await dbClient.collection(collection).insertMany(data);
  }
  
  static async find(query, collection) {
    const dbClient = await this.connectMongo();
    return dbClient.collection(collection).find(query).toArray();
  }
  
  static async findOne(query, collection) {
    const dbClient = await this.connectMongo();
    return await dbClient.collection(collection).findOne(query);
  }
  
  static async clearCollection(collection) {
    const dbClient = await this.connectMongo();
    return await dbClient.collection(collection).deleteMany({});
  }
  
  static async pull(query, data, collection) {
    const dbClient = await this.connectMongo();
    return await dbClient.collection(collection).update(query, {
      $pull: data
    });
  }
  
  static async updateOne(query, data, collection) {
    const dbClient = await this.connectMongo();
    return dbClient.collection(collection)
      .updateOne(query, {
        $set: data
      });
  }
  
  static async push(query, data, collection) {
    const dbClient = await this.connectMongo();
    return dbClient.collection(collection)
      .updateOne(query, {
        $push: data
      });
  }
  
  static async getLastRecord(query, collection){
    const dbClient = await this.connectMongo();
    return dbClient.collection(collection).find(query).limit(1).sort({
      $natural: -1
    }).toArray();
  }
  
  static async delete(query, collection){
    const dbClient = await this.connectMongo();
    return dbClient.collection(collection).deleteOne(query);
  }
}

module.exports = MongoConnection;
