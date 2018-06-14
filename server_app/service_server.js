/*jshint esversion: 6 */

let app = require('http');
let url = require('url');
let query = require('querystring');
let dto_guest = require('./bussiness/data_guest');
let dto_staff = require('./bussiness/data_staff');
let bus = require('./bussiness/bussiness');

let port = 3030;

var sessions = [];

function checkAuth(headers) {
    let uid = headers.uid;
    for (let i = 0; i < sessions.length; i++) {
        if (uid === sessions[i]) {
            return true;
        }
    }
    return false;
}

app.createServer((req, res) => {
    console.log('--------------------------------------' + req.method + " " + req.url);

    let data = '';
    let parameters = {};

    switch (req.method) {
        case 'GET':
            switch (String(req.url.match(/\/\w+/))) {
                case '/home_guest':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    data = dto_guest.get_home_guest();
                    res.end(data);
                    break;
                case '/product_list':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let category = parameters.category;
                    let brand = parameters.brand;
                    data = dto_guest.get_product_list_guest(category, brand);
                    res.end(data);
                    break;
                case '/product':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let product_id = parameters.productId;
                    data = dto_guest.get_product_guest(product_id);
                    res.end(data);
                    break;
                case '/product_staff':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let _product_id = parameters.productId;
                    data = dto_staff.get_product_staff(_product_id);
                    res.end(data);
                    break;
                case '/product_list_staff':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let _category = parameters.category;
                    let _brand = parameters.brand;
                    data = dto_staff.get_product_list_staff(_category, _brand);
                    res.end(data);
                    break;
                case '/bill_general':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let month = parameters.month;
                    let year = parameters.year;
                    res.end(dto_staff.get_list_order(month, year));
                    break;
                case '/bill_detail':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let _month = parameters.month;
                    let _year = parameters.year;
                    let _id = parameters.id;
                    res.end(dto_staff.get_list_order(_month, _year, _id));
                    break;
                default:
                    res.writeHeader(404, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Request was not support!!!");
                    break;
            }
            break;
        case 'POST':
            break;
    }
}).listen(port, (err) => {
    if (err != null) {
        console.log('======> Error: ' + err);
    } else {
        console.log('Server is starting at port ' + port);
    }
});