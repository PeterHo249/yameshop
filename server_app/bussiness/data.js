/*jshint esversion: 6 */

let fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let product_path = path + '/product';


let get_product_list_guest = (category, brand) => {
    let data = [];
    let parser = new xml2js.Parser();

    // TODO - Implement code here
    if (brand === undefined) {
        fs.readdirSync(product_path + '/' + category + '/').forEach(dir => {
            let file_path = product_path + '/' + category + '/' + dir + '/xml/product_list.xml';
            let file_content = fs.readFileSync(file_path, 'utf-8');

            parser.parseString(file_content, function (err, result) {
                let products = result.product_list.product;
                products.forEach(product => {
                    let product_info = {
                        id: product.$.id,
                        name: product.$.name,
                        out_price: product.$.out_price
                    };
                    data.push(product_info);
                });
            });
        });
    } else {
        let file_path = product_path + '/' + category + '/' + brand + '/xml/product_list.xml';
        let file_content = fs.readFileSync(file_path, 'utf-8');

        parser.parseString(file_content, function (err, result) {
            let products = result.product_list.product;
            products.forEach(product => {
                let product_info = {
                    id: product.$.id,
                    name: product.$.name,
                    out_price: product.$.out_price
                };
                data.push(product_info);
            });
        });
    }

    let result_str = JSON.stringify(data);
    return result_str;
};

let get_product_guest = (product_id) => {
    let data = {};
    let parser = new xml2js.Parser();
    let shop_list = {};
    parser.parseString(fs.readFileSync(path + '/shop/shop_list.xml', 'utf-8'), function (err, result) {
        shop_list = result.shop_list.shop;
    });

    // TODO - Implement code here
    let tokens = product_id.match(/([^_]+)/g);
    let file_path = product_path + '/' + tokens[0] + '/' + tokens[1] + '/xml/product_list.xml';
        let file_content = fs.readFileSync(file_path, 'utf-8');

        parser.parseString(file_content, function (err, result) {
            let products = result.product_list.product;
            let id = tokens[0] + '_' + tokens[1] + '_' + tokens[2];
            for (let i = 0; i < products.length; i++) {
                if (products[i].$.id === id) {
                    data = products[i];
                    break;
                }
            }

            if (data !== {}) {
                let temp = {
                    id: data.$.id,
                    name: data.$.name,
                    description: data.$.description,
                    out_price: data.$.out_price
                };

                let size_node = {};
                for (let i = 0; i < data.size.length; i++) {
                    if (data.size[i].$.id === tokens[3]) {
                        size_node = data.size[i];
                        break;
                    }
                }
                if (size_node !== {}) {
                    temp.size = size_node.$.id;
                    temp.color = [];

                    for (let i = 0; i < size_node.color.length; i++) {
                        let color_node = {
                            id: size_node.color[i].$.id,
                            name: size_node.color[i].$.name,
                            shops: []
                        };

                        let shop_node = size_node.color[i].shop;
                        shop_node.forEach(shop => {
                            let shop_name = '';

                            for(let j = 0; j < shop_list.length; j++) {
                                if (shop.$.id === shop_list[j].$.id) {
                                    shop_name = shop_list[j].$.name;
                                    break;
                                }
                            }

                            color_node.shops.push(shop_name);
                        });

                        temp.color.push(color_node);
                    }
                } else {
                    temp.size = '';
                }

                data = temp;
            }
        });

    let result_str = JSON.stringify(data);
    return result_str;
};

function get_new_trend_data() {
    let data = {
        news: [],
        trends: []
    };
    let parser = new xml2js.Parser();
    let product_list = [];
    fs.readdirSync(product_path + '/').forEach(dir => {
        let list = JSON.parse(get_product_list_guest(dir));
        list.forEach(element => {
            product_list.push(element);
        });
    });

    // TODO - Implement code here
    let file_path = path + '/new_trend/new_trend_product.xml';
    let file_content = fs.readFileSync(file_path, 'utf-8');
    parser.parseString(file_content, function (err, result) {
        let new_products = result.new_trend_product.new_product[0].item;
        let trend_products = result.new_trend_product.trend_product[0].item;
        
        new_products.forEach(product => {
            for (let i = 0; i < product_list.length; i++) {
                if (product.$.id === product_list[i].id) {
                    data.news.push(product_list[i]);
                    break;
                }
            }
        });

        trend_products.forEach(product => {
            for (let i = 0; i < product_list.length; i++) {
                if (product.$.id === product_list[i].id) {
                    data.trends.push(product_list[i]);
                    break;
                }
            }
        });
    });

    return data;
}

let new_trend_products = get_new_trend_data();

let get_home_guest = () => {
    let result_str = JSON.stringify(new_trend_products);
    return result_str;
};

module.exports = {
    get_home_guest: get_home_guest,
    get_product_list_guest: get_product_list_guest,
    get_product_guest: get_product_guest
};