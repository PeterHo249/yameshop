/*jshint esversion: 6 */
const fs = require('fs');

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

module.exports = {
    generateExample: generateExample
};