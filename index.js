const request = require("request");
const fs = require("fs");
const urlFuncs = "https://www.4byte.directory/api/v1/signatures/";
const urlEvents = "https://www.4byte.directory/api/v1/event-signatures/";

let getFunctions = function (pageUrl, fileName, cb) {
  console.log(pageUrl);
  request.get(pageUrl, (error, response, body) => {
    cb(JSON.parse(body), fileName);
  });
};
let writeToFile = function (cont, fileName) {
  fs.writeFile(fileName + ".json", cont, function (err) {
    if (err) {
      return console.log(err);
    }
  });
};
let values = {};
let addToValues = (body, fileName) => {
  body.results.forEach((sig) => {
    if (!values[fileName]) values[fileName] = {};
    values[fileName][sig.hex_signature] = sig.text_signature;
  });
  if (body.next) getFunctions(body.next, fileName, addToValues);
  else
    writeToFile(
      JSON.stringify({
        created_at: new Date(),
        results: values[fileName],
      }),
      fileName
    );
};
getFunctions(urlFuncs, "functions", addToValues);
getFunctions(urlEvents, "events", addToValues);
