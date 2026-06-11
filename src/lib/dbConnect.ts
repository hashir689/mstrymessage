import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState; // if readystate is 0 then please disconneted 1 is connected 2 is connecting 3 is disconnecting
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database Connection failed because of " + error);
    process.exit(1); // this is use for terminate the application instead of running broken server
  }
}

export default dbConnection;
