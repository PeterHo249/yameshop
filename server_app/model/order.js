let fs = require('fs');
let xml2js = require('xml2js');
let path = __dirname + '/../data';

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xmlns_v = "urn:v";
var Node_goc = new DOMParser().parseFromString("<Du_lieu />", "text/xml");

let read_all_file_order = () => {
    let result = [];
    fs.readdirSync(path + '/order/').forEach(child_folder_level_0 => {

        fs.readdirSync(path + '/order/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan

            let file_path = path + '/order/' + child_folder_level_0 + '/' + child_folder_level_1 + '/order_list.xml';
            let file_content = fs.readFileSync(file_path, 'utf-8');
            result.push({path:file_path,content:file_content});
        });
    });

    return result;
}

let add_new_order = (obj, xml_order) => {

    let order = Node_goc.createElementNS(xmlns_v, "order");
    order.setAttributeNS(xmlns_v, "date", obj.date);
    order.setAttributeNS(xmlns_v, "id", obj.id);
    order.setAttributeNS(xmlns_v, "shop_id", obj.shop_id);
    order.setAttributeNS(xmlns_v, "staff_id", obj.staff_id);
    order.setAttributeNS(xmlns_v, "total", obj.total);
    order.setAttributeNS(xmlns_v, "type", obj.type);

    let item_json = obj.list_item;
    for (let j = 0; j < item_json.length; j++) {
        let item_xml = Node_goc.createElementNS(xmlns_v, "item");
        item_xml.setAttributeNS(xmlns_v, "count", item_json[j].count);
        item_xml.setAttributeNS(xmlns_v, "id", item_json[j].id);
        order.appendChild(item_xml);
    }
    for(let i=0;i<xml_order.length;i++){
        let tokens = obj.date.match(/([^/]+)/g);
        if(xml_order[i].path==path+ '/order/' + tokens[2] + '/' + tokens[1] + '/order_list.xml'){
            xml_order[i].content.insertBefore(order, xml_order[i].content.getElementsByTagName('order')[0]);
            break;
        }
    }
}

function update_file(xml_order) {
    for(let i=0;i<xml_order.length;i++){
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


let change_info_order = (obj, xml_order) => {
    let flag=false;
    for(let k=0;k<xml_order.length;k++){
        let danhSachOrder = xml_order[k].content.getElementsByTagName('order');
        for (let i = 0; i < danhSachOrder.length; i++) {
            if (danhSachOrder[i].getAttribute('id') == obj.id) { //replace node
                let order = Node_goc.createElementNS(xmlns_v, "order");
                order.setAttributeNS(xmlns_v, "date", obj.date);
                order.setAttributeNS(xmlns_v, "id", obj.id);
                order.setAttributeNS(xmlns_v, "shop_id", obj.shop_id);
                order.setAttributeNS(xmlns_v, "staff_id", obj.staff_id);
                order.setAttributeNS(xmlns_v, "total", obj.total);
                order.setAttributeNS(xmlns_v, "type", obj.type);
    
                let item_json = obj.list_item;
                for (let j = 0; j < item_json.length; j++) {
                    let item_xml = Node_goc.createElementNS(xmlns_v, "item");
                    item_xml.setAttributeNS(xmlns_v, "count", item_json[j].count);
                    item_xml.setAttributeNS(xmlns_v, "id", item_json[j].id);
                    order.appendChild(item_xml);
                }
                xml_order[k].content.replaceChild(order, danhSachOrder[i]);
                flag==true;
                break;
            }
        }
        if(flag==true){
            break;
        }
    }
}

let delete_order = (id, xml_order) => {
    let flag=false;
    for(let k=0;k<xml_order.length;k++){
        let danhSachOrder = xml_order[k].content.getElementsByTagName('order');
        for (let i = 0; i < danhSachOrder.length; i++) {
            if (danhSachOrder[i].getAttribute('id') == id) {
                var y = danhSachOrder[i];
                xml_order[k].content.removeChild(y);
                flag==true;
                break;
            }
        }
        if(flag==true){
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