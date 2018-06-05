// goi man hinh dang nhap
// dang nhap thanh cong thi tai trang tuong ung

/*jshint esversion: 6 */

let app = require("http");
let fs = require("fs");
let url = require("url");
let query = require("querystring");
let present_generator = require("./bussiness/present_generator");
var port = 3000;
let page = -5;
let listProductLink;

app
  .createServer((req, res) => {

    let type;
    let urlExtension;
    let numPage = 0;
    let flag = false;

    switch (String(req.url.match(/\/\w+/))) {
      case 'null': //home_guest
        urlExtension = "/home_guest";
        type = "1";
        flag=true;
        break;
      case '/product_list':
        urlExtension = req.url;
        req.url = "/product_list.html";
        type = "2";
        listProductLink = urlExtension;
        if (page == -5) page += 5;
        flag=true;
        break;
      case '/product': //detail
        urlExtension = req.url;
        req.url = "/product_detail.html";
        type = "3";
        flag=true;
        break;
      case '/product_list_next':
        urlExtension = listProductLink;
        req.url = "/product_list.html";
        type = "2";
        page += 5;
        break;
      case '/product_list_previous':
        urlExtension = listProductLink;
        req.url = "/product_list.html";
        type = "2";
        if (page > 0)
          page -= 5;
        break;
        case '/product_list_change':
        urlExtension = listProductLink;
        numPage = parseInt(String(req.url.match(/\=\w+/)).substr(1,String(req.url.match(/\=\w+/)).length));
        req.url = "/product_list.html";
        type = "2";
        break;
    }

    let req_url = req.url == "/" ? "/index_guest.html" : req.url;
    let file_extension = req.url.lastIndexOf(".");
    let header_type = file_extension == -1 && req.url != "/" ? "text/plain" : {
      "/": "text/html",
      ".html": "text/html",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".css": "text/css",
      ".js": "text/javascript"
    }[req.url.substr(file_extension)];

    if (header_type === "text/html") {
      // TODO - Implement code to render html file
      res.setHeader("Content-type", header_type);
      if(flag==true){
        present_generator.SendRequestGetData(urlExtension);
      }
      res.end(present_generator.RenderUI(type, page, numPage));
    } else {
      fs.readFile(__dirname + req_url, (err, data) => {
        if (err) {
          console.log("==> Error: " + err);
          console.log("==> Error 404: File not found " + res.url);

          res.writeHead(404, "Not Found");
          res.end();
        } else {
          res.setHeader("Content-type", header_type);
          res.end(data);
          console.log(req.url, header_type);
        }
      });
    }
  })
  .listen(port, err => {
    if (err != null) {
      console.log("==> Error: " + err);
    } else {
      console.log("Server is starting at port " + port);
    }
  });