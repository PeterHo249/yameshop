/*jshint esversion: 6 */

let fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let order_path = path + '/order';
let product_path = path + '/product';

let bus = require('../bussiness/bussiness');

function find_name(id, type) {
    let parser = new xml2js.Parser();
    let _result;
    let file_path;
    let file_content;
    switch (type) {
        case "staff":
            let file_content_all_staff = bus.get_file_content_all_staff();
            parser.parseString(file_content_all_staff, function (err, result) {

                let staffs = result.staff_list.staff;
                for (let i = 0; i < staffs.length; i++) {
                    if (staffs[i].$.id == id) {
                        _result = staffs[i].$.name;
                        break;
                    }
                }
            });
            break;
        case "shop":
            let file_content_all_shop = bus.get_file_content_all_shop();
            parser.parseString(file_content_all_shop, function (err, result) {

                let shops = result.shop_list.shop;
                for (let i = 0; i < shops.length; i++) {
                    if (shops[i].$.id == id) {
                        _result = shops[i].$.name;
                        break;
                    }
                }
            });
            break;
        case "product":
            for (let k = 0; k < list_product.length; k++) {
                if (list_product[k].id == id) {
                    return {
                        "name": list_product[k].name,
                        "out_price": list_product[k].out_price
                    };
                }
            }
            break;
    }

    return _result;
} //change

function find_revenue(item) {
    let sumary = 0;
    for (let k = 0; k < list_product.length; k++) {
        if (list_product[k].id == item.$.id) {
            sumary += list_product[k].out_price * item.$.count;
            break;
        }
    }
    return sumary;
}

let get_list_order = (month, year, id_order) => {
    //read all file product
    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_order = bus.get_file_content_all_order();

    if (id_order != undefined) {
        for (let k = 0; k < file_content_all_order.length; k++) {
            parser.parseString(file_content_all_order[k].content, function (err, result) {
                let orders = result.order_list.order;
                for (let i = 0; i < orders.length; i++) {

                    if (orders[i].$.id == id_order && orders[i].$.type == 'out') {
                        let order_info = {
                            id: orders[i].$.id,
                            date: orders[i].$.date,
                            total: orders[i].$.total,
                            staff_id: orders[i].$.staff_id,
                            shop_id: orders[i].$.shop_id,
                            type: "out"
                        };

                        order_info.name_of_staff = find_name(orders[i].$.staff_id, "staff");
                        order_info.name_of_shop = find_name(orders[i].$.shop_id, "shop");
                        order_info.list_item = [];
                        let sumary = 0;
                        for (let j = 0; j < orders[i].item.length; j++) {
                            sumary += find_revenue(orders[i].item[j]);
                            let node_item = {
                                id: orders[i].item[j].$.id,
                                count: orders[i].item[j].$.count,
                            };
                            //tra xem san pham do la san pham nao
                            let temp = find_name(orders[i].item[j].$.id, "product");
                            node_item.name = temp.name;
                            node_item.price = temp.out_price;
                            node_item.sum_price = parseInt(temp.out_price) * orders[i].item[j].$.count;
                            order_info.list_item.push(node_item);
                        }
                        order_info.revenue = sumary;
                        data.push(order_info);
                    }

                }
            });
        }
    } else if (year != undefined && month != undefined) {

        for (let k = 0; k < file_content_all_order.length; k++) {
            parser.parseString(file_content_all_order[k].content, function (err, result) {
                let orders = result.order_list.order;
                for (let i = 0; i < orders.length; i++) {
                    tokens = orders[i].$.date.match(/([^/]+)/g);
                    if (tokens[1] == month && tokens[2] == year && orders[i].$.type == 'out') {
                        let order_info = {
                            id: orders[i].$.id,
                            date: orders[i].$.date,
                            total: orders[i].$.total,
                            type: "out"
                        };
                        let sumary = 0;
                        for (let j = 0; j < orders[i].item.length; j++) {
                            sumary += find_revenue(orders[i].item[j]);
                        }
                        order_info.revenue = sumary;
                        data.push(order_info);
                    }
                }
            });
        }
    } else if (year == undefined && month != undefined) {
        for (let k = 0; k < file_content_all_order.length; k++) {
            parser.parseString(file_content_all_order[k].content, function (err, result) {
                let orders = result.order_list.order;
                for (let i = 0; i < orders.length; i++) {
                    tokens = orders[i].$.date.match(/([^/]+)/g);
                    if (tokens[1] == month && orders[i].$.type == 'out') {
                        let order_info = {
                            id: orders[i].$.id,
                            date: orders[i].$.date,
                            total: orders[i].$.total
                        };
                        let sumary = 0;
                        for (let j = 0; j < orders[i].item.length; j++) {
                            sumary += find_revenue(orders[i].item[j]);
                        }
                        order_info.revenue = sumary;
                        data.push(order_info);
                    }
                }
            });
        }
    } else if (year != undefined && month == undefined) {

        for (let k = 0; k < file_content_all_order.length; k++) {
            parser.parseString(file_content_all_order[k].content, function (err, result) {
                let orders = result.order_list.order;
                for (let i = 0; i < orders.length; i++) {
                    tokens = orders[i].$.date.match(/([^/]+)/g);
                    if (tokens[2] == year && orders[i].$.type == 'out') {
                        let order_info = {
                            id: orders[i].$.id,
                            date: orders[i].$.date,
                            total: orders[i].$.total
                        };
                        let sumary = 0;
                        for (let j = 0; j < orders[i].item.length; j++) {
                            sumary += find_revenue(orders[i].item[j]);
                        }
                        order_info.revenue = sumary;
                        data.push(order_info);
                    }
                }
            });
        }
    } else if (year == undefined && month == undefined) {

        for (let k = 0; k < file_content_all_order.length; k++) {
            parser.parseString(file_content_all_order[k].content, function (err, result) {
                let orders = result.order_list.order;
                for (let i = 0; i < orders.length; i++) {
                    if (orders[i].$.type == 'out') {
                        let order_info = {
                            id: orders[i].$.id,
                            date: orders[i].$.date,
                            total: orders[i].$.total
                        };
                        let sumary = 0;
                        for (let j = 0; j < orders[i].item.length; j++) {
                            sumary += find_revenue(orders[i].item[j]);
                        }
                        order_info.revenue = sumary;
                        data.push(order_info);
                    }
                }
            });
        }
    }
    return JSON.stringify(data);
} //change

