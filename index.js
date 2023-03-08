var bodyParser = require("body-parser");
const express = require("express");
const app = express();

var blobfile = require("blob-util");

// import { arrayBufferToBinaryString } from "blob-util";

var cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;

const dbx = new Dropbox({ 
  clientId: 'c3458eppqfffipb',
  clientSecret: 'nhxm9uo7r1wodnn',
  refreshToken: 'mjcX8muY27gAAAAAAAAAAX8Rq5HfDBqaBIqQIumGebw8zZLwnH_MVBTT43eeC_2K'
});
app.get("/check", (req, res) => {
  // var dbx = new Dropbox({
  //   accessToken:
  //     "LZp4psyQNaAAAAAAAAAASnEV5PbqvcziOw0OGSQeXWM",
  //   fetch: fetch,
  // });
  // const { Dropbox } = require('dropbox');

  dbx
    .filesListFolder({ path: "" })
    .then(function (response) {
      //   console.log(response);
      res.send(response);
      res.json();
    })
    .catch(function (error) {
      console.log(error);
      res.json();
    });
});
app.post("/receive", function (req, res, next) {
  var filename = req.body.text;
  dbx
    .filesListFolder({ path: filename })
    .then(function (response) {
      res.send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/get_file", (req, res, next) => {
  var pathname = req.body.filePath;
  // res.send(pathname)
  dbx
    .filesDownload({ path: pathname })
    .then(function (response) {
      let { result } = response;
      let { fileBinary } = result;

      var base64data = Buffer.from(fileBinary, "binary").toString("base64");

      console.log(base64data);
      // var originaldata = Buffer.from(base64data, 'base64');

      res.send({ imgUrl: base64data });
    })
    .catch(function (error) {
      console.log(error);
    });
});
var servers = app.listen(process.env.PORT|| 5000, function () {
  console.log("app started on port 5000");
});
