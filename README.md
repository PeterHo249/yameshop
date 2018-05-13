# yameshop

This is a clothes online shop application. We clone [YaMe.vn](http://yame.vn/) for final project of XML Technology course.

## Project Infomation
* **Created by**: Xuan-Dung Ho, Thanh-Chung Nguyen
* **Technical:**
    * NodeJS
    * XML
## Project Architecture
1. **Client app**
    1. **Folder:** client_app
    2. **Port:** 3000
    3. **Terminal:**
`$ nodemon client_app/service_client.js`
    4. **Url:**
`localhost:3000`
    5. **Purpose:**
        * Provide html webpage for browser.
2. **Server app**
    1. **Folder:** server_app
    2. **Port:** 3030
    3. **Termial:**
`$ nodemon server_app/service_server.js`
    4. **Url**
`localhost:3030`
    5. **Purpose:**
        * Connect with XML database (XML file).
        * Provide CRUD action on database.
