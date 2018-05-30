// goi man hinh dang nhap
// dang nhap thanh cong thi tai trang tuong ung

/*jshint esversion: 6 */

let app = require('http');
let fs = require('fs');
let url = require('url');
let query = require('querystring');
let present_generator = require('./bussiness/present_generator');
var port = 3000;

app.createServer((req, res) => {
    let params = {};
    params = url.parse(req.url, true).query;
    // console.log('--------------------------------------' + req.method + " " + String(req.url.match(/\/\w+/)));

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
        switch (String(req_url.match(/(\/\w+\.\w+)/)[0])) {
            case '/index_guest.html':
                    res.setHeader('Content-type', header_type);
                    //------------------------------
                    present_generator.SendRequestGetData('4','AK_MB_0000_L');
                    //------------------------------
                    res.end(present_generator.RenderUI('4')); 
                break;
        }
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