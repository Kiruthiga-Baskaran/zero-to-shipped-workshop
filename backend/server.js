require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Resume parser API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start the API:', error);
  process.exitCode = 1;
});
