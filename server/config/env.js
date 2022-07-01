const dotenv = require("dotenv");

dotenv.config();

const env = {
  TOKEN_KEY: process.env.TOKEN_KEY,
  PATH_FILE: process.env.PATH_FILE,
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
  SYSTEM_EMAIL: process.env.SYSTEM_EMAIL,
  SYSTEM_PASSWORD: process.env.SYSTEM_PASSWORD,
};

module.exports = env;
