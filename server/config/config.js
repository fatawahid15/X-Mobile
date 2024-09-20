require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URL

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
    try {
        client.db(process.env.DB_NAME);
    } catch (error) {
        await client.close();
    }
}

async function getDB() {
    return client.db(process.env.DB_NAME);
}

module.exports = {connect, getDB}
