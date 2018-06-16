/*jshint esversion: 6 */

let app = require('http');
let url = require('url');
let query = require('querystring');
let dto_guest = require('./bussiness/data_guest');
let dto_staff = require('./bussiness/data_staff');
let dto_manager = require('./bussiness/data_manager');
let bus = require('./bussiness/bussiness');

let port = 3030;

app.createServer((req, res) => {
    console.log('--------------------------------------' + req.method + " " + req.url);

    let data = '';
    let parameters = {};
    let category, brand, id, month, year;

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
                    category = parameters.category;
                    brand = parameters.brand;
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
                    category = parameters.category;
                    brand = parameters.brand;
                    data = dto_staff.get_product_list_staff(category, brand);
                    res.end(data);
                    break;
                case '/bill_general':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    month = parameters.month;
                    year = parameters.year;
                    res.end(dto_staff.get_list_order(month, year));
                    break;
                case '/bill_detail':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    month = parameters.month;
                    year = parameters.year;
                    id = parameters.id;
                    res.end(dto_staff.get_list_order(month, year, id));
                    break;
                case '/manager_shop_list':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    
                    res.end(dto_manager.get_all_shop());
                    break;
                case '/manager_staff_list':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    res.end(dto_manager.get_all_staff());
                    break;
                case '/manager_produc_list':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    category = parameters.category;
                    brand = parameters.brand;
                    res.end(dto_manager.get_product_list(category,brand));
                    break;
                case '/manager_produc_detail':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    id = parameters.id;
                    res.end(dto_manager.get_product_detail(id));
                    break; 
                case '/manager_order_list':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    month = parameters.month;
                    year = parameters.year;
                    res.end(dto_manager.get_order_list(month,year));
                    break;
                case '/manager_order_detail':
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    id = parameters.id;
                    res.end(dto_manager.get_order_detail(id));
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