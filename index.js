const request = require("request");
const fs = require('fs');
const url = "https://www.4byte.directory/api/v1/signatures/";
let getFunctions = function(pageUrl, cb) {
    console.log(pageUrl)
    request.get(pageUrl, (error, response, body) => {
        cb(JSON.parse(body))
    });
}
let writeToFile = function(cont) {
    fs.writeFile("data.json", cont, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}
let values = []
let addToValues = (body) => {
    values = values.concat(body.results.map((sig) => {
        return {
            text_signature: sig.text_signature,
            hex_signature: sig.hex_signature
        }
    }))
    if (body.next) getFunctions(body.next, addToValues)
    else writeToFile(JSON.stringify({
        created_at: new Date(),
        results: values
    }, null, 2))
}
getFunctions(url, addToValues)