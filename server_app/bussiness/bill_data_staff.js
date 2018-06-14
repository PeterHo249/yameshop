let fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let order_path = path + '/order';
let product_path = path + '/product';

let list_product = JSON.parse(read_all_file_product());

function find_name(id, type) {
    let parser = new xml2js.Parser();
    let _result;
    let file_path;
    let file_content;
    switch (type) {
        case "staff":
            file_path = path + '/staff/staff_list.xml';
            file_content = fs.readFileSync(file_path, 'utf-8');
            parser.parseString(file_content, function (err, result) {

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
            file_path = path + '/shop/shop_list.xml';
            file_content = fs.readFileSync(file_path, 'utf-8');
            parser.parseString(file_content, function (err, result) {

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
}

function read_all_file_product() {
    //read all file product
    let parser = new xml2js.Parser();
    let data = [];

    fs.readdirSync(product_path + '/').forEach(child_folder_level_0 => {

        fs.readdirSync(product_path + '/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan

            let file_path = product_path + '/' + child_folder_level_0 + '/' + child_folder_level_1 + '/xml/product_list.xml';
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
    });
    return JSON.stringify(data);
}

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

let get_list_order = (month,year,id_order) => {
    //read all file product
    let parser = new xml2js.Parser();
    let data = [];

    if(id_order!=undefined){
        fs.readdirSync(order_path + '/').forEach(child_folder_level_0 => {

            fs.readdirSync(order_path + '/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan
    
                let file_path = order_path + '/' + child_folder_level_0 + '/' + child_folder_level_1 + '/order_list.xml';
                let file_content = fs.readFileSync(file_path, 'utf-8');
    
                parser.parseString(file_content, function (err, result) {
                    let orders = result.order_list.order;
                    for (let i = 0; i < orders.length; i++) {

                        if (orders[i].$.id == id_order) {
                            let order_info = {
                                id: orders[i].$.id,
                                date: orders[i].$.date,
                                total: orders[i].$.total,
                                staff_id: orders[i].$.staff_id,
                                shop_id: orders[i].$.shop_id
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
                                node_item.sum_price = parseInt(temp.out_price)*orders[i].item[j].$.count;
                                order_info.list_item.push(node_item);
                            }
                            order_info.revenue = sumary;
                            data.push(order_info);
                        }
                           
                    }
                });
            });
        });
    }
    else if(year!=undefined&&month!=undefined){
        let file_path = order_path + '/' + year + '/' + month + '/order_list.xml';
        let file_content = fs.readFileSync(file_path, 'utf-8');
    
        parser.parseString(file_content, function (err, result) {
    
            let orders = result.order_list.order;
           
                for (let i = 0; i < orders.length; i++) {
                    if (orders[i].$.date.search(month + '/' + year) >= 0) {
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
    else if(year==undefined&&month!=undefined){
            fs.readdirSync(order_path + '/').forEach(child_folder_level_0 => { //cai nay duoc goi 2 lan
                fs.readdirSync(order_path + '/'+ child_folder_level_0+'/').forEach(child_folder_level_1 => {
                    if(child_folder_level_1==month){
                        let file_path = order_path + '/' + child_folder_level_0+ '/'+ child_folder_level_1 +'/order_list.xml';
                        let file_content = fs.readFileSync(file_path, 'utf-8');
            
                        parser.parseString(file_content, function (err, result) {
                            let orders = result.order_list.order;
                            for (let i = 0; i < orders.length; i++) {
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
                        });
                    }      
            });
    });
}
    else if(year!=undefined&&month==undefined){
        year = (year!=undefined)?(year+'/'):'';

            fs.readdirSync(order_path + '/' +year).forEach(child_folder => { //cai nay duoc goi 2 lan
    
                let file_path = order_path + '/' + year +child_folder +'/order_list.xml';
                let file_content = fs.readFileSync(file_path, 'utf-8');
    
                parser.parseString(file_content, function (err, result) {
                    let orders = result.order_list.order;
                    for (let i = 0; i < orders.length; i++) {
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
                });
            });
    }
    else if(year==undefined&&month==undefined){
        fs.readdirSync(order_path + '/').forEach(child_folder_level_0 => {

            fs.readdirSync(order_path + '/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan
    
                let file_path = order_path + '/' + child_folder_level_0 + '/' + child_folder_level_1 + '/order_list.xml';
                let file_content = fs.readFileSync(file_path, 'utf-8');
    
                parser.parseString(file_content, function (err, result) {
                    let orders = result.order_list.order;
                    for (let i = 0; i < orders.length; i++) {
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
                });
            });
        });
    }

    return JSON.stringify(data);
}


module.exports = {
    get_list_order: get_list_order
};