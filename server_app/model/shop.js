let fs = require('fs');
let xml2js = require('xml2js');
let path = __dirname + '/../data';

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xmlns_v = "urn:v";
var Node_goc = new DOMParser().parseFromString("<Du_lieu />", "text/xml");
let temp_id = 100;

function read_file_shop(){
    return fs.readFileSync(path + '/shop/shop_list.xml', 'utf-8');
}

let add_new_shop = (id,name,address,xml_shop) =>{
    
    var shop = Node_goc.createElementNS(xmlns_v,"shop");
    shop.setAttributeNS(xmlns_v,"id",'shop_'+temp_id);
    shop.setAttributeNS(xmlns_v,"name",name);
    shop.setAttributeNS(xmlns_v,"address",address);

    xml_shop.insertBefore(shop,xml_shop.getElementsByTagName('shop')[0]);  
    temp_id++;
}
let change_info_shop = (id,name,address,xml_shop)=>{
    let danhSachShop = xml_shop.getElementsByTagName('shop');
    for(let i=0;i<danhSachShop.length;i++){
        if(danhSachShop[i].getAttribute('id')==id){
            danhSachShop[i].setAttribute('name',name);
            danhSachShop[i].setAttribute('address',address);
            break;
        }
    }
}

let delete_shop = (id,xml_shop) =>{
    let danhSachShop = xml_shop.getElementsByTagName('shop');
    for(let i=0;i<danhSachShop.length;i++){
        if(danhSachShop[i].getAttribute('id')==id){
            var y = danhSachShop[i];
            xml_shop.removeChild(y);
            break;
        }
    }
}

function update_file(xml_shop) {
    var temp = new XMLSerializer().serializeToString(xml_shop); //chuyen sang dang chuoi
    fs.writeFile(path+'/shop/shop_list.xml', temp, err => {
        if (err != null) {
            console.log("--> Cannot write data to file");
        } else {
            console.log("--> Write data to file successfully! <--");
        }
    });
}

module.exports = {
    read_file_shop:read_file_shop,
    add_new_shop:add_new_shop,
    change_info_shop:change_info_shop,
    delete_shop:delete_shop,
    update_file: update_file
}
