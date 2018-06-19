fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let product_path = path + '/product';

function read_all_file_product() {

    let result = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><product_list>';
    fs.readdirSync(product_path + '/').forEach(child_folder_level_0 => {
        fs.readdirSync(product_path + '/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan

            let file_path = product_path + '/' + child_folder_level_0 + '/' + child_folder_level_1 + '/xml/product_list.xml';
            let file_content = fs.readFileSync(file_path, 'utf-8');
            file_content = file_content.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
            file_content = file_content.replace('<product_list>', '');
            file_content = file_content.replace('</product_list>', '');
            result += file_content;
        });
    });
    return result + '</product_list>';
}

function GhiDuLieu() {
    var temp = new XMLSerializer().serializeToString(xml_product); //chuyen sang dang chuoi
    File.writeFile('../data/product/xml/list_product.xml', temp, err => {
        if (err != null) {
            console.log("--> Cannot write data to file");
        } else {
            console.log("--> Write data to file successfully! <--");
        }
    });
}

let change_info_product = (obj, xml_product) => {
    let danhSachproduct = xml_product.getElementsByTagName('product');
    for (let i = 0; i < danhSachproduct.length; i++) {
        if (danhSachproduct[i].getAttribute('id') == obj.id) { //replace node
            let product = Node_goc.createElementNS(xmlns_v, "product");
            product.setAttributeNS(xmlns_v, "date", obj.date);
            product.setAttributeNS(xmlns_v, "id", obj.id);
            product.setAttributeNS(xmlns_v, "shop_id", obj.shop_id);
            product.setAttributeNS(xmlns_v, "staff_id", obj.staff_id);
            product.setAttributeNS(xmlns_v, "total", obj.total);
            product.setAttributeNS(xmlns_v, "type", obj.type);

            let item_json = obj.list_item;
            for (let j = 0; j < item_json.length; j++) {
                let item_xml = Node_goc.createElementNS(xmlns_v, "item");
                item_xml.setAttributeNS(xmlns_v, "count", item_json[j].count);
                item_xml.setAttributeNS(xmlns_v, "id", item_json[j].id);
                product.appendChild(item_xml);
            }
            xml_product.replaceChild(product, danhSachproduct[i]);
            break;
        }
    }
}

let delete_product = (id, xml_product) => {
    let danhSachproduct = xml_product.getElementsByTagName('product');
    for (let i = 0; i < danhSachproduct.length; i++) {
        if (danhSachproduct[i].getAttribute('id') == id) {
            var y = danhSachproduct[i];
            xml_product.removeChild(y);
            break;
        }
    }
}

module.exports = {
    read_all_file_product: read_all_file_product,
    delete_product:delete_product
}