/*jshint esversion: 6 */

let JSONWebToken = require('jsonwebtoken');
let cookie = require('cookie');
let data = require('./data');

let token_key = 'key for yameshop';
let sessions = [];

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

let model_product = require('../model/product');
let model_shop = require('../model/shop');
let model_order = require('../model/order');
let model_staff = require('../model/staff');

let file_content_all_product = model_product.read_all_file_product();
let file_content_all_staff = model_staff.read_file_staff();
let file_content_all_shop = model_shop.read_file_shop();
let file_content_all_order = model_order.read_all_file_order();

// let xml_product = new DOMParser().parseFromString(file_content_all_product, "text/xml").documentElement;
let xml_shop = new DOMParser().parseFromString(file_content_all_shop, "text/xml").documentElement;
let xml_staff = new DOMParser().parseFromString(file_content_all_staff, "text/xml").documentElement;
// let xml_order = new DOMParser().parseFromString(file_content_all_order, "text/xml").documentElement;

let xml_product = arr_string_to_arr_xml(file_content_all_product);
let xml_order = arr_string_to_arr_xml(file_content_all_order);

function arr_string_to_arr_xml(file_content_all_type){

    let result = [];
    for(let i=0;i<file_content_all_type.length;i++){
        let temp = new DOMParser().parseFromString(file_content_all_type[i].content, "text/xml").documentElement;
        result.push({path:file_content_all_type[i].path,content:temp});
    }
    return result;
}
function arr_xml_to_arr_string(xml_data){

    let result = [];
    for(let i=0;i<xml_data.length;i++){
        let temp = new XMLSerializer().serializeToString(xml_data[i].content);
        result.push({path:xml_data[i].path,content:temp});
    }
    return result;
}
//SHOP
let get_file_content_all_shop = () =>{
    return file_content_all_shop;
}
let add_new_shop = (id,name,address) =>{
    model_shop.add_new_shop(id,name,address,xml_shop);
    file_content_all_shop = new XMLSerializer().serializeToString(xml_shop);
    console.log(file_content_all_shop);
}
let change_info_shop = (id,name,address)=>{
    model_shop.change_info_shop(id,name,address,xml_shop);
    file_content_all_shop = new XMLSerializer().serializeToString(xml_shop);
    console.log(file_content_all_shop);
}
let delete_shop = (id) =>{
    model_shop.delete_shop(id,xml_shop);
    file_content_all_shop = new XMLSerializer().serializeToString(xml_shop);
    console.log(file_content_all_shop);
}
//END SHOP
//ORDER
function total_out_price (obj){
    let tokenObj;
    let result = 0;
   
    for(let j=0;j<xml_product.length;j++){
        for(let i=0;i<obj.list_item.length;i++){
            tokenObj = obj.list_item[i].id.match(/([^_]+)/g);
            let strSearch = tokenObj[0]+'/'+tokenObj[1];
            if(xml_product[j].path.search(strSearch)>-1){
                let danhSachProduct = xml_product[j].content.getElementsByTagName('product');
                for(let k=0;k<danhSachProduct.length;k++){
                    if(danhSachProduct[k].getAttribute('id')==tokenObj[0]+'_'+tokenObj[1]+'_'+tokenObj[2]){
                       result += parseInt(danhSachProduct[k].getAttribute('out_price'))*parseInt(obj.list_item[i].count);
                    }
                }
            }
        }
    }
    obj.total = result;
}

let get_file_content_all_order = () =>{
    return file_content_all_order;
}
let add_new_order = (obj) => {
    total_out_price(obj);
    model_order.add_new_order(obj,xml_order);
    file_content_all_order = arr_xml_to_arr_string(xml_order);
}
let change_info_order = (obj) => {
    model_order.change_info_order(obj,xml_order,xml_product);
    file_content_all_order = arr_xml_to_arr_string(xml_order);
}
let delete_order = (id) => {
    model_order.delete_order(id,xml_order);
    file_content_all_order = arr_xml_to_arr_string(xml_order);
}
//END ORDER
//PRODUCT
let get_file_content_all_product = () =>{
    return file_content_all_product;
}
let delete_product = (id) => {
    model_product.delete_product(id,xml_product);
    file_content_all_product = arr_xml_to_arr_string(xml_product);
    model_product.update_file(file_content_all_product);
}
let change_info_product = (obj)=>{
    model_product.change_info_product(obj,xml_product);
    file_content_all_product = arr_xml_to_arr_string(xml_product);
    model_product.update_file(file_content_all_product);
}
//END PRODUCT
//STAFF
let get_file_content_all_staff = () =>{
    return file_content_all_staff;
}
let add_new_staff = (name, role, username, password, shop) => {
    model_staff.add_new_staff(name, role, username, password, shop, xml_staff);
    file_content_all_staff = new XMLSerializer().serializeToString(xml_staff);
}
let change_info_staff = (id, name, role, username, password, shop) => {
    model_staff.change_info_staff(id, name, role, username, password, shop, xml_staff);
    file_content_all_staff = new XMLSerializer().serializeToString(xml_staff);
}
let delete_staff = (id) => {
    model_staff.delete_staff(id,xml_staff);
    file_content_all_staff = new XMLSerializer().serializeToString(xml_staff);
}
//END STAFF
let update_all_file = () =>{
    model_order.update_file(xml_order);
    model_staff.update_file(xml_staff);
    model_shop.update_file(xml_shop);
}

// return false if not login
// return role of user: staff or manager
let isLogedIn = function (token) {
    for (let i = 0; i < sessions.length; i++) {
        if (token === sessions[i]) {
            let user = JSONWebToken.verify(token, token_key);
            return user.role;
        }
    }
    return false;
};

let isAuth = function (req, role) {
    if (req.headers['cookie'] === undefined) {
        return false;
    }

    let cookies = cookie.parse(req.headers['cookie']);
    let token = cookies.usertoken;

    let user_role = isLogedIn(token);

    if (!user_role) {
        return false;
    }

    return user_role === role;
};

// Log In request
let logIn = function (username, password) {
    let accounts = data.get_account_list();
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].username === username && accounts[i].password === password) {
            let info = accounts[i];
            info.date = Date();
            let token = JSONWebToken.sign(info, token_key);
            sessions.push(token);
            return token;
        }
    }
    return false;
};

let logOut = function (token) {
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i] === token) {
            sessions.slice(i, 1);
        }
    }
};

function extractPostBody(req, callback) {
    const FORM_URLENCODED = 'text/plain;charset=UTF-8';
    console.log(req.headers['content-type']);
    if (req.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            callback(JSON.parse(body));
        });
    } else {
        return callback(null);
    }
}

module.exports = {
    isLogedIn: isLogedIn,
    logIn: logIn,
    logOut: logOut,
    extractPostBody: extractPostBody,
    isAuth: isAuth,
    get_file_content_all_order: get_file_content_all_order,
    add_new_order:add_new_order,
    change_info_order:change_info_order,
    delete_order:delete_order,
    get_file_content_all_product: get_file_content_all_product,
    delete_product,
    get_file_content_all_shop: get_file_content_all_shop,
    add_new_shop,
    change_info_shop,
    delete_shop,
    get_file_content_all_staff: get_file_content_all_staff,
    add_new_staff,
    change_info_staff,
    delete_staff,
    update_all_file:update_all_file,
    change_info_product:change_info_product
};