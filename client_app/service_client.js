/*jshint esversion: 6 */

let app = require('http');
let url = require('url');
let query = require('querystring');
let fs = require('fs');
let present_generator = require('./bussiness/present_generator');
let connection = require('./bussiness/connection');
let cookie = require('cookie');
let JSONWebToken = require('jsonwebtoken');
var port = 3000;

app.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let parameters = {};

  let req_url = (req.url == '/') ? '/homepage.html' : req.url;

  let file_extension = String(req_url.match(/(\.\w+)/) ? req_url.match(/(\.\w+)/)[0] : '');
  let header_type = {
    '': 'text/plain',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.css': 'text/css',
    '.js': 'text/javascript'
  }[file_extension];

  switch (req.method) {
    case 'GET':
      if (header_type === 'text/html') {
        // TODO - Implement code to render html file
        switch (String(req_url.match(/(\/\w+\.\w+)/)[0])) {
          case '/index_guest.html':
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateExample());
            break;
          case '/homepage.html':
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateGuestHomepage());
            break;
          case '/productlist.html':
            parameters = url.parse(req.url, true).query;
            if (parameters.brand === undefined) {
              parameters.brand = '';
            }
            parameters.page = parseInt(parameters.page);
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateGuestProductList(parameters.page, parameters.category, parameters.brand));
            break;
          case '/productdetail.html':
            parameters = url.parse(req.url, true).query;
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateGuestProductDetail(parameters.id));
            break;
          case '/login.html':
            res.setHeader('Content-type', header_type);
            let html_temp = fs.readFileSync('./login.html', 'utf-8');
            res.end(html_temp);
            break;
          case '/staffproductlist.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateStaffProductList(parameters.category, parameters.brand, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/stafforderlist.html':
            {
              parameters = url.parse(req.url, true).query;
              let year = (new Date()).getFullYear();
              if (parameters.year !== undefined) {
                year = parameters.year;
              }
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateStaffOrderList(year, parameters.month, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/staffproductdetail.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateStaffProductDetail(parameters.productid, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/stafforderdetail.html':
            {
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              parameters = url.parse(req.url, true).query;
              let html = present_generator.generateStaffOrderDetail(parameters.orderid, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerproductlist.html':
            {
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              parameters = url.parse(req.url, true).query;
              let html = present_generator.generateManagerProductList(parameters.category, parameters.brand, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerproductdetail.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerProductDetail(parameters.productid, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerorderlist.html':
            {
              parameters = url.parse(req.url, true).query;
              let year = (new Date()).getFullYear();
              if (parameters.year !== undefined) {
                year = parameters.year;
              }
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerOrderList(year, parameters.month, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerorderdetail.html':
            {
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              parameters = url.parse(req.url, true).query;
              let html = present_generator.generateManagerOrderDetail(parameters.orderid, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerstafflist.html':
            {
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerStaffList(token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                let user_info = connection.parseUserInfo(req);
                res.setHeader('Content-type', header_type);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managershoplist.html':
            {
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerShopList(token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/staffaddorder.html':
            {
              let html = present_generator.generateStaffAddOrder();
              if (html === 'LogInRequire') {
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/staffupdateorder.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateStaffUpdateOrder(parameters.id, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/manageraddshop.html':
            {
              let html = present_generator.generateManagerAddShop();
              if (html === 'LogInRequire') {
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerupdateshop.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerUpdateShop(parameters.id, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/manageraddstaff.html':
            {
              let html = present_generator.generateManagerAddStaff();
              if (html === 'LogInRequire') {
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerupdatestaff.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerUpdateStaff(parameters.id, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/manageraddorder.html':
            {
              let html = present_generator.generateManagerAddOrder();
              if (html === 'LogInRequire') {
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerupdateorder.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerUpdateOrder(parameters.id, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/managerupdateproduct.html':
            {
              parameters = url.parse(req.url, true).query;
              let cookies = cookie.parse(req.headers['cookie']);
              let token = cookies.usertoken;
              let html = present_generator.generateManagerUpdateProduct(parameters.id, token);
              if (html === 'LogInRequire') {
                // redirect to login
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/login.html'
                });
                res.end();
              } else {
                res.setHeader('Content-type', header_type);
                let user_info = connection.parseUserInfo(req);
                if (user_info != {}) {
                  html = present_generator.insertProperty(html, 'username', user_info.name);
                }
                res.end(html);
              }
            }
            break;
          case '/logout.html':
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            connection.post('/logout', '{"token":"' + token + '"}');
            res.setHeader('Set-Cookie', cookie.serialize('usertoken', '', {
              expires: new Date()
            }));
            res.writeHead(302, {
              'Location': 'http://' + req.headers['host'] + '/login.html'
            });
            res.end();
            break;
          default:
            res.writeHeader(404, {
              'Content-Type': 'text/plain'
            });
            res.end("Request was not support!!!");
            break;
        }
      } else {
        fs.readFile(__dirname + req_url, (err, data) => {
          if (err) {
            console.log('==> ' + err);
            console.log('==> Error 404: File not found ' + res.url);

            res.writeHeader(404, 'Not Found');
            res.end();
          } else {
            res.setHeader('Content-type', header_type);

            res.end(data);
            console.log(req.url, header_type);
          }
        });
      }
      break;
    case 'POST':
      switch (String(req_url.match(/(\/\w+\.\w+)/)[0])) {
        case '/login.html':
          extractPostBody(req, result => {
            // TODO: Implement login code here
            let body = '{"username":"' + result.username + '","password":"' + result.password + '"}';
            let login_res = connection.post('/login', body);
            if (login_res === 'LogInFail') {
              // redirect to login
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              // set cookie
              let user_info = JSONWebToken.verify(login_res, 'key for yameshop');
              if (user_info.role === 'staff') {
                // redirect to staff
                res.setHeader('Set-Cookie', cookie.serialize('usertoken', login_res, {
                  httpOnly: true,
                  maxAge: 60 * 60 * 24
                }));
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/staffproductlist.html?category=AK&brand=AD',
                  'Cookie': cookie.serialize('usertoken', login_res, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24
                  })
                });
                res.end();
              } else {
                // redirect to manager
                res.setHeader('Set-Cookie', cookie.serialize('usertoken', login_res, {
                  httpOnly: true,
                  maxAge: 60 * 60 * 24
                }));
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + '/managerproductlist.html?category=AK&brand=AD'
                });
                res.end();
              }
            }
          });
          break;
        case '/staffaddorder.html':
          extractPostBody(req, result => {
            let user_info = connection.parseUserInfo(req);
            let sell_date = new Date(result.date);
            let month = sell_date.getMonth() + 1;
            let date_string = sell_date.getDate() + '/' + month + '/' + sell_date.getFullYear();
            let body = '{"date":"' + date_string + '","type":"out", "staff_id":"' + user_info.id + '","shop_id":"' + user_info.shop + '","list_item":[';
            for (let i = 0; i < result.id.length; i++) {
              let temp = '{"id":"' + result.id[i] + '","count":"' + result.count[i] + '"}';
              body += temp;
              if (i !== (result.id.length - 1)) {
                body += ',';
              }
            }
            body += ']}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/add_new_order', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/stafforderlist.html?year=' + now.getFullYear() + '&month=' + month;
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/staffupdateorder.html':
          extractPostBody(req, result => {
            let user_info = connection.parseUserInfo(req);
            let sell_date = new Date(result.date);
            let month = sell_date.getMonth() + 1;
            let date_string = sell_date.getDate() + '/' + month + '/' + sell_date.getFullYear();
            let body = '{"id":"' + result.id + '","date":"' + date_string + '","type":"out", "staff_id":"' + user_info.id + '","shop_id":"' + user_info.shop + '","list_item":[';
            for (let i = 0; i < result.id.length; i++) {
              let temp = '{"id":"' + result.id[i] + '","count":"' + result.count[i] + '"}';
              body += temp;
              if (i !== (result.id.length - 1)) {
                body += ',';
              }
            }
            body += ']}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/update_order_info', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/stafforderlist.html?year=' + now.getFullYear() + '&month=' + month;
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/staffdeleteorder.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/delete_order', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/stafforderlist.html?year=' + now.getFullYear() + '&month=' + month;
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/manageraddstaff.html':
          extractPostBody(req, result => {
            let body = '{"name":"' + result.name + '","role":"' + result.role + '","username":"' + result.username + '","password":"' + result.password + '", "shop":"' + result.shop + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/add_new_staff', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managerstafflist.html';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerupdatestaff.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '","name":"' + result.name + '","role":"' + result.role + '","username":"' + result.username + '","password":"' + result.password + '", "shop":"' + result.shop + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/update_staff_info', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managerstafflist.html';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerdeletestaff.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/delete_staff', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managerstafflist.html';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/manageraddshop.html':
          extractPostBody(req, result => {
            let body = '{"name":"' + result.name + '", "address":"' + result.address + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/add_new_shop', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managershoplist.html';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerupdateshop.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '","name":"' + result.name + '", "address":"' + result.address + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/update_shop_info', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managershoplist.html';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerdeleteshop.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/delete_shop', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managershoplist.html';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/manageraddorder.html':
          extractPostBody(req, result => {
            let user_info = connection.parseUserInfo(req);
            let sell_date = new Date(result.date);
            let month = sell_date.getMonth() + 1;
            let date_string = sell_date.getDate() + '/' + month + '/' + sell_date.getFullYear();
            let body = '{"date":"' + date_string + '","type":"in", "staff_id":"' + user_info.id + '","shop_id":"' + user_info.shop + '","list_item":[';
            for (let i = 0; i < result.id.length; i++) {
              let temp = '{"id":"' + result.id[i] + '","count":"' + result.count[i] + '"}';
              body += temp;
              if (i !== (result.id.length - 1)) {
                body += ',';
              }
            }
            body += ']}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/add_new_order', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/managerorderlist.html?year=' + now.getFullYear() + '&month=' + month;
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerupdateorder.html':
          extractPostBody(req, result => {
            let user_info = connection.parseUserInfo(req);
            let sell_date = new Date(result.date);
            let month = sell_date.getMonth() + 1;
            let date_string = sell_date.getDate() + '/' + month + '/' + sell_date.getFullYear();
            let body = '{"id":"' + result.id + '","date":"' + date_string + '","type":"in", "staff_id":"' + user_info.id + '","shop_id":"' + user_info.shop + '","list_item":[';
            for (let i = 0; i < result.id.length; i++) {
              let temp = '{"id":"' + result.id[i] + '","count":"' + result.count[i] + '"}';
              body += temp;
              if (i !== (result.id.length - 1)) {
                body += ',';
              }
            }
            body += ']}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/update_order_info', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/managerorderlist.html?year=' + now.getFullYear() + '&month=' + month;
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerdeleteorder.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/delete_order', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/managerorderlist.html?year=' + now.getFullYear() + '&month=' + month;
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerupdateproduct.html':
          extractPostBody(req, result => {
            let user_info = connection.parseUserInfo(req);
            let sell_date = new Date(result.date);
            let month = sell_date.getMonth() + 1;
            let date_string = sell_date.getDate() + '/' + month + '/' + sell_date.getFullYear();
            let body = '{"id":"' + result.id + '","in_stock":"' + result.instock + '","name":"' + result.name + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/update_product', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let now = new Date();
                let month = now.getMonth() + 1;
                let url = '/managerproductlist.html?category=AK&brand=AD';
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
        case '/managerdeleteproduct.html':
          extractPostBody(req, result => {
            let body = '{"id":"' + result.id + '"}';
            let cookies = cookie.parse(req.headers['cookie']);
            let token = cookies.usertoken;
            let response = connection.post('/delete_product', body, token);
            if (response === 'LogInRequire') {
              res.writeHead(302, {
                'Location': 'http://' + req.headers['host'] + '/login.html'
              });
              res.end();
            } else {
              if (response === 'done') {
                let url = '/managerproductlist.html?category=AK&brand=AD'
                res.writeHead(302, {
                  'Location': 'http://' + req.headers['host'] + url
                });
                res.end();
              } else {
                res.writeHeader(404, {
                  'Content-Type': 'text/plain'
                });
                res.end("Your request failed!!!");
              }
            }
          });
          break;
      }
      break;
  }

}).listen(port, (err) => {
  if (err != null) {
    console.log('==> Error: ' + err);
  } else {
    console.log('Server is starting at port ' + port);
  }
});

// Post will send a form object
function extractPostBody(req, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (req.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    let result = {};
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      callback(query.parse(body));
    });
  } else {
    return callback(null);
  }
}