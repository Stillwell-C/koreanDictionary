import mongoose, { ConnectionStates } from "mongoose";

type ConnectionType = {
  isConnected?: ConnectionStates;
};

const connection: ConnectionType = {};

export const connectDB = async () => {
  try {
    const URI = process.env.MONGO || "";
    const db = await mongoose.connect(URI);
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    if (err instanceof Error && err?.message) throw new Error(err.message);
    throw new Error("Something wen wrong with DB connection");
  }
};
