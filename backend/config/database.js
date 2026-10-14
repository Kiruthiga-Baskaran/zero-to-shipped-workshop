const mongoose = require('mongoose');

let connectionPromise;

async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Set it in backend/.env.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    connectionPromise = undefined;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI)
      .then((connection) => {
        console.log('Connected to MongoDB');
        return connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDatabase;
