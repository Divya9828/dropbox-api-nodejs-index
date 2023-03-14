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
  clientId: "1qn6e332jh9hak8",
  clientSecret: "1tl3agf65eshbnv",
  refreshToken:
    "63tjLcof9gIAAAAAAAAAASlNWnP5gWm1FBai4pglKuw8WGRyKmGxXo3rXN4scgkz",
});
app.get("/",(req,res)=>{
  res.send("hello")
})
app.get("/search", (req, res) => {
  output().then((result) => {
    res.send(result);
  });
  // res.send("hello")
});
async function output() {
  // console.log("out");
  j = j + 1;
  await dbx.filesListFolder({ path: path_name }).then(async (response) => {
    console.log(response.result.entries);
    response.result.entries.map((data) => {
      if (data[".tag"] == "file") {
        file_path.push(data.path_lower);
      }
      if (data[".tag"] == "folder") {
        folder_path.push(data.path_lower);
      }
    });
    path_name = folder_path[j];
    if (j < folder_path.length) {
      await output().then((result) => {
        // return {folder_path,file_path}
        return [folder_path, file_path];
      });
    }
  });
  // return {folder_path,file_path}
  return [folder_path, file_path];
}
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
var servers = app.listen(process.env.PORT || 5000, function () {
  console.log("app started on port 5000");
});
