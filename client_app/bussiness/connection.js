/*jshint esversion: 6 */
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
let JSONWebToken = require('jsonwebtoken');
let cookie = require('cookie');
let host = "http://localhost:3030";

// Get return a JSON object
function getRequest(urlExtension, usertoken) {
    let addressProcess = host + urlExtension;
    let processHttp = new XMLHttpRequest();
    processHttp.setDisableHeaderCheck(true);
    processHttp.open("GET", addressProcess, false);
    if (usertoken !== undefined) {
        processHttp.setRequestHeader('Cookie', 'usertoken=' + usertoken);
    }
    processHttp.send("");
    let str_JSON = processHttp.responseText;
    if (str_JSON == null) {
        return null;
    }

    if (str_JSON === 'LogInRequire')
    {
        return 'LogInRequire';
    }

    return JSON.parse(str_JSON);
}

// Post return a string or null
function postRequest(url, body, usertoken) {
    let addressProcess = host + url;
    let processHttp = new XMLHttpRequest();
    processHttp.setDisableHeaderCheck(true);
    processHttp.open('POST', addressProcess, false);
    processHttp.setRequestHeader('Content-type', 'text/plain');
    if (usertoken !== undefined) {
        processHttp.setRequestHeader('Cookie', 'usertoken=' + usertoken);
    }
    processHttp.send(body);
    let res_body = processHttp.responseText;
    if (res_body == null) {
        return null;
    }

    return res_body;
}

function parseUserInfo(req) {
    if (req.headers['cookie'] === undefined) {
        return {};
    }
    let cookies = cookie.parse(req.headers['cookie']);
    let token = cookies.usertoken;
    if (token === null) {
        return {};
    }

    if (token === '') {
        return {};
    }

    return JSONWebToken.verify(token, 'key for yameshop');
}

module.exports = {
    get: getRequest,
    post: postRequest,
    parseUserInfo: parseUserInfo
};