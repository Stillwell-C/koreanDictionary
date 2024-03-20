import mongoose, { ConnectionStates } from "mongoose";

type ConnectionType = {
  isConnected?: ConnectionStates;
};

const connection: ConnectionType = {};

export const connectDB = async () => {
  try {
    if (connection?.isConnected) {
      console.log("Using existing connection");
    }
    const URI = process.env.MONGO || "";
    const db = await mongoose.connect(URI);
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.log(err);
    if (err instanceof Error && err?.message) throw new Error(err.message);
  }
};
