fs = require('fs');
let xml2js = require('xml2js');

let path = __dirname + '/../data';
let product_path = path + '/product';

function read_all_file_product() { //changed

    let result = [];
    fs.readdirSync(product_path + '/').forEach(child_folder_level_0 => {
        fs.readdirSync(product_path + '/' + child_folder_level_0 + '/').forEach(child_folder_level_1 => { //cai nay duoc goi 2 lan

            let file_path = product_path + '/' + child_folder_level_0 + '/' + child_folder_level_1 + '/xml/product_list.xml';
            let file_content = fs.readFileSync(file_path, 'utf-8');
            result.push({
                path: file_path,
                content: file_content
            });
        });
    });
    return result;
}

function update_file(file_content_all_product) {//changed
    for (let i = 0; i < file_content_all_product.length; i++) {
        var temp = file_content_all_product[i].content;
        fs.writeFile(file_content_all_product[i].path, temp, err => {
            if (err != null) {
                console.log("--> Cannot write data to file");
            } else {
                console.log("--> Write data to file successfully! <--");
            }
        });
    }
}

let change_info_product = (obj, xml_product,type_order) => {//changed
    for(let v=0;v<xml_product.length;v++){
        let danhSachproduct = xml_product[v].content.getElementsByTagName('product');
        for (let i = 0; i < danhSachproduct.length; i++) {        
            if (danhSachproduct[i].getAttribute('id') == obj.id) { //replace node
                if(obj.in_stock!=undefined){
                    danhSachproduct[i].setAttribute('in_stock',obj.in_stock);
                }
                if(obj.name!=undefined){
                    danhSachproduct[i].setAttribute('name',obj.name);
                }
                if(obj.list_size!=undefined){
                    let inventory_num_product = parseInt(danhSachproduct[i].getAttribute('inventory_num'));
                    let list_size_of_product_in_file = danhSachproduct[i].getElementsByTagName('size');
                    for(let j=0;j<list_size_of_product_in_file.length;j++){
                        let list_size_of_obj = obj.list_size;
                        let inventory_num_size = parseInt(list_size_of_product_in_file[j].getAttribute('inventory_num'));
                        for(let k=0;k<list_size_of_obj.length;k++){
                            if(list_size_of_obj[k].size == list_size_of_product_in_file[j].getAttribute('id')){
                                let list_color_product = list_size_of_product_in_file[j].getElementsByTagName('color');
                                for(let l = 0;l<list_color_product.length;l++){
                                    let list_color_obj = list_size_of_obj[k].list_color;
                                    for(let m=0;m<list_color_obj.length;m++){
                                        if(list_color_obj[m].color==list_color_product[l].getAttribute('id')){
                                            let inventory_num_color = parseInt(list_color_product[l].getAttribute('inventory_num')); //update inventory_num of color
                                            let list_shop_product = list_color_product[l].getElementsByTagName('shop');
                                            for(let n=0;n<list_shop_product.length;n++){
                                                let list_shop_obj = list_color_obj[m].list_shop;
                                                for(let o=0;o<list_shop_obj.length;o++){
                                                    if(list_shop_obj[o].id_shop==list_shop_product[n].getAttribute('id')){
                                                        old = parseInt(list_shop_product[n].getAttribute('inventory_num'));
                                                        if(type_order==undefined){
                                                            inventory_num_color -= old;
                                                            inventory_num_color += parseInt(list_shop_obj[o].inventory_num);
                                                            inventory_num_size -= old;
                                                            inventory_num_size += parseInt(list_shop_obj[o].inventory_num);
                                                            inventory_num_product -= old;
                                                            inventory_num_product += parseInt(list_shop_obj[o].inventory_num);
                                                            list_shop_product[n].setAttribute('inventory_num',list_shop_obj[o].inventory_num);
                                                        }
                                                        else{
                                                            inventory_num_color-=parseInt(list_shop_obj[o].inventory_num);
                                                            inventory_num_product -=parseInt(list_shop_obj[o].inventory_num);
                                                            inventory_num_size-=parseInt(list_shop_obj[o].inventory_num);
                                                            list_shop_product[n].setAttribute('inventory_num',parseInt(list_shop_product[n].getAttribute('inventory_num')-parseInt(list_shop_obj[o].inventory_num)));
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            list_color_product[l].setAttribute('inventory_num',inventory_num_color);
                                        }
                                    }
                                }
                                list_size_of_product_in_file[j].setAttribute('inventory_num',inventory_num_size);
                            }
                        }
                    }
                    danhSachproduct[i].setAttribute('inventory_num',inventory_num_product);
                }
            }
        }
    }
}

let delete_product = (id, xml_product) => { //changed
    let flag = false;
    for (let j = 0; j < xml_product.length; j++) {
        let danhSachproduct = xml_product[j].content.getElementsByTagName('product');
        for (let i = 0; i < danhSachproduct.length; i++) {
            if (danhSachproduct[i].getAttribute('id') == id) {
                var y = danhSachproduct[i];
                xml_product[j].content.removeChild(y);
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
    read_all_file_product: read_all_file_product,
    delete_product: delete_product,
    update_file: update_file,
    change_info_product:change_info_product
}