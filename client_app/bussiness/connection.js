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

function postRequest(url) {

}

module.exports = {
    get: getRequest,
    post: postRequest
};