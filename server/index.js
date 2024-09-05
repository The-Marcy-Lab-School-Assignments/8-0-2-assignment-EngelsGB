// Imports

const express = require('express');
const path = require('path');
const handleFetch = require('./utils/handleFetch');
const dotenv = require('dotenv');
dotenv.config();

// Setup

const pathToDistFolder = path.join(__dirname, '../giphy-search/dist');
const app = express();

// Controllers

const logRoutes = (req, res, next) => {
  const time = (new Date()).toLocaleString();
  console.log(`${req.method}: ${req.originalUrl} - ${time}`);
  next();
};

const serveStatic = express.static(pathToDistFolder);

const serveGifs = async (req, res, next) => {
  const API_URL = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.API_KEY}&limit=3&rating=g`;
  const [data, error] = await handleFetch(API_URL);
  if (error) {
    console.log(error.message);
    return res.status(404).send(error);
  }
  res.send(data);
}

// Routes

app.use(logRoutes);
app.use(serveStatic);
app.get('/api/gifs', serveGifs)


const port = 8080;
app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});