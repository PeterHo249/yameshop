/*jshint esversion: 6 */
const fs = require('fs');

let dataJson;

class UI {

    constructor() {}

    InsertProperty(string, prop_name, prop_value) {
        let prop_to_replace = '{{' + prop_name + '}}';
        string = string.replace(new RegExp(prop_to_replace, 'g'), prop_value);
        return string;
    }

    RenderUI(req) {
        let layout_html = fs.readFileSync('./client_app/index_guest.html', 'utf-8');
        let content_html;

        let i;
        switch (req) {
            case '1':
                i = 0
                content_html = fs.readFileSync('./client_app/snippets/homepage.html', 'utf-8');
                for (; i < 12; i++) {
                    content_html = this.InsertProperty(content_html, 'NEW_PRODUCT_NAME_' + i, dataJson.news[i].name);
                    content_html = this.InsertProperty(content_html, 'NEW_PRODUCT_PRICE_' + i, dataJson.news[i].out_price);
                    content_html = this.InsertProperty(content_html, 'TREND_PRODUCT_NAME_' + i, dataJson.trends[i].name);
                    content_html = this.InsertProperty(content_html, 'TREND_PRODUCT_PRICE_' + i, dataJson.trends[i].out_price);
                }
                break;
            case '2':
                i = 0
                content_html = fs.readFileSync('./client_app/snippets/product_list.html', 'utf-8');
                for (; i < 8; i++) {
                    content_html = this.InsertProperty(content_html, 'PRODUCT_NAME_' + i, dataJson[i].name);
                    content_html = this.InsertProperty(content_html, 'PRODUCT_PRICE_' + i, dataJson[i].out_price);
                }
                break;
            case '3':
                i = 0
                content_html = fs.readFileSync('./client_app/snippets/product_list.html', 'utf-8');
                for (; i < 8; i++) {
                    content_html = this.InsertProperty(content_html, 'PRODUCT_NAME_' + i, dataJson[i].name);
                    content_html = this.InsertProperty(content_html, 'PRODUCT_PRICE_' + i, dataJson[i].out_price);
                }
                break;
            case '4':
                i = 0
                content_html = fs.readFileSync('./client_app/snippets/product_detail.html', 'utf-8');
                let info_table;
                for (; i < dataJson.color.length; i++) {
                    info_table += '<tr><th scope="row">'+dataJson.id +'_' + dataJson.color[i].id +'</th><td>'+dataJson.color[i].name+','+dataJson.size+
                    '</td><td>'+dataJson.color[i].shops+'</td></tr>';
                }
                content_html = this.InsertProperty(content_html, 'INFO_TABLE',info_table);
                content_html = this.InsertProperty(content_html, 'PRODUCT_NAME',dataJson.name);
                content_html = this.InsertProperty(content_html, 'PRODUCT_PRICE',dataJson.out_price);
                break;
        }

        layout_html = this.InsertProperty(layout_html, 'body', content_html);

        return layout_html;
    }

    SendRequestGetData(req, firstParams, secondParams) {

        let addressProcess;
        let addressService = "http://localhost:3030";

        switch (req) {
            case '1': //get hot and trend product
                let home_guest = "home_guest";
                addressProcess = `${addressService}/${home_guest}`;
                break;
            case '2': //get info product list with two params
                let product_list_2 = "product_list";
                let category_2 = "category";
                let brand_2 = "brand";
                addressProcess = `${addressService}/${product_list_2}?${category_2}=${firstParams}&${brand_2}=${secondParams}`;
                break;
            case '3': //get info product list with one params
                let product_list_1 = "product_list";
                let category_1 = "category";
                addressProcess = `${addressService}/${product_list_1}?${category_1}=${firstParams}`;
                break;
            case '4': //get info a product
                let product = "product";
                let productId = "productId";
                addressProcess = `${addressService}/${product}?${productId}=${firstParams}`;
                break;
            default:
                res.writeHeader(404, {
                    'Content-Type': 'text/plain'
                });
                res.end("Request was not support!!!");
                break;
        }

        let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        let processHttp = new XMLHttpRequest();
        processHttp.open("GET", addressProcess, false);
        processHttp.send("");
        let str_JSON = processHttp.responseText;
        dataJson = JSON.parse(str_JSON);
    }
}

let render = new UI();
module.exports = render;