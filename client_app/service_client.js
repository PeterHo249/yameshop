// goi man hinh dang nhap
// dang nhap thanh cong thi tai trang tuong ung

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
            // Testing purpose
            res.setHeader('Content-type', header_type);
            let html_temp = fs.readFileSync('./login.html', 'utf-8');
            res.end(html_temp);

            // TODO: Implement code here
            break;
          case '/staffproductlist.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateStaffProductList());
            break;
          case '/stafforderlist.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateStaffOrderList());
            break;
          case '/staffproductdetail.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateStaffProductDetail());
            break;
          case '/stafforderdetail.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateStaffOrderDetail());
            break;
          case '/managerproductlist.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateManagerProductList());
            break;
          case '/managerproductdetail.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateManagerProductDetail());
            break;
          case '/managerorderlist.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateManagerOrderList());
            break;
          case '/managerorderdetail.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateManagerOrderDetail());
            break;
          case '/managerstafflist.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateManagerStaffList());
            break;
          case '/managershoplist.html':
            // Testing purpose
            res.setHeader('Content-type', header_type);
            res.end(present_generator.generateManagerShopList());
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
            console.log(login_res);
            if (login_res === 'LogInFail') {
              // redirect to login
              res.writeHead(302, {'Location': 'http://' + req.headers['host'] + '/login.html'});
              res.end();
            } else {
              // set cookie
              let user_info = JSONWebToken.verify(login_res, 'key for yameshop');
              if (user_info.role === 'staff') {
                // redirect to staff
                res.setHeader('Set-Cookie', login_res);
                res.writeHead(302, {'Location': 'http://' + req.headers['host'] + '/staffproductlist.html'});
                res.end();
              } else {
                // redirect to manager
                res.setHeader('Set-Cookie', login_res);
                res.writeHead(302, {'Location': 'http://' + req.headers['host'] + '/managerproductlist.html'});
                res.end();
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