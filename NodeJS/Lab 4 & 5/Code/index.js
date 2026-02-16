const process = require('node:process');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const CustomError = require('./helpers/CustomError');

const app = express();
app.use(express.json());

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is required in .env');
}

mongoose.connect(process.env.MONGO_URI);

app.use(require('./routes'));

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  if (err && err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({ message: 'This value already exists' });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, (error) => {
  if (error) return console.log(`Error can't run server on port: ${PORT}`, error);
  console.log(`server up and running http://127.0.0.1:${PORT}`);
});
