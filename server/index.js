const express = require("express");
const { json } = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const redis = require("redis");

const client = redis.createClient();

const app = express();
app.use(cors());
app.use(json());

const PORT = 3001;

app.post("/api/question/:answer", (req, res) => {
  const answer = req.params;
  const user = req.body.user;

  if (answer.answer == "true") {
    client.incr(user, (err, reply) => {
      console.log(`User now has ${reply} point(s).`);
      res.status(200).send({ reply });
    });
  } else if (answer.answer == "false") {
    console.log("wrong answer");
    client.get(user, (err, reply) => {
      console.log(`User still has ${reply} point(s).`);
      res.status(200).send({ reply });
    });
  }
});

app.post("/api/user/:user", (req, res) => {
  const { user } = req.params;

  client.set(user, 0);

  res.status(200).send(user);
});

app.post("/api/endgame/:username", (req, res) => {
  const { username } = req.params;
  // client.get(username, (err, reply) => {
  //   client.hset();
  // })

  client.get(username, (err, reply) => {
    client.rpush([username, reply]);

    res.sendStatus(200);
  });
});

client.on("connect", () => console.log("connected"));

app.listen(PORT, () => {
  console.log(`I am Here on port ${PORT}`);
});
