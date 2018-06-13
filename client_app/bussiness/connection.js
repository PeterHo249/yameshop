/*jshint esversion: 6 */
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
let host = "http://localhost:3030";

function getRequest(urlExtension) {
    let addressProcess = host + urlExtension;
    let processHttp = new XMLHttpRequest();
    processHttp.open("GET", addressProcess, false);
    processHttp.send("");
    let str_JSON = processHttp.responseText;
    if (str_JSON == null) {
        return null;
    }
    return JSON.parse(str_JSON);
}

function postRequest(url, body) {
    let addressProcess = host + url;
    let processHttp = new XMLHttpRequest();
    processHttp.open('POST', addressProcess, false);
    processHttp.setRequestHeader('Content-type', 'text/plain');
    processHttp.send(body);
    let res_body = processHttp.responseText;
    if (res_body == null) {
        return null;
    }

    return res_body;
}

module.exports = {
    get: getRequest,
    post: postRequest
};