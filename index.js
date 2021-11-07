/*
 * Licensed under the MIT License.
 */
"use strict";
const fs = require('fs');

const express = require("express");
const app = express();
const PORT = process.env.PORT || 1337;
app.use(express.static("public"));

app.use(function (req, res, next) {
  // TODO: fix the header to deny requests from other sites
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Vary", "Origin");
  req;
  next();
});
app.get("/imagePath", async (request, response) => {
  const { imageNumber, group } = request.query;
  const folderPath = `public/images/${group}` ;
  const imageName = fs.readdirSync(folderPath)
  .filter(fileName => fileName.endsWith(imageNumber + ".png"))[0];
  response.setHeader("Content-Type", "text/json");
  response.end(`{ "imageName": "${imageName}" }`);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
