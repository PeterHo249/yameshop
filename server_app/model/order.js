let fs = require('fs');
let xml2js = require('xml2js');
let path = __dirname + '/../data';

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xmlns_v = "urn:v";
var Node_goc = new DOMParser().parseFromString("<Du_lieu />", "text/xml");
let temp_id = 100;

let read_all_file_order = () => {
    let result = [];
    fs.readdirSync(path + '/order/').forEach(child_folder_level_0 => {

        fs.readdirSync(path + '/order/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan

            let file_path = path + '/order/' + child_folder_level_0 + '/' + child_folder_level_1 + '/order_list.xml';
            let file_content = fs.readFileSync(file_path, 'utf-8');
            result.push({
                path: file_path,
                content: file_content
            });
        });
    });

    return result;
}

// let change_id = (xml_order)=>{
//     let sl = 0;
//     for(let i=0;i<xml_order.length;i++){
//         for(let j=0;j< xml_order[i].content.getElementsByTagName('order').length;j++){
//             xml_order[i].content.getElementsByTagName('order')[j].setAttribute('id',sl);
//             sl++;
//         }
//     }
// }


let add_new_order = (obj, xml_order) => {

    let order = Node_goc.createElementNS(xmlns_v, "order");
    order.setAttributeNS(xmlns_v, "date", obj.date);
    order.setAttributeNS(xmlns_v, "id", temp_id);
    order.setAttributeNS(xmlns_v, "shop_id", obj.shop_id);
    order.setAttributeNS(xmlns_v, "staff_id", obj.staff_id);
    order.setAttributeNS(xmlns_v, "total", obj.total); //tam thoi chua tinh toan total
    order.setAttributeNS(xmlns_v, "type", obj.type);

    let item_json = obj.list_item;
    for (let j = 0; j < item_json.length; j++) {
        let item_xml = Node_goc.createElementNS(xmlns_v, "item");
        item_xml.setAttributeNS(xmlns_v, "count", item_json[j].count);
        item_xml.setAttributeNS(xmlns_v, "id", item_json[j].id);
        order.appendChild(item_xml);
    }
    for (let i = 0; i < xml_order.length; i++) {
        let tokens = obj.date.match(/([^/]+)/g);
        if (xml_order[i].path == path + '/order/' + tokens[2] + '/' + tokens[1] + '/order_list.xml') {
            xml_order[i].content.insertBefore(order, xml_order[i].content.getElementsByTagName('order')[0]);
            break;
        }
    }
    temp_id++;
}

function update_file(xml_order) {
    for (let i = 0; i < xml_order.length; i++) {
        var temp = new XMLSerializer().serializeToString(xml_order[i].content); //chuyen sang dang chuoi
        fs.writeFile(xml_order[i].path, temp, err => {
            if (err != null) {
                console.log("--> Cannot write data to file");
            } else {
                console.log("--> Write data to file successfully! <--");
            }
        });
    }
}

function update_total(id, xml_order) {

    let result = 0;

    return result;
}
let change_info_order = (obj, xml_order,xml_product) => {
    let flag = false;
    for (let k = 0; k < xml_order.length; k++) {
        let danhSachOrder = xml_order[k].content.getElementsByTagName('order');
        for (let i = 0; i < danhSachOrder.length; i++) {
            
            if (danhSachOrder[i].getAttribute('id') == obj.id) {
                if (obj.shop_id != undefined) {
                    danhSachOrder[i].setAttribute("shop_id", obj.shop_id);
                }
                if (obj.staff_id != undefined) {
                    danhSachOrder[i].setAttribute("staff_id", obj.staff_id);
                }
                let danhSachItem = danhSachOrder[i].getElementsByTagName('item');
                for (let v = 0; v < danhSachItem.length; v++) {
                    let item_json = obj.list_item;
                    for (let j = 0; j < item_json.length; j++) {
                        if (item_json[j].id == danhSachItem[v].getAttribute('id')) {
                            let chenh_lech = parseInt(danhSachItem[v].getAttribute('count')) - parseInt(item_json[j].count);
                            // console.log('>>>'+parseInt(danhSachOrder[i].getAttribute('total'))+'/'+chenh_lech*out_price(item_json[j].id,xml_product));
                            danhSachOrder[i].setAttribute('total',parseInt(danhSachOrder[i].getAttribute('total')) +chenh_lech*out_price(item_json[j].id,xml_product));
                            danhSachItem[v].setAttribute("count", item_json[j].count);
                            break;
                        }
                    }
                }
                flag == true;
                break;
            }
        }
        if (flag == true) {
            break;
        }
    }
}


function out_price(id,xml_product) {
    let tokenObj;
    let result = 0;

    for (let j = 0; j < xml_product.length; j++) {
        tokenObj = id.match(/([^_]+)/g);
        let strSearch = tokenObj[0] + '/' + tokenObj[1];
        if (xml_product[j].path.search(strSearch) > -1) {
            let danhSachProduct = xml_product[j].content.getElementsByTagName('product');
            for (let k = 0; k < danhSachProduct.length; k++) {
                if (danhSachProduct[k].getAttribute('id') == id) {
                    return parseInt(danhSachProduct[k].getAttribute('out_price'));
                }
            }
        }
    }
}

let delete_order = (id, xml_order) => {
    let flag = false;
    for (let k = 0; k < xml_order.length; k++) {
        let danhSachOrder = xml_order[k].content.getElementsByTagName('order');
        for (let i = 0; i < danhSachOrder.length; i++) {
            if (danhSachOrder[i].getAttribute('id') == id) {
                var y = danhSachOrder[i];
                xml_order[k].content.removeChild(y);
                flag == true;
                break;
            }
        }
        if (flag == true) {
            break;
        }
    }
}

module.exports = {
    read_all_file_order: read_all_file_order,
    add_new_order: add_new_order,
    change_info_order: change_info_order,
    delete_order: delete_order,
    update_file
}