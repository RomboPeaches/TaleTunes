const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

// load style.css
let styleFile;
fs.readFile(__dirname + "/style.css";
        .then(contents => {
            styleFile = contents;
            server.listen(port, host, () => {
                console.log("style.css load OK");
            });
        })
        .catch(err => {
            //console.error(`Could not read index.html file: ${err}`);
            process.exit(1);
        });

        // load app.js
        let appFile; fs.readFile(__dirname + "/app.js")
        .then(contents => {
            appFile = contents;
            server.listen(port, host, () => {
                console.log("app.js load PK");
            });
        })
        .catch(err => {
            //console.error(`Could not read app.js file: ${err}`);
            process.exit(1);
        });

        // load index.html
        let indexFile; fs.readFile(__dirname + "/index.html")
        .then(contents => {
            indexFile = contents;
            server.listen(port, host, () => {
                console.log("index.html load OK");
            });
        })
        .catch(err => {
            //console.error(`Could not read index.html file: ${err}`);
            process.exit(1);
        });

        const requestListener = function(req, res) {

            switch (req.url) {

                case "/style.css":
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.write(styleFile);
                    break;

                case "/app.js":
                    res.writeHead(200, { "Content-Type": "text/javascript" });
                    res.write(appFile);
                    break;

                default:
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(indexFile);
            }
            res.end();
        };

        const server = http.createServer(requestListener);