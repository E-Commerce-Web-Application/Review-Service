
require('dotenv').config();
const app = require('./src/app');

function startRESTServer() {
  const port = process.env.REST_PORT || 5000;
  app.listen(port, () => {
    console.log(`REST server running on port ${port}`);
  });
}

module.exports = startRESTServer;