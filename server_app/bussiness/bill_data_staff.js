let fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let bill_path = path + '/bill';
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


let get_list_bill = (month, year, id_bill) => {
    //read all file product
    let parser = new xml2js.Parser();
    let data = [];

    let file_path = bill_path + '/' + year + '/' + month + '/bill_list.xml';
    let file_content = fs.readFileSync(file_path, 'utf-8');

    parser.parseString(file_content, function (err, result) {

        let bills = result.bill_list.bill;
        if (id_bill != undefined) {
            for (let i = 0; i < bills.length; i++) {
                if (bills[i].$.id == id_bill) {
                    let bill_info = {
                        id: bills[i].$.id,
                        date: bills[i].$.date,
                        total: bills[i].$.total,
                        staff_id: bills[i].$.staff_id,
                        shop_id: bills[i].$.shop_id
                    };

                    bill_info.name_of_staff = find_name(bills[i].$.staff_id, "staff");
                    bill_info.name_of_shop = find_name(bills[i].$.shop_id, "shop");
                    bill_info.list_item = [];
                    let sumary = 0;
                    for (let j = 0; j < bills[i].item.length; j++) {
                        sumary += find_revenue(bills[i].item[j]);
                        let node_item = {
                            id: bills[i].item[j].$.id,
                            count: bills[i].item[j].$.count,
                        };
                        //tra xem san pham do la san pham nao
                        let temp = find_name(bills[i].item[j].$.id, "product");
                        node_item.name = temp.name;
                        node_item.price = temp.out_price;
                        node_item.sum_price = parseInt(temp.out_price)*bills[i].item[j].$.count;
                        bill_info.list_item.push(node_item);
                    }
                    bill_info.revenue = sumary;
                    data.push(bill_info);
                }
            }
        } else {
            for (let i = 0; i < bills.length; i++) {
                if (bills[i].$.date.search(month + '/' + year) >= 0) {
                    let bill_info = {
                        id: bills[i].$.id,
                        date: bills[i].$.date,
                        total: bills[i].$.total
                    };
                    let sumary = 0;
                    for (let j = 0; j < bills[i].item.length; j++) {
                        sumary += find_revenue(bills[i].item[j]);
                    }
                    bill_info.revenue = sumary;
                    data.push(bill_info);
                }
            }
        }
    });

    return JSON.stringify(data);
}

module.exports = {
    get_list_bill: get_list_bill
};