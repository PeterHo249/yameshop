/*jshint esversion: 6 */
let xml2js = require('xml2js');
let fs = require('fs');
let path = __dirname + '/../data';

let get_account_list = function () {
    let data = [];
    let parser = new xml2js.Parser();
    parser.parseString(fs.readFileSync(path + '/staff/staff_list.xml', 'utf-8'), function(err, result) {
        let raw_staff_list = result.staff_list.staff;
        for (let i = 0; i < raw_staff_list.length; i++) {
            let temp = {
                id: raw_staff_list[i].$.id,
                name: raw_staff_list[i].$.name,
                username: raw_staff_list[i].$.username,
                password: raw_staff_list[i].$.password,
                shop: raw_staff_list[i].$.shop,
                role: raw_staff_list[i].$.role
            };
            data.push(temp);
        }
    });

    return data;
};

module.exports = {
    get_account_list: get_account_list
}