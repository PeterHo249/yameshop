/*jshint esversion: 6 */

let fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let product_path = path + '/product';

let get_product_list_staff = (category, brand) => {
    let data;
    // if (brand === undefined) {
    //     fs.readdirSync(product_path + '/' + category + '/').forEach(dir => {
    //        data = insert_data_to_list(dir,category);
    //     });
    // } else {
       data = insert_data_to_list(brand,category);
    // }
    return data;
};
function get_list_size_or_color(data,type){
    let result = [];
    if(type=="size"){
        for(let i=0;i<data.length;i++){
            result.push(data[i].$.id);        
        }
    }else{
        for(let i=0;i<data.length;i++){
            result.push(data[i].$.name);        
        }
    }   
    return result;
}
function insert_data_to_list(brand,category){
    let parser = new xml2js.Parser();
    let data = [];
    if(category==undefined) category='';
    let file_path = product_path + '/' + category + '/' + brand + '/xml/product_list.xml';
    let file_content = fs.readFileSync(file_path, 'utf-8');

    parser.parseString(file_content, function (err, result) {
        let products = result.product_list.product;
        products.forEach(product => {
            let product_info = {
                    id: product.$.id,
                    name: product.$.name,
                    out_price: product.$.out_price,
                    inventory_num: product.$.inventory_num};

                product_info.list_size = get_list_size_or_color(product.size,"size");
                product_info.list_color = get_list_size_or_color(product.size[0].color);
            data.push(product_info);
        });
    });
    return JSON.stringify(data);
}
let get_product_staff = (product_id) => {
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
                    description: data.description[0],
                    out_price: data.$.out_price,
                    in_price: data.$.in_price,
                    inventory_num: data.$.inventory_num
                };

                temp.size_list = [];
                for (let i = 0; i < data.size.length; i++) {
                    let _node = {size: data.size[i].$.id, color: []};
                    for(let j=0;j<data.size[i].color.length; j++){

                        let color_node = {id:data.size[i].color[j].$.id,
                                          inventory_num:data.size[i].color[j].$.inventory_num,
                                          name:data.size[i].color[j].$.name,
                                          shops: []}

                        for(let k=0;k<data.size[i].color[j].shop.length; k++){
                            let node_shop;
                                for(let l = 0; l < shop_list.length; l++) {                         
                                    if (data.size[i].color[j].shop[k].$.id === shop_list[l].$.id) {
                                        node_shop = {id: data.size[i].color[j].shop[k].$.id,
                                            name: shop_list[l].$.name,
                                            inventory_num: data.size[i].color[j].shop[k].$.inventory_num};
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

    let result_str = JSON.stringify(data);
    return result_str;
};

module.exports = {
    get_product_list_staff: get_product_list_staff,
    get_product_staff: get_product_staff
};