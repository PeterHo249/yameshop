let fs = require('fs');
let xml2js = require('xml2js');
let path = __dirname + '/../data';

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xmlns_v = "urn:v";
var Node_goc = new DOMParser().parseFromString("<Du_lieu />", "text/xml");

function read_file_staff() {
    return fs.readFileSync(path + '/staff/staff_list.xml', 'utf-8');
}

let add_new_staff = (id, name, role, username, password, shop, xml_staff) => {

    var staff = Node_goc.createElementNS(xmlns_v, "staff");
    staff.setAttributeNS(xmlns_v, "id", id);
    staff.setAttributeNS(xmlns_v, "name", name);
    staff.setAttributeNS(xmlns_v, "role", role);
    staff.setAttributeNS(xmlns_v, "username", username);
    staff.setAttributeNS(xmlns_v, "password", password);
    staff.setAttributeNS(xmlns_v, "shop", shop);
    xml_staff.insertBefore(staff, xml_staff.getElementsByTagName('staff')[0]);
}

function update_file(xml_staff) {
    var temp = new XMLSerializer().serializeToString(xml_staff); //chuyen sang dang chuoi
    fs.writeFile(path+'/staff/staff_list.xml', temp, err => {
        if (err != null) {
            console.log("--> Cannot write data to file");
        } else {
            console.log("--> Write data to file successfully! <--");
        }
    });
}
let change_info_staff = (id, name, role, username, password, shop, xml_staff) => {
    let danhSachNhanVien = xml_staff.getElementsByTagName('staff');
    for (let i = 0; i < danhSachNhanVien.length; i++) {
        if (danhSachNhanVien[i].getAttribute('id') == id) {
            danhSachNhanVien[i].setAttribute('name', name);
            danhSachNhanVien[i].setAttribute('role', role);
            danhSachNhanVien[i].setAttribute('username', username);
            danhSachNhanVien[i].setAttribute('password', password);
            danhSachNhanVien[i].setAttribute('shop', shop);
            break;
        }
    }
}
let delete_staff = (id, xml_staff) => {
    let danhSachNhanVien = xml_staff.getElementsByTagName('staff');
    for (let i = 0; i < danhSachNhanVien.length; i++) {
        if (danhSachNhanVien[i].getAttribute('id') == id) {
            var y = danhSachNhanVien[i];
            xml_staff.removeChild(y);
            break;
        }
    }
}

module.exports = {
    read_file_staff: read_file_staff,
    add_new_staff: add_new_staff,
    change_info_staff: change_info_staff,
    delete_staff: delete_staff,
    update_file: update_file
}