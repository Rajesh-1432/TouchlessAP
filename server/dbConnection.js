const{MongoClient} = require("mongodb");

const url="mongodb://localhost:27017/";
const dbName="tlsAp";

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

const close=()=>{
    if(client){
        client.close();
        console.log("Database Connection Ended")
    }
};

module.exports={connect,close}