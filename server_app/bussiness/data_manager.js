/*jshint esversion: 6 */
let fs = require('fs');
let xml2js = require('xml2js');
var convert = require('xml-js');
let path = __dirname + '/../data';
let shop_list;
let list_product = '';
let staff_list='';
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

let bus = require('../bussiness/bussiness');

//PRODUCT
let get_all_product = () => {
    let parser = new xml2js.Parser();
    let data = [];
    let file_content_all_product = bus.get_file_content_all_product();
    for (let v = 0; v < file_content_all_product.length; v++) {
        parser.parseString(file_content_all_product[v].content, function (err, result) {
            let products = result.product_list.product;
            products.forEach(product => {
                let product_info = {
                    id: product.$.id,
                    name: product.$.name,
                    in_price: product.$.in_price,
                    out_price: product.$.out_price,
                    inventory_num: product.$.inventory_num,
                    in_stock: product.$.in_stock,
                    list_size: [],
                    list_color: []

                };
                get_list_color_or_size(product_info.list_size, product.size);
                get_list_color_or_size(product_info.list_color, product.size[0].color);
                data.push(product_info);
            });
        });
    }
    list_product = data;
    return JSON.stringify(data);
};

let get_product_detail = (product_id) => {

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
    for (let v = 0; v < file_content_all_product.length; v++) {
        let id = tokens[0] + '_' + tokens[1] + '_' + tokens[2];
        if (file_content_all_product[v].content.search(id) > -1) {
            parser.parseString(file_content_all_product[v].content, function (err, result) {
                let products = result.product_list.product;
                console.log("<<---------" + file_content_all_product[v].path);
                console.log('id: ' + id);
                for (let i = 0; i < products.length; i++) {
                    if (products[i].$.id == id) {
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
                        inventory_num: data.$.inventory_num,
                        in_stock: data.$.in_stock
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
                            };

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

function get_list_product_with_brand(brand) {

    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_product = bus.get_file_content_all_product();
    for (let v = 0; v < file_content_all_product.length; v++) {
        parser.parseString(file_content_all_product[v].content, function (err, result) {
            let products = result.product_list.product;
            for (let i = 0; i < products.length; i++) {
                tokens = products[i].$.id.match(/([^_]+)/g);
                if (brand == tokens[1]) {
                    let product_info = {
                        id: products[i].$.id,
                        name: products[i].$.name,
                        in_price: products[i].$.in_price,
                        out_price: products[i].$.out_price,
                        inventory_num: products[i].$.inventory_num,
                        in_stock: products[i].$.in_stock,
                        list_size: [],
                        list_color: []
                    };

                    get_list_color_or_size(product_info.list_size, products[i].size);
                    get_list_color_or_size(product_info.list_color, products[i].size[0].color);
                    data.push(product_info);
                }
            }
        });
    }
    return JSON.stringify(data);
}

function get_list_product_with_category(category) {

    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_product = bus.get_file_content_all_product();

    for (let v = 0; v < file_content_all_product.length; v++) {
        parser.parseString(file_content_all_product[v].content, function (err, result) {
            let products = result.product_list.product;
            for (let i = 0; i < products.length; i++) {
                tokens = products[i].$.id.match(/([^_]+)/g);
                if (category == tokens[0]) {
                    let product_info = {
                        id: products[i].$.id,
                        name: products[i].$.name,
                        in_price: products[i].$.in_price,
                        out_price: products[i].$.out_price,
                        inventory_num: products[i].$.inventory_num,
                        in_stock: products[i].$.in_stock,
                        list_size: [],
                        list_color: []
                    };

                    get_list_color_or_size(product_info.list_size, products[i].size);
                    get_list_color_or_size(product_info.list_color, products[i].size[0].color);
                    data.push(product_info);
                }
            }
        });
    }
    return JSON.stringify(data);
}

function get_list_product_with_category_and_brand(category, brand) {
    let parser = new xml2js.Parser();
    let data = [];
    let tokens;

    let file_content_all_product = bus.get_file_content_all_product();
    for (let v = 0; v < file_content_all_product.length; v++) {
        parser.parseString(file_content_all_product[v].content, function (err, result) {
            let products = result.product_list.product;

            for (let i = 0; i < products.length; i++) {
                tokens = products[i].$.id.match(/([^_]+)/g);
                if (category == tokens[0] && brand == tokens[1]) {
                    let product_info = {
                        id: products[i].$.id,
                        name: products[i].$.name,
                        in_price: products[i].$.in_price,
                        out_price: products[i].$.out_price,
                        inventory_num: products[i].$.inventory_num,
                        in_stock: products[i].$.in_stock,
                        list_size: [],
                        list_color: []
                    };

                    get_list_color_or_size(product_info.list_size, products[i].size);
                    get_list_color_or_size(product_info.list_color, products[i].size[0].color);
                    data.push(product_info);
                }
            }
        });
    }
    return JSON.stringify(data);
}

function get_list_color_or_size(node_json, node_content, type) {
    for (let i = 0; i < node_content.length; i++) {
        node_json.push(node_content[i].$.id);
    }
}

let get_product_list = (category, brand) => {

    let result;
    if (category == undefined && brand == undefined) {
        result = get_all_product();
    } else if (category != undefined && brand == undefined) {
        result = get_list_product_with_category(category);
    } else if (category == undefined && brand != undefined) {
        result = get_list_product_with_brand(brand);
    } else if (category != undefined && brand != undefined) {
        result = get_list_product_with_category_and_brand(category, brand);
    }
    return result;
};
//END PRODUCT
//SHOP
let get_all_shop = () => {

    let parser = new xml2js.Parser();
    let data = [];
    let file_content_all_shop = bus.get_file_content_all_shop();

    parser.parseString(file_content_all_shop, function (err, result) {
        let shops = result.shop_list.shop;
        shops.forEach(shop => {
            let shop_info = {
                id: shop.$.id,
                name: shop.$.name,
                address: shop.$.address
            };
            data.push(shop_info);
        });
    });
    shop_list = data;
    return JSON.stringify(data);
};

function find_shop_name(idShop) {
    if (shop_list == undefined) {
        get_all_shop();
    }
    for (let i = 0; i < shop_list.length; i++) {
        if (shop_list[i].id == idShop) {
            return shop_list[i].name;
        }
    }
}
let get_shop_detail = (id)=>{
    let parser = new xml2js.Parser();
    let data;
    let file_content_all_shop = bus.get_file_content_all_shop();

    parser.parseString(file_content_all_shop, function (err, result) {
        let shops = result.shop_list.shop;
        shops.forEach(shop => {
            if(shop.$.id==id){
                data = {
                    id: shop.$.id,
                    name: shop.$.name,
                    address: shop.$.address
                };
                data.list_staff = [];
                if(staff_list==''){
                    get_all_staff();
                }
                for(let i=0;i<staff_list.length;i++){
                    if(staff_list[i].shop_name==shop.$.name){
                        let staff_info = {
                            id: staff_list[i].id,
                            name: staff_list[i].name
                        }
                        data.list_staff.push(staff_info);
                    }
                }
                return JSON.stringify(data);
            }
        });
    });
    return JSON.stringify(data);
}
//END SHOP
//STAFF
let get_all_staff = () => {

    let parser = new xml2js.Parser();
    let data = [];
    let file_content_all_staff = bus.get_file_content_all_staff();

    parser.parseString(file_content_all_staff, function (err, result) {
        let staffs = result.staff_list.staff;
        staffs.forEach(staff => {
            let staff_info = {
                id: staff.$.id,
                name: staff.$.name,
                role: staff.$.role,
                user_name: staff.$.username,
                password: staff.$.password
            };
            staff_info.shop_name = find_shop_name(staff.$.shop);
            data.push(staff_info);
        });
    });
    staff_list = data;
    console.log('>>>>>>>>>>>'+staff_list.length);
    return JSON.stringify(data);
};
let get_staff_detail = (id)=>{
    let parser = new xml2js.Parser();
    let data;
    let file_content_all_staff = bus.get_file_content_all_staff();

    parser.parseString(file_content_all_staff, function (err, result) {
        let staffs = result.staff_list.staff;
        staffs.forEach(staff => {
            if(staff.$.id == id){
                data = {
                    id: staff.$.id,
                    name: staff.$.name,
                    role: staff.$.role,
                    user_name: staff.$.username,
                    password: staff.$.password
                };
                data.shop_name = find_shop_name(staff.$.shop);
                return JSON.stringify(data);
            }
        });
    });
    return JSON.stringify(data);
}
//END STAFF
//ORDER
let get_order_list = (month, year) => {
    let result;
    if (month == undefined && year == undefined) {
        result = get_all_order();
    } else if (month != undefined && year == undefined) {
        result = get_list_order_with_month(month);
    } else if (month == undefined && year != undefined) {
        result = get_list_order_with_year(year);
    } else if (month != undefined && year != undefined) {
        result = get_list_order_with_month_and_year(month, year);
    }
    return result;
};

let get_all_order = () => {
    let parser = new xml2js.Parser();
    let data = [];
    let file_content_all_order = bus.get_file_content_all_order();

    for (let k = 0; k < file_content_all_order.length; k++) {
        parser.parseString(file_content_all_order[k].content, function (err, result) {
            let orders = result.order_list.order;
            for (let i = 0; i < orders.length; i++) {
                let order_info = {
                    id: orders[i].$.id,
                    date: orders[i].$.date,
                    sum_in_price: orders[i].$.total,
                    type: orders[i].$.type
                };
                let revenue = 0;
                let sum_count = 0;
                for (let j = 0; j < orders[i].item.length; j++) {
                    revenue += find_revenue(orders[i].item[j]);
                    sum_count += parseInt(orders[i].item[j].$.count);
                }
                order_info.sum_count = sum_count;
                order_info.revenue = revenue;
                data.push(order_info);
            }
        });
    }
    return JSON.stringify(data);
};

function get_list_order_with_month(month) {
    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_order = bus.get_file_content_all_order();
    for (let k = 0; k < file_content_all_order.length; k++) {
        parser.parseString(file_content_all_order[k].content, function (err, result) {
            let orders = result.order_list.order;

            for (let i = 0; i < orders.length; i++) {
                tokens = orders[i].$.date.match(/([^/]+)/g);
                if (tokens[1] == month) {

                    let order_info = {
                        id: orders[i].$.id,
                        date: orders[i].$.date,
                        sum_in_price: orders[i].$.total,
                        type: orders[i].$.type
                    };
                    let revenue = 0;
                    let sum_count = 0;
                    for (let j = 0; j < orders[i].item.length; j++) {
                        revenue += find_revenue(orders[i].item[j]);
                        sum_count += parseInt(orders[i].item[j].$.count);
                    }
                    order_info.sum_count = sum_count;
                    order_info.revenue = revenue;
                    data.push(order_info);
                }
            }
        });
    }
    return JSON.stringify(data);
}

function get_list_order_with_year(year) {

    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_order = bus.get_file_content_all_order();
    for (let k = 0; k < file_content_all_order.length; k++) {
        parser.parseString(file_content_all_order[k].content, function (err, result) {
            let orders = result.order_list.order;
            for (let i = 0; i < orders.length; i++) {
                tokens = orders[i].$.date.match(/([^/]+)/g);
                if (tokens[2] == year) {
                    let order_info = {
                        id: orders[i].$.id,
                        date: orders[i].$.date,
                        sum_in_price: orders[i].$.total,
                        type: orders[i].$.type
                    };
                    let revenue = 0;
                    let sum_count = 0;
                    for (let j = 0; j < orders[i].item.length; j++) {
                        revenue += find_revenue(orders[i].item[j]);
                        sum_count += parseInt(orders[i].item[j].$.count);
                    }
                    order_info.sum_count = sum_count;
                    order_info.revenue = revenue;
                    data.push(order_info);
                }

            }
        });
    }
    return JSON.stringify(data);
}

function get_list_order_with_month_and_year(month, year) {

    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_order = bus.get_file_content_all_order();
    for (let k = 0; k < file_content_all_order.length; k++) {
        parser.parseString(file_content_all_order[k].content, function (err, result) {
            let orders = result.order_list.order;
            for (let i = 0; i < orders.length; i++) {
                tokens = orders[i].$.date.match(/([^/]+)/g);
                if (tokens[1] == month && tokens[2] == year) {
                    let order_info = {
                        id: orders[i].$.id,
                        date: orders[i].$.date,
                        sum_in_price: orders[i].$.total,
                        type: orders[i].$.type
                    };
                    let revenue = 0;
                    let sum_count = 0;
                    for (let j = 0; j < orders[i].item.length; j++) {
                        revenue += find_revenue(orders[i].item[j]);
                        sum_count += parseInt(orders[i].item[j].$.count);
                    }
                    order_info.sum_count = sum_count;
                    order_info.revenue = revenue;
                    data.push(order_info);
                }
            }
        });
    }
    return JSON.stringify(data);
}

let get_order_detail = (id_order) => {
    //read all file product
    let parser = new xml2js.Parser();
    let data = [];
    let tokens;
    let file_content_all_order = bus.get_file_content_all_order();
    for (let k = 0; k < file_content_all_order.length; k++) {
        parser.parseString(file_content_all_order[k].content, function (err, result) {
            let orders = result.order_list.order;
            for (let i = 0; i < orders.length; i++) {

                if (orders[i].$.id == id_order) {
                    let order_info = {
                        id: orders[i].$.id,
                        date: orders[i].$.date,
                        staff_id: orders[i].$.staff_id,
                        shop_id: orders[i].$.shop_id,
                        type: orders[i].$.type,
                        sum_in_price: orders[i].$.total
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
                        console.log('' + temp + '/' + orders[i].item[j].$.id);
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
    return JSON.stringify(data);
};

function find_revenue(item) {
    if (list_product == '') {
        get_all_product();
    }
    for (let k = 0; k < list_product.length; k++) {
        if (list_product[k].id == item.$.id) {
            return list_product[k].out_price * item.$.count;
        }
    }
}

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
                    console.log(id);
                    return {
                        "name": list_product[k].name,
                        "out_price": list_product[k].out_price
                    };
                }
            }
            break;
    }

    return _result;
}
//END ORDER

module.exports = {
    get_all_shop: get_all_shop,
    get_shop_detail: get_shop_detail,
    get_all_staff: get_all_staff,
    get_product_list: get_product_list,
    get_product_detail: get_product_detail,
    get_order_detail: get_order_detail,
    get_order_list: get_order_list,
    get_staff_detail:get_staff_detail
};