const { MongoClient } = require("mongodb");

const url = "mongodb+srv://rajeshdumpala1432:Tail@1234@cluster0.wyobtyc.mongodb.net/";
const dbName = "tlsAp";

let client;
const connect = async () => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Database Connected Successfully");
    return client.db(dbName);
  } catch (error) {
    console.error("Failed To Connect Database:", error);
    throw error;
  }
};

const close = () => {
  if (client) {
    client.close();
    console.log("Database Connection Ended");
  }
};

module.exports = { connect, close };
