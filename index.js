const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const NodeFetchCache = require("node-fetch-cache");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = NodeFetchCache.create({
  cache: new NodeFetchCache.FileSystemCache(),
});
app.get("/", (req, res) => {
  res.json({
    msg: "Hello Taher vaia",
  });
});

const getZillowData = async (zipcode) => {
  // &url=https%3A%2F%2Fwww.zillow.com%2Fhomes%2Fsold%2F14_days%2F11023_rb
  const url = `https://www.zillow.com/homes/sold/14_days/${zipcode}`;
  console.log(
    "build url:",
    `https://api.scraperapi.com/?api_key=${process.env.SCRAPER_API}&url=${url}`
  );
  const response = fetch(
    `https://api.scraperapi.com/?api_key=${process.env.SCRAPER_API}&url=${url}`
  ).then(async (response) => {
    const htmlData = await response.text();
    const dom = new JSDOM(htmlData);
    console.log(htmlData);
    console.log(
      JSON.parse(
        dom.window.document.querySelector("#__NEXT_DATA__").textContent
      )
    );
    return JSON.parse(
      dom.window.document.querySelector("#__NEXT_DATA__").textContent
    );
  });
};

// 11023_rb
app.get("/data/:url", async (req, res) => {
  res.json(await getZillowData(req.params.url));
});

app.listen(PORT, () => {
  console.log("Server is running at http://localhost:5000");
});
