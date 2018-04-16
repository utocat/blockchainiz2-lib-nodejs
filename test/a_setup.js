const fs = require('fs');

// This block is used to get the environment variables necessary to perform
// the tests. There needs to be a file called .env in the root folder of the
// project which contains:
// API_PUBLIC_KEY="yourPublicKey"
// API_PRIVATE_KEY="yourPrivateKey"
try {
  fs.accessSync('./.env');
  require('dotenv').config();
} catch (ex) {
  console.log(ex);
}
