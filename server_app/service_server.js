/*jshint esversion: 6 */

let app = require('http');
let url = require('url');
let query = require('querystring');
let dto = require('./bussiness/data');
let bus = require('./bussiness/bussiness');

let port = 3030;

app.createServer((req, res) => {
    console.log('--------------------------------------'+req.method + " " + req.url);

    let data = '';
    let parameters = {};

    switch (req.method) {
        case 'GET':
            switch (String(req.url.match(/\/\w+/))) {
                case '/home_guest':
                    res.writeHeader(200, {'Content-Type': 'text/json'});
                    data = dto.get_home_guest();
                    res.end(data);
                    break;
                case '/product_list':
                    res.writeHeader(200, {'Content-Type': 'text/json'});
                    parameters = url.parse(req.url, true).query;
                    let category = parameters.category;
                    let brand = parameters.brand;
                    data = dto.get_product_list_guest(category, brand);
                    res.end(data);
                    break;
                case '/product':
                    res.writeHeader(200, {'Content-Type': 'text/json'});
                    parameters = url.parse(req.url, true).query;
                    let product_id = parameters.productId;
                    data = dto.get_product_guest(product_id);
                    res.end(data);
                    break;
                default:
                    res.writeHeader(404, {'Content-Type': 'text/plain'});
                    res.end("Request was not support!!!");
                    break;
            }
            break;
        case 'POST':
            switch (String(req.url.match(/\/\w+/))) {
                case '/login':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }

                        let token = bus.logIn(result.username, result.password);
                        if (!token) {
                            res.writeHeader(200, {'Content-type': 'text/plain'});
                            res.end('LogInFail');
                            return;
                        }

                        res.writeHeader(200, {'Content-type': 'text/plain'});
                        res.end(token);
                    });
                    break;
                case '/logout':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }

                        bus.logOut(result.token);
                        res.writeHeader(200, {'Content-type': 'text/plain'});
                        res.end();
                    });
                    break;
            }
            break;
    }
}).listen(port, (err) => {
    if (err != null) {
        console.log('======> Error: ' + err);
    } else {
        console.log('Server is starting at port ' + port);
    }
});