let fs = require('fs');
let xml2js = require('xml2js');
let path = __dirname + '/../data';
let list_folder;

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xmlns_v = "urn:v";
var Node_goc = new DOMParser().parseFromString("<Du_lieu />", "text/xml");

let read_all_file_order = () => {
    list_folder = [];
    let result = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><order_list>';
    fs.readdirSync(path + '/order/').forEach(child_folder_level_0 => {

        fs.readdirSync(path + '/order/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan

            let file_path = path + '/order/' + child_folder_level_0 + '/' + child_folder_level_1 + '/order_list.xml';
            list_folder.push({"path":file_path});
            let file_content = fs.readFileSync(file_path, 'utf-8');
            file_content = file_content.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
            file_content = file_content.replace('<order_list>', '');
            file_content = file_content.replace('</order_list>', '');
            result += file_content;
        });
    });

    return result + '</order_list>';
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

    xml_order.insertBefore(order, xml_order.getElementsByTagName('order')[0]);
}

function update_file(xml_order) {
    var temp = new XMLSerializer().serializeToString(xml_order); //chuyen sang dang chuoi
    for(let i=0;i<list_folder.length;i++){
        fs.writeFile(list_folder[i].path, temp, err => {
            if (err != null) {
                console.log("--> Cannot write data to file");
            } else {
                console.log("--> Write data to file successfully! <--");
            }
        });
    }
}


let change_info_order = (obj, xml_order) => {
    let danhSachOrder = xml_order.getElementsByTagName('order');
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
            xml_order.replaceChild(order, danhSachOrder[i]);
            break;
        }
    }
}

let delete_order = (id, xml_order) => {
    let danhSachOrder = xml_order.getElementsByTagName('order');
    for (let i = 0; i < danhSachOrder.length; i++) {
        if (danhSachOrder[i].getAttribute('id') == id) {
            var y = danhSachOrder[i];
            xml_order.removeChild(y);
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