/*jshint esversion: 6 */

const fs = require('fs');

function getDataFromDAO(urlExtension) {
    let addressProcess = "http://localhost:3030" + urlExtension;
    let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    let processHttp = new XMLHttpRequest();
    processHttp.open("GET", addressProcess, false);
    processHttp.send("");
    let str_JSON = processHttp.responseText;
    return JSON.parse(str_JSON);
}

let insertProperty = function (string, prop_name, prop_value) {
    let prop_to_replace = '{{' + prop_name + '}}';
    string = string.replace(new RegExp(prop_to_replace, 'g'), prop_value);
    return string;
};

let generateExample = function () {
    let layout_html = fs.readFileSync('./index_guest.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/example_snippet.html', 'utf-8');

    content_html = insertProperty(content_html, 'title', 'YameShop');
    content_html = insertProperty(content_html, 'content', 'Example');

    layout_html = insertProperty(layout_html, 'body', content_html);

    return layout_html;
};

let generateGuestHomepage = function () {
    let layout_html = fs.readFileSync('./index_guest.html', 'utf-8');
    let content_html = fs.readFileSync('./snippets/homepage.html', 'utf-8');
    let carousel_snippet = fs.readFileSync('./snippets/homepage_carousel_page.html', 'utf-8');
    let carousel_item_snippet = fs.readFileSync('./snippets/homepage_carousel_item.html', 'utf-8');

    // TODO: Implement code here
    // Get data from server
    let new_trend_data = getDataFromDAO('/home_guest');

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
    let content_html = fs.readFileSync('./snippets/product_list.html', 'utf-8');
    let product_tile_snippet = fs.readFileSync('./snippets/product_list_tile.html', 'utf-8');
    let page_item_snippet = fs.readFileSync('./snippets/product_list_page_item.html', 'utf-8');

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
        data = getDataFromDAO(request);
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

    // TODO: Implement code here

    //layout_html = insertProperty(layout_html, 'body', content_html);
    return layout_html;
};

module.exports = {
    generateExample: generateExample,
    generateGuestHomepage: generateGuestHomepage,
    generateGuestProductDetail: generateGuestProductDetail,
    generateGuestProductList: generateGuestProductList
};