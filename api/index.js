require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../src/app');

let connecting;
async function connect() {
  if (mongoose.connection.readyState === 1) return;
  if (!connecting) {
    connecting = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connecting = null;
      throw err;
    });
  }
  await connecting;
}

module.exports = async (req, res) => {
  try {
    await connect();
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed' });
  }
  return app(req, res);
};