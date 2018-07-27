const express = require("express");
const { json } = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(json());

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`I am Here on port ${PORT}`);
});
