/*jshint esversion: 6 */

let JSONWebToken = require('jsonwebtoken');
let cookie = require('cookie');
let data = require('./data');

let token_key = 'key for yameshop';
let sessions = [];

// return false if not login
// return role of user: staff or manager
let isLogedIn = function (token) {
    for (let i = 0; i < sessions.length; i++) {
        if (token === sessions[i]) {
            let user = JSONWebToken.verify(token, token_key);
            return user.role;
        }
    }
    return false;
};

let isAuth = function (req, role) {
    if (req.headers['cookie'] === undefined) {
        return false;
    }

    let cookies = cookie.parse(req.headers['cookie']);
    let token = cookies.usertoken;

    let user_role = isLogedIn(token);

    if (!user_role) {
        return false;
    }

    return user_role === role;
};

// Log In request
let logIn = function (username, password) {
    let accounts = data.get_account_list();
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].username === username && accounts[i].password === password) {
            let info = accounts[i];
            info.date = Date();
            let token = JSONWebToken.sign(info, token_key);
            sessions.push(token);
            return token;
        }
    }
    return false;
};

let logOut = function (token) {
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i] === token) {
            sessions.slice(i, 1);
        }
    }
};

function extractPostBody(req, callback) {
    const FORM_URLENCODED = 'text/plain;charset=UTF-8';
    if (req.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            callback(JSON.parse(body));
        });
    } else {
        return callback(null);
    }
}

module.exports = {
    isLogedIn: isLogedIn,
    logIn: logIn,
    logOut: logOut,
    extractPostBody: extractPostBody,
    isAuth: isAuth
};