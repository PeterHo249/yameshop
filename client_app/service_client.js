// goi man hinh dang nhap
// dang nhap thanh cong thi tai trang tuong ung

/*jshint esversion: 6 */

let app = require('http');
let fs = require('fs');
var port = 3000;

app.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    let req_url = (req.url == '/') ? '/index_guest.html' : req.url;

    let file_extension = req.url.lastIndexOf('.');
    let header_type = (file_extension == -1 && req.url != '/') ? 'text/plain' : {
        '/': 'text/html',
        '.html': 'text/html',
        '.ico': 'image/x-icon',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.css': 'text/css',
        '.js': 'text/javascript'
    }[req.url.substr(file_extension)];

    if (header_type === 'text/html') {
        // TODO - Implement code to render html file
    } else {
        fs.readFile(__dirname + req_url, (err, data) => {
            if (err) {
                console.log('==> Error: ' + err);
                console.log('==> Error 404: File not found ' + res.url);

                res.writeHead(404, 'Not Found');
                res.end();
            } else {
                res.setHeader('Content-type', header_type);

                res.end(data);
                console.log(req.url, header_type);
            }
        });
    }
}).listen(port, (err) => {
    if (err != null) {
        console.log('==> Error: ' + err);
    } else {
        console.log('Server is starting at port ' + port);
    }
});