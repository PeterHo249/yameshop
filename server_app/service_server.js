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
    console.log('--> ' + req.method + " " + req.url);

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
                      if (bus.isAuth(req, 'staff')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let _product_id = parameters.productId;
                    data = dto_staff.get_product_staff(_product_id);
                    res.end(data);
                     } else {
                         res.writeHeader(200, {
                             'Content-type': 'text/plain'
                         });
                         res.end('LogInRequire');
                     }
                    break;
                case '/product_list_staff':
                      if (bus.isAuth(req, 'staff')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let _category = parameters.category;
                    let _brand = parameters.brand;
                    data = dto_staff.get_product_list_staff(_category, _brand);
                    res.end(data);
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/bill_general':
                      if (bus.isAuth(req, 'staff')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    month = parameters.month;
                    year = parameters.year;
                    res.end(dto_staff.get_list_order(month, year));
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/bill_detail':
                      if (bus.isAuth(req, 'staff')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    let _month = parameters.month;
                    let _year = parameters.year;
                    let _id = parameters.id;
                    res.end(dto_staff.get_list_order(_month, _year, _id));
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/manager_shop_list':
                      if (bus.isAuth(req, 'manager')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });

                    res.end(dto_manager.get_all_shop());
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/manager_staff_list':
                      if (bus.isAuth(req, 'manager')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    res.end(dto_manager.get_all_staff());
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/manager_product_list':
                      if (bus.isAuth(req, 'manager')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    category = parameters.category;
                    brand = parameters.brand;
                    res.end(dto_manager.get_product_list(category, brand));
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/manager_product_detail':
                      if (bus.isAuth(req, 'manager')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    id = parameters.id;
                    res.end(dto_manager.get_product_detail(id));
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/manager_order_list':
                      if (bus.isAuth(req, 'manager')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    month = parameters.month;
                    year = parameters.year;
                    res.end(dto_manager.get_order_list(month, year));
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
                    break;
                case '/manager_order_detail':
                      if (bus.isAuth(req, 'manager')) {
                    res.writeHeader(200, {
                        'Content-Type': 'text/json'
                    });
                    parameters = url.parse(req.url, true).query;
                    id = parameters.id;
                    res.end(dto_manager.get_order_detail(id));
                      } else {
                          res.writeHeader(200, {
                              'Content-type': 'text/plain'
                          });
                          res.end('LogInRequire');
                      }
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
                            res.writeHeader(200, {
                                'Content-type': 'text/plain'
                            });
                            res.end('LogInFail');
                            return;
                        }

                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
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
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end();
                    });
                    break;
                case '/add_new_staff':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.add_new_staff( result.name, result.role, result.username, result.password, result.shop);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/update_staff_info':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.change_info_staff(result.id, result.name, result.role, result.username, result.password, result.shop);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/delete_staff':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.delete_staff(result.id);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end("done");
                    });
                    break;
                case '/update_product':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.change_info_product(result);
                         //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/delete_product':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.delete_product(result.id);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/add_new_order':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.add_new_order(result);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/update_order_info':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.change_info_order(result);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/delete_order':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.delete_order(result.id);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/add_new_shop':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.add_new_shop(result.id, result.name, result.address);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/update_shop_info':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.change_info_shop(result.id, result.name, result.address);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
                    });
                    break;
                case '/delete_shop':
                    bus.extractPostBody(req, result => {
                        if (result === null) {
                            console.log('------> Nothing in request body');
                            return;
                        }
                        bus.delete_shop(result.id);
                        //bus.update_all_file();
                        res.writeHeader(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('done');
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