let get_product_list_staff = (category, brand) => {
    //read all file product
    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_product = bus.get_file_content_all_product();

    if (category != undefined && brand == undefined) {

        for (let k = 0; k < file_content_all_product.length; k++) {
            parser.parseString(file_content_all_product[k].content, function (err, result) {
                let products = result.product_list.product;
                for (let i = 0; i < products.length; i++) {
                    tokens = products[i].$.id.match(/([^_]+)/g);
                    if (category == tokens[0]) {
                        let product_info = {
                            id: products[i].$.id,
                            name: products[i].$.name,
                            out_price: products[i].$.out_price,
                            inventory_num: products[i].$.inventory_num
                        };

                        product_info.list_size = get_list_size_or_color(products[i].size, "size");
                        product_info.list_color = get_list_size_or_color(products[i].size[0].color);
                        data.push(product_info);
                    }
                }
            });
        }
    } else if (category == undefined && brand != undefined) {

        for (let k = 0; k < file_content_all_product.length; k++) {
            parser.parseString(file_content_all_product[k].content, function (err, result) {
                let products = result.product_list.product;
                for (let i = 0; i < products.length; i++) {
                    tokens = products[i].$.id.match(/([^_]+)/g);
                    if (brand == tokens[1]) {
                        let product_info = {
                            id: products[i].$.id,
                            name: products[i].$.name,
                            out_price: products[i].$.out_price,
                            inventory_num: products[i].$.inventory_num
                        };

                        product_info.list_size = get_list_size_or_color(products[i].size, "size");
                        product_info.list_color = get_list_size_or_color(products[i].size[0].color);
                        data.push(product_info);
                    }
                }
            });
        }
    } else if (category == undefined && brand == undefined) {

        for (let k = 0; k < file_content_all_product.length; k++) {
            parser.parseString(file_content_all_product[k].content, function (err, result) {
                let products = result.product_list.product;
                products.forEach(product => {
                    let product_info = {
                        id: product.$.id,
                        name: product.$.name,
                        out_price: product.$.out_price,
                        inventory_num: product.$.inventory_num
                    };

                    product_info.list_size = get_list_size_or_color(product.size, "size");
                    product_info.list_color = get_list_size_or_color(product.size[0].color);
                    data.push(product_info);
                });
            });
        }
    } else if (category != undefined && brand != undefined) {

        for (let k = 0; k < file_content_all_product.length; k++) {
            parser.parseString(file_content_all_product[k].content, function (err, result) {
                let products = result.product_list.product;
                for (let i = 0; i < products.length; i++) {
                    tokens = products[i].$.id.match(/([^_]+)/g);
                    if (category == tokens[0] && brand == tokens[1]) {
                        let product_info = {
                            id: products[i].$.id,
                            name: products[i].$.name,
                            out_price: products[i].$.out_price,
                            inventory_num: products[i].$.inventory_num
                        };

                        product_info.list_size = get_list_size_or_color(products[i].size, "size");
                        product_info.list_color = get_list_size_or_color(products[i].size[0].color);
                        data.push(product_info);
                    }
                }
            });
        }
    }
    return JSON.stringify(data);
} //changed

