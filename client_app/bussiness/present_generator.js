/*jshint esversion: 6 */

const fs = require('fs');
const connection = require('./connection');



let insertProperty = function (string, prop_name, prop_value) {
    let prop_to_replace = '{{' + prop_name + '}}';
    string = string.replace(new RegExp(prop_to_replace, 'g'), prop_value);
    return string;
};

let generateGuestHomepage = function () {
    let layout_html = fs.readFileSync('./index_guest.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/guest/homepage.html', 'utf-8');
    let carousel_snippet = fs.readFileSync('./snippets/guest/homepage_carousel_page.html', 'utf-8');
    let carousel_item_snippet = fs.readFileSync('./snippets/guest/homepage_carousel_item.html', 'utf-8');

    // TODO: Implement code here
    // Get data from server
    let new_trend_data = connection.get('/home_guest');

    if (new_trend_data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    // Generate new item carousel
    let new_item_carousel = '';
    
    for (let i = 0; i < 3; i++) {
        let carousel_page_content = '';
        let carousel_page = carousel_snippet;
        for (let j = i * 4; j < i * 4 + 4; j++) {
            let html_item_string = '';
            html_item_string = insertProperty(carousel_item_snippet, 'product_id', new_trend_data.news[j].id);
            html_item_string = insertProperty(html_item_string, 'product_name', new_trend_data.news[j].name);
            html_item_string = insertProperty(html_item_string, 'product_price', new_trend_data.news[j].out_price);
            carousel_page_content = carousel_page_content + html_item_string;
        }
        carousel_page = insertProperty(carousel_page, 'product_item', carousel_page_content);
        if (i === 0) {
            carousel_page = insertProperty(carousel_page, 'active', 'active');
        } else {
            carousel_page = insertProperty(carousel_page, 'active', '');
        }
        new_item_carousel = new_item_carousel + carousel_page;
    }

    let trend_item_carousel = '';
    
    for (let i = 0; i < 3; i++) {
        let carousel_page_content = '';
        let carousel_page = carousel_snippet;
        for (let j = i * 4; j < i * 4 + 4; j++) {
            let html_item_string = '';
            html_item_string = insertProperty(carousel_item_snippet, 'product_id', new_trend_data.trends[j].id);
            html_item_string = insertProperty(html_item_string, 'product_name', new_trend_data.trends[j].name);
            html_item_string = insertProperty(html_item_string, 'product_price', new_trend_data.trends[j].out_price);
            carousel_page_content = carousel_page_content + html_item_string;
        }
        carousel_page = insertProperty(carousel_page, 'product_item', carousel_page_content);
        if (i === 0) {
            carousel_page = insertProperty(carousel_page, 'active', 'active');
        } else {
            carousel_page = insertProperty(carousel_page, 'active', '');
        }
        trend_item_carousel = trend_item_carousel + carousel_page;
    }

    content_html = insertProperty(content_html, 'new_carousel', new_item_carousel);
    content_html = insertProperty(content_html, 'trend_carousel', trend_item_carousel);

    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let cache_product_list = {
    category: '',
    brand: '',
    data: ''
};

let generateGuestProductList = function (pageNo, category, brand) {
    let layout_html = fs.readFileSync('./index_guest.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/guest/product_list.html', 'utf-8');
    let product_tile_snippet = fs.readFileSync('./snippets/guest/product_list_tile.html', 'utf-8');
    let page_item_snippet = fs.readFileSync('./snippets/guest/product_list_page_item.html', 'utf-8');

    // TODO: Implement code here
    // Get data
    let data = [];
    if (category === cache_product_list.category && brand === cache_product_list.brand) {
        data = cache_product_list.data;
    } else {
        let request = '';
        if (brand === '') {
            request = 'localhost:3030/product_list?category=' + category;
        } else {
            request = 'localhost:3030/product_list?category=' + category + '&brand=' + brand;
        }
        data = connection.get(request);
        if (data === null) {
            return insertProperty(layout_html, 'body', 'Fail to get data');
        }
        cache_product_list.data = data;
        cache_product_list.category = category;
        cache_product_list.brand = brand;
    }

    // Generate html
    let html_tile_list = '';

    let page_count = Math.floor(data.length / 24);
    page_count = (page_count * 24) === data.length ? page_count : (page_count + 1);
    pageNo = pageNo > page_count ? page_count : pageNo;
    pageNo = pageNo < 1 ? 1 : pageNo;

    data = data.slice((pageNo - 1) * 24, pageNo * 24);

    // Generate product tile
    for (let i = 0; i < data.length; i++) {
        let html_string = product_tile_snippet;
        html_string = insertProperty(html_string, 'product_id', data[i].id);
        html_string = insertProperty(html_string, 'product_name', data[i].name);
        html_string = insertProperty(html_string, 'product_price', data[i].out_price);
        html_tile_list = html_tile_list + html_string;
    }
    content_html = insertProperty(content_html, 'content', html_tile_list);

    // Generate page index
    let page_request = '';
    if (brand === '') {
        page_request = '/productlist.html?category=' + category + '&page=';
    } else {
        page_request = '/productlist.html?category=' + category + '&brand=' + brand + '&page=';
    }

    let html_page_list = '';

    for (let i = 1; i <= page_count; i++) {
        let html_string = page_item_snippet;
        html_string = insertProperty(html_string, 'page_number', i);
        html_string = insertProperty(html_string, 'page_link', page_request + i);
        if (i === pageNo) {
            html_string = insertProperty(html_string, 'active', 'active');
        } else {
            html_string = insertProperty(html_string, 'active', '');
        }
        html_page_list = html_page_list + html_string;
    }
    content_html = insertProperty(content_html, 'page_content', html_page_list);

    content_html = insertProperty(content_html, 'next_link', page_request + (pageNo + 1));
    content_html = insertProperty(content_html, 'prev_link', page_request + (pageNo - 1));

    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateGuestProductDetail = function (productId) {
    let layout_html = fs.readFileSync('./index_guest.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/guest/product_detail.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/guest/product_detail_row.html', 'utf-8');
    let photo_snippet = fs.readFileSync('./snippets/guest/product_detail_photo.html', 'utf-8');

    // TODO: Implement code here
    let data = connection.get('/product?productId=' + productId);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }
    let tokens = productId.match(/([^_]+)/g);
    let product_id = tokens[0] + '_' + tokens[1] + '_' + tokens[2];

    // Generate photo list
    let html_photo_list = '';
    for (let i = 0; i < data.color.length; i++) {
        let html_string = insertProperty(photo_snippet, 'product_id', product_id);
        html_string = insertProperty(html_string, 'color', data.color[i].id);
        html_photo_list = html_photo_list + html_string;
    }
    content_html = insertProperty(content_html, 'photo_list', html_photo_list);

    // Generate table list
    let html_row_list = '';
    for (let i = 0; i < data.color.length; i++) {
        let html_string = insertProperty(row_snippet, 'id', product_id + '_' + data.color[i].id);
        html_string = insertProperty(html_string, 'color_size', data.color[i].name + ' - ' + tokens[3]);
        html_string = insertProperty(html_string, 'shop_count', data.color[i].shops.length);
        let shop_list_string = '';
        for (let j = 0; j < data.color[i].shops.length; j++) {
            shop_list_string = shop_list_string + data.color[i].shops[j] + '<br>';
        }
        html_string = insertProperty(html_string, 'shop_list', shop_list_string);
        html_row_list = html_row_list + html_string;
    }
    content_html = insertProperty(content_html, 'table_body', html_row_list);

    // Generate main content
    content_html = insertProperty(content_html, 'product_id', product_id);
    content_html = insertProperty(content_html, 'product_name', data.name);
    content_html = insertProperty(content_html, 'product_price', data.out_price);
    content_html = insertProperty(content_html, 'description', data.description);

    // Generate link to more size
    let link_snippet = '<a href="/productdetail.html?id={{product_id}}_{{size}}">{{size}}</a><span> </span>';
    let html_link_list = '';
    for (let i = 0; i < data.size_list.length; i++) {
        let html_string = insertProperty(link_snippet, 'product_id', product_id);
        html_string = insertProperty(html_string, 'size', data.size_list[i]);
        html_link_list = html_link_list + html_string;
    }
    content_html = insertProperty(content_html, 'link_list', html_link_list);

    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateStaffProductList = function (category, brand, token) {
    let layout_html = fs.readFileSync('./index_staff.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/staff/staff_product_list.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/staff/staff_product_list_row.html', 'utf-8');

    // Get data
    let data = [];
    let request = '';
    if (brand === undefined) {
        request = 'localhost:3030/product_list_staff?category=' + category;
    } else {
        request = 'localhost:3030/product_list_staff?category=' + category + '&brand=' + brand;
    }
    data = connection.get(request, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let html_row_list = '';
    for (let i = 0; i < data.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'productid', data[i].id);
        snippet = insertProperty(snippet, 'productname', data[i].name);
        snippet = insertProperty(snippet, 'price', data[i].out_price);
        snippet = insertProperty(snippet, 'inventory_num', data[i].inventory_num);
        let sizelist = '';
        for (let j = 0; j < data[i].list_size.length; j++) {
            sizelist += data[i].list_size[j] + ' ';
        }
        snippet = insertProperty(snippet, 'size_list', sizelist);
        let colorlist = '';
        for (let j = 0; j < data[i].list_color.length; j++) {
            colorlist += data[i].list_color[j] + ' ';
        }
        snippet = insertProperty(snippet, 'color_list', colorlist);
        html_row_list += snippet;
    }

    content_html = insertProperty(content_html, 'category', category);
    content_html = insertProperty(content_html, 'brand', brand);
    content_html = insertProperty(content_html, 'table_body', html_row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateStaffProductDetail = function (product_id, token) {
    let layout_html = fs.readFileSync('./index_staff.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/staff/staff_product_detail.html', 'utf-8');
    let section_snippet = fs.readFileSync('./snippets/staff/staff_product_detail_section.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/staff/staff_product_detail_row.html', 'utf-8');

    let data = connection.get('localhost:3030/product_staff?productId=' + product_id, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let section_list = '';
    for (let i = 0; i < data.size_list.length; i++) {
        let snippet = section_snippet;
        let row_list = '';
        snippet = insertProperty(snippet, 'size', data.size_list[i].size);
        for (let j = 0; j < data.size_list[i].color.length; j++) {
            let row = row_snippet;
            row = insertProperty(row, 'colorid', data.size_list[i].color[j].id);
            row = insertProperty(row, 'colorname', data.size_list[i].color[j].name);
            for (let x = 0; x < data.size_list[i].color[j].shops.length; x++) {
                let row_shop = row;
                row_shop = insertProperty(row_shop, 'shopname', data.size_list[i].color[j].shops[x].name);
                row_shop = insertProperty(row_shop, 'inventorynum', data.size_list[i].color[j].shops[x].inventory_num);
                row_list += row_shop;
            }
        }
        snippet = insertProperty(snippet, 'table_list', row_list);
        section_list += snippet;
    }

    content_html = insertProperty(content_html, 'productid', data.id);
    content_html = insertProperty(content_html, 'productname', data.name);
    content_html = insertProperty(content_html, 'price', data.out_price);
    content_html = insertProperty(content_html, 'inventory_num', data.inventory_num);
    content_html = insertProperty(content_html, 'description', data.description);
    content_html = insertProperty(content_html, 'section_list', section_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateStaffOrderList = function (year, month, token) {
    let layout_html = fs.readFileSync('./index_staff.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/staff/staff_order_list.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/staff/staff_order_list_row.html', 'utf-8');

    let data = [];
    let request = '';
    let year_string = '';
    if (month === undefined) {
        request = 'localhost:3030/bill_general?year=' + year;
        year_string += year;
    } else {
        request = 'localhost:3030/bill_general?month=' + month + '&year=' + year;
        year_string += month + '/' + year;
    }

    data = connection.get(request, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'id', data[i].id);
        snippet = insertProperty(snippet, 'date', data[i].date);
        snippet = insertProperty(snippet, 'quantity', data[i].total);
        snippet = insertProperty(snippet, 'revenue', data[i].revenue);
        row_list += snippet;
    }

    content_html = insertProperty(content_html, 'year_string', year_string);
    content_html = insertProperty(content_html, 'table_body', row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateStaffOrderDetail = function (orderid, token) {
    let layout_html = fs.readFileSync('./index_staff.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/staff/staff_order_detail.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/staff/staff_order_detail_row.html', 'utf-8');

    let data = connection.get('localhost:3030/bill_detail?id=' + orderid, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data[0].list_item.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'id', data[0].list_item[i].id);
        snippet = insertProperty(snippet, 'name', data[0].list_item[i].name);
        snippet = insertProperty(snippet, 'price', data[0].list_item[i].price);
        snippet = insertProperty(snippet, 'quantity', data[0].list_item[i].count);
        snippet = insertProperty(snippet, 'total', data[0].list_item[i].sum_price);
        row_list += snippet;
    }

    content_html = insertProperty(content_html, 'id', data[0].id);
    content_html = insertProperty(content_html, 'date', data[0].date);
    content_html = insertProperty(content_html, 'quantity', data[0].total);
    content_html = insertProperty(content_html, 'price', data[0].revenue);
    content_html = insertProperty(content_html, 'staffid', data[0].staff_id);
    content_html = insertProperty(content_html, 'staffname', data[0].name_of_staff);
    content_html = insertProperty(content_html, 'shopid', data[0].shop_id);
    content_html = insertProperty(content_html, 'shopname', data[0].name_of_shop);
    content_html = insertProperty(content_html, 'table_body', row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerProductList = function (category, brand, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_product_list.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_product_list_row.html', 'utf-8');

    // Get data
    let data = [];
    let request = '';
    if (brand === undefined) {
        request = 'localhost:3030/manager_product_list?category=' + category;
    } else {
        request = 'localhost:3030/manager_product_list?category=' + category + '&brand=' + brand;
    }
    data = connection.get(request, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let html_row_list = '';
    for (let i = 0; i < data.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'productid', data[i].id);
        snippet = insertProperty(snippet, 'productname', data[i].name);
        snippet = insertProperty(snippet, 'price', data[i].out_price);
        snippet = insertProperty(snippet, 'inventory_num', data[i].inventory_num);
        snippet = insertProperty(snippet, 'in_price', data[i].in_price);
        let sizelist = '';
        for (let j = 0; j < data[i].list_size.length; j++) {
            sizelist += data[i].list_size[j] + ' ';
        }
        snippet = insertProperty(snippet, 'size_list', sizelist);
        let colorlist = '';
        for (let j = 0; j < data[i].list_color.length; j++) {
            colorlist += data[i].list_color[j] + ' ';
        }
        snippet = insertProperty(snippet, 'color_list', colorlist);
        if (data[i].in_stock == 'true') {
            snippet = insertProperty(snippet, 'in_stock', '<i class="fas fa-check"></i>');
        } else {
            snippet = insertProperty(snippet, 'in_stock', '<i class="fas fa-times"></i>');
        }
        html_row_list += snippet;
    }

    content_html = insertProperty(content_html, 'category', category);
    content_html = insertProperty(content_html, 'brand', brand);
    content_html = insertProperty(content_html, 'table_body', html_row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerProductDetail = function (productid, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_product_detail.html', 'utf-8');
    let section_snippet = fs.readFileSync('./snippets/manager/manager_product_detail_section.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_product_detail_row.html', 'utf-8');

    let data = connection.get('localhost:3030/manager_product_detail?id=' + productid, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let section_list = '';
    for (let i = 0; i < data.size_list.length; i++) {
        let snippet = section_snippet;
        let row_list = '';
        snippet = insertProperty(snippet, 'size', data.size_list[i].size);
        for (let j = 0; j < data.size_list[i].color.length; j++) {
            let row = row_snippet;
            row = insertProperty(row, 'colorid', data.size_list[i].color[j].id);
            row = insertProperty(row, 'colorname', data.size_list[i].color[j].name);
            for (let x = 0; x < data.size_list[i].color[j].shops.length; x++) {
                let row_shop = row;
                row_shop = insertProperty(row_shop, 'shopname', data.size_list[i].color[j].shops[x].name);
                row_shop = insertProperty(row_shop, 'inventorynum', data.size_list[i].color[j].shops[x].inventory_num);
                row_list += row_shop;
            }
        }
        snippet = insertProperty(snippet, 'table_list', row_list);
        section_list += snippet;
    }

    content_html = insertProperty(content_html, 'productid', data.id);
    content_html = insertProperty(content_html, 'productname', data.name);
    content_html = insertProperty(content_html, 'price', data.out_price);
    content_html = insertProperty(content_html, 'inventory_num', data.inventory_num);
    content_html = insertProperty(content_html, 'description', data.description);
    content_html = insertProperty(content_html, 'in_price', data.in_price);
    if (data.in_stock == 'true') {
        content_html = insertProperty(content_html, 'in_stock', '<i class="fas fa-check"></i>');
    } else {
        content_html = insertProperty(content_html, 'in_stock', '<i class="fas fa-times"></i>');
    }
    content_html = insertProperty(content_html, 'section_list', section_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerOrderList = function (year, month, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_order_list.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_order_list_row.html', 'utf-8');

    let data = [];
    let request = '';
    let year_string = '';
    if (month === undefined) {
        request = 'localhost:3030/manager_order_list?year=' + year;
        year_string += year;
    } else {
        request = 'localhost:3030/manager_order_list?month=' + month + '&year=' + year;
        year_string += month + '/' + year;
    }

    data = connection.get(request, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'id', data[i].id);
        snippet = insertProperty(snippet, 'date', data[i].date);
        snippet = insertProperty(snippet, 'quantity', data[i].sum_count);
        snippet = insertProperty(snippet, 'type', data[i].type);
        snippet = insertProperty(snippet, 'sum_price', data[i].sum_in_price);
        snippet = insertProperty(snippet, 'revenue', data[i].revenue);
        row_list += snippet;
    }

    content_html = insertProperty(content_html, 'year_string', year_string);
    content_html = insertProperty(content_html, 'table_body', row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerOrderDetail = function (orderid, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_order_detail.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_order_detail_row.html', 'utf-8');

    let data = connection.get('localhost:3030/manager_order_detail?id=' + orderid, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data[0].list_item.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'id', data[0].list_item[i].id);
        snippet = insertProperty(snippet, 'name', data[0].list_item[i].name);
        snippet = insertProperty(snippet, 'price', data[0].list_item[i].price);
        snippet = insertProperty(snippet, 'quantity', data[0].list_item[i].count);
        snippet = insertProperty(snippet, 'total', data[0].list_item[i].sum_price);
        row_list += snippet;
    }

    content_html = insertProperty(content_html, 'id', data[0].id);
    content_html = insertProperty(content_html, 'date', data[0].date);
    content_html = insertProperty(content_html, 'quantity', data[0].total);
    content_html = insertProperty(content_html, 'price', data[0].sum_in_price);
    content_html = insertProperty(content_html, 'staffid', data[0].staff_id);
    content_html = insertProperty(content_html, 'staffname', data[0].name_of_staff);
    content_html = insertProperty(content_html, 'shopid', data[0].shop_id);
    content_html = insertProperty(content_html, 'shopname', data[0].name_of_shop);
    content_html = insertProperty(content_html, 'revenue', data[0].revenue);
    content_html = insertProperty(content_html, 'type', data[0].type);
    content_html = insertProperty(content_html, 'table_body', row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerShopList = function (token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_shop_list.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_shop_list_row.html', 'utf-8');

    let data = connection.get('localhost:3030/manager_shop_list', token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data.length; i++) {
        let html = row_snippet;
        html = insertProperty(html, 'id', data[i].id);
        html = insertProperty(html, 'name', data[i].name);
        html = insertProperty(html, 'address', data[i].address);
        row_list += html;
    }

    content_html = insertProperty(content_html, 'table_body', row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerStaffList = function (token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_staff_list.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_staff_list_row.html', 'utf-8');

    let data = connection.get('localhost:3030/manager_staff_list', token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data.length; i++) {
        let html = row_snippet;
        html = insertProperty(html, 'id', data[i].id);
        html = insertProperty(html, 'name', data[i].name);
        html = insertProperty(html, 'username', data[i].user_name);
        html = insertProperty(html, 'password', data[i].password);
        html = insertProperty(html, 'shop', data[i].shop_name);
        html = insertProperty(html, 'role', data[i].role);
        row_list += html;
    }

    content_html = insertProperty(content_html, 'table_body', row_list);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateStaffAddOrder = function () {
    let layout_html = fs.readFileSync('./index_staff.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/staff/staff_add_order.html', 'utf-8');
    let now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let backlink = '/stafforderlist.html?year=' + year + '&month=' + month;
    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerAddOrder = function () {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_add_order.html', 'utf-8');
    let now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let backlink = '/managerorderlist.html?year=' + year + '&month=' + month;
    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerAddShop = function () {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_add_shop.html', 'utf-8');
    let backlink = '/managershoplist.html';
    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerAddStaff = function () {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_add_staff.html', 'utf-8');
    let backlink = '/managerstafflist.html';
    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateStaffUpdateOrder = function(id, token) {
    let layout_html = fs.readFileSync('./index_staff.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/staff/staff_update_order.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/staff/staff_update_order_row.html', 'utf-8');

    let data = connection.get('localhost:3030/bill_detail?id=' + id, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data[0].list_item.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'id', data[0].list_item[i].id);
        snippet = insertProperty(snippet, 'count', data[0].list_item[i].count);
        row_list += snippet;
    }

    let now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let backlink = '/stafforderlist.html?year=' + year + '&month=' + month;
    content_html = insertProperty(content_html, 'back-link', backlink);

    content_html = insertProperty(content_html, 'table_body', row_list);
    let date_token = data[0].date.match(/\d+/g);
    if (date_token[0].length === 1) {
        date_token[0] = '0' + date_token[0];
    }
    if (date_token[1].length === 1) {
        date_token[1] = '0' + date_token[1];
    }
    let date_str = date_token[2] + '-' + date_token[1] + '-' + date_token[0];
    content_html = insertProperty(content_html, 'order_date', date_str);
    content_html = insertProperty(content_html, 'id', data[0].id);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerUpdateOrder = function(id, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_update_order.html', 'utf-8');
    let row_snippet = fs.readFileSync('./snippets/manager/manager_update_order_row.html', 'utf-8');

    let data = connection.get('localhost:3030/manager_order_detail?id=' + id, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    let row_list = '';
    for (let i = 0; i < data[0].list_item.length; i++) {
        let snippet = row_snippet;
        snippet = insertProperty(snippet, 'id', data[0].list_item[i].id);
        snippet = insertProperty(snippet, 'count', data[0].list_item[i].count);
        row_list += snippet;
    }

    let now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let backlink = '/managerorderlist.html?year=' + year + '&month=' + month;
    content_html = insertProperty(content_html, 'back-link', backlink);

    content_html = insertProperty(content_html, 'table_body', row_list);
    let date_token = data[0].date.match(/\d+/g);
    if (date_token[0].length === 1) {
        date_token[0] = '0' + date_token[0];
    }
    if (date_token[1].length === 1) {
        date_token[1] = '0' + date_token[1];
    }
    let date_str = date_token[2] + '-' + date_token[1] + '-' + date_token[0];
    content_html = insertProperty(content_html, 'order_date', date_str);
    content_html = insertProperty(content_html, 'id', data[0].id);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerUpdateShop = function (id, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_update_shop.html', 'utf-8');
    let backlink = '/managershoplist.html';
    
    let data = connection.get('localhost:3030/manager_shop_detail?id=' + id, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    content_html = insertProperty(content_html, 'id', data.id);
    content_html = insertProperty(content_html, 'name', data.name);
    content_html = insertProperty(content_html, 'address', data.address);

    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerUpdateStaff = function (id, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_update_staff.html', 'utf-8');
    
    let data = connection.get('localhost:3030/manager_staff_detail?id=' + id, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    content_html = insertProperty(content_html, 'id', data.id);
    content_html = insertProperty(content_html, 'name', data.name);
    content_html = insertProperty(content_html, 'username', data.user_name);
    content_html = insertProperty(content_html, 'password', data.password);
    content_html = insertProperty(content_html, 'shop', data.shop_id);
    content_html = insertProperty(content_html, 'role', data.role);

    let backlink = '/managerstafflist.html';
    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

let generateManagerUpdateProduct = function (id, token) {
    let layout_html = fs.readFileSync('./index_manager.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/manager/manager_update_product.html', 'utf-8');
    
    let data = connection.get('localhost:3030/manager_product_detail?id=' + id, token);
    if (data === null) {
        return insertProperty(layout_html, 'body', 'Fail to get data');
    }

    if (data === 'LogInRequire') {
        return 'LogInRequire';
    }

    content_html = insertProperty(content_html, 'id', data.id);
    content_html = insertProperty(content_html, 'name', data.name);
    content_html = insertProperty(content_html, data.in_stock.toString() + 'select', 'selected');

    let backlink = '/managerproductlist.html?category=AK&brand=AD';
    content_html = insertProperty(content_html, 'back-link', backlink);
    layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

module.exports = {
    // Guest page
    generateGuestHomepage: generateGuestHomepage,
    generateGuestProductDetail: generateGuestProductDetail,
    generateGuestProductList: generateGuestProductList,

    // Staff page
    generateStaffOrderList: generateStaffOrderList,
    generateStaffOrderDetail: generateStaffOrderDetail,
    generateStaffProductList: generateStaffProductList,
    generateStaffProductDetail: generateStaffProductDetail,
    generateStaffAddOrder: generateStaffAddOrder,
    generateStaffUpdateOrder: generateStaffUpdateOrder,

    // Manager page
    generateManagerProductList: generateManagerProductList,
    generateManagerProductDetail: generateManagerProductDetail,
    generateManagerOrderList: generateManagerOrderList,
    generateManagerOrderDetail: generateManagerOrderDetail,
    generateManagerShopList: generateManagerShopList,
    generateManagerStaffList: generateManagerStaffList,
    generateManagerAddOrder: generateManagerAddOrder,
    generateManagerAddShop: generateManagerAddShop,
    generateManagerAddStaff: generateManagerAddStaff,
    generateManagerUpdateOrder: generateManagerUpdateOrder,
    generateManagerUpdateShop: generateManagerUpdateShop,
    generateManagerUpdateStaff: generateManagerUpdateStaff,
    generateManagerUpdateProduct: generateManagerUpdateProduct,

    insertProperty: insertProperty
};