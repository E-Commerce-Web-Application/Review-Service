require('dotenv').config();
const connectDB = require('./src/config/db');
const startRESTServer = require('./server');
const startGRPCServer = require('./grpc_server');

(async () => {
  try {
    await connectDB();
    startRESTServer();
    startGRPCServer();

    console.log('REST + gRPC servers started successfully...');
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
})();