function get_list_size_or_color(data, type) {
    let result = [];
    if (type == "size") {
        for (let i = 0; i < data.length; i++) {
            result.push(data[i].$.id);
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            result.push(data[i].$.id);
        }
    }
    return result;
}

let get_product_staff = (product_id) => {
    let data = {};
    let parser = new xml2js.Parser();
    let shop_list = {};
    let file_content_all_shop = bus.get_file_content_all_shop();
    let file_content_all_product = bus.get_file_content_all_product();

    parser.parseString(file_content_all_shop, function (err, result) {
        shop_list = result.shop_list.shop;
    });

    // TODO - Implement code here
    let tokens = product_id.match(/([^_]+)/g);
    let id = tokens[0] + '_' + tokens[1] + '_' + tokens[2];
    for (let v = 0; v < file_content_all_product.length; v++) {
        if (file_content_all_product[v].content.search(id) > -1) {
            parser.parseString(file_content_all_product[v].content, function (err, result) {
                let products = result.product_list.product;
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
                        description: data.description[0],
                        out_price: data.$.out_price,
                        in_price: data.$.in_price,
                        inventory_num: data.$.inventory_num
                    };

                    temp.size_list = [];
                    for (let i = 0; i < data.size.length; i++) {
                        let _node = {
                            size: data.size[i].$.id,
                            color: []
                        };
                        for (let j = 0; j < data.size[i].color.length; j++) {

                            let color_node = {
                                id: data.size[i].color[j].$.id,
                                inventory_num: data.size[i].color[j].$.inventory_num,
                                name: data.size[i].color[j].$.name,
                                shops: []
                            }

                            for (let k = 0; k < data.size[i].color[j].shop.length; k++) {
                                let node_shop;
                                for (let l = 0; l < shop_list.length; l++) {
                                    if (data.size[i].color[j].shop[k].$.id === shop_list[l].$.id) {
                                        node_shop = {
                                            id: data.size[i].color[j].shop[k].$.id,
                                            name: shop_list[l].$.name,
                                            inventory_num: data.size[i].color[j].shop[k].$.inventory_num
                                        };
                                        break;
                                    }
                                }
                                color_node.shops.push(node_shop);
                            }

                            _node.color.push(color_node);
                        }
                        temp.size_list.push(_node);
                    }

                    data = temp;
                }
            });
        }
    }
    return JSON.stringify(data);
};

let list_product = JSON.parse(get_product_list_staff());

module.exports = {
    get_product_list_staff: get_product_list_staff,
    get_product_staff: get_product_staff,
    get_list_order: get_list_order
};