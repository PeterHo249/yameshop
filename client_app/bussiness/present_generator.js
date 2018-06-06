/*jshint esversion: 6 */
const fs = require('fs');

let dataJson;

class UI {

    constructor() {}

    InsertProperty(string, prop_name, prop_value) {
        let prop_to_replace = '{{' + prop_name + '}}';
        string = string.replace(new RegExp(prop_to_replace, 'g'), prop_value);
        return string;
    }

    RenderUI(req,fivePage,numPage) {
        let layout_html = fs.readFileSync('./client_app/index_guest.html', 'utf-8');
        let content_html;

        let i;
        switch (req) {
            case '1':
                i = 0
                content_html = fs.readFileSync('./client_app/snippets/homepage.html', 'utf-8');
                for (; i < 12; i++) {
                    content_html = this.InsertProperty(content_html, 'NEW_PRODUCT_NAME_' + i,'<a href="product?productId='+dataJson.news[i].id+'_L">' +dataJson.news[i].name+'</a>' );
                    content_html = this.InsertProperty(content_html, 'NEW_PRODUCT_PRICE_' + i, dataJson.news[i].out_price);
                    content_html = this.InsertProperty(content_html, 'NEW_PRODUCT_IMAGE_' + i, '<img src="'+'/photos/AK_AD_0000_C.jpg'+'" class="img-responsive" alt="a" />');//
                    content_html = this.InsertProperty(content_html, 'TREND_PRODUCT_NAME_' + i,'<a href="product?productId='+dataJson.trends[i].id+'_L">'+ dataJson.trends[i].name+'</a>');
                    content_html = this.InsertProperty(content_html, 'TREND_PRODUCT_PRICE_' + i, dataJson.trends[i].out_price);
                    content_html = this.InsertProperty(content_html, 'TREND_PRODUCT_IMAGE_' + i,  '<img src="'+'/photos/AK_AD_0000_C.jpg'+'" class="img-responsive" alt="a" />');//
                }
                break;
            case '2':
                let strHtml = '<a href="#">{{PRODUCT_NAME_7}}</a>'
                i = numPage*8;
                content_html = fs.readFileSync('./client_app/snippets/product_list.html', 'utf-8');

                let n = (i+8)<dataJson.length?(i+8):dataJson.length;
                let temp = i;

                let item_product='';

                for (let k = 0; k < n-temp; k++,i++) {
                    item_product+='<div class="col-sm-6 col-md-6 col-lg-4 col-xl-3"><div class="tcb-product-item"><div class="tcb-product-photo"><a href="#">'+
                    '<img src="'+'/photos/AK_AD_0000_C.jpg'+'" class="img-responsive" alt="a" />'+'</a></div><div class="tcb-product-info"><div class="tcb-product-title"><h4>'+
                    '<a href="product?productId='+dataJson[i].id+'_L">' + dataJson[i].name + '</a>'+'</h4></div><div class="tcb-hline"></div><div class="tcb-product-price">'+
                    dataJson[i].out_price +'vnđ</div></div></div></div>';
                }
                content_html = this.InsertProperty(content_html, 'PRODUCT_LIST',item_product);
                content_html = this.InsertProperty(content_html, 'PAGE_NUMBER', this.DisplayPageNumber(dataJson.length,fivePage,numPage));
                break;
            case '3':
                i = 0
                content_html = fs.readFileSync('./client_app/snippets/product_detail.html', 'utf-8');
                let info_table='';
                let other_color='';
                for (; i < dataJson.color.length; i++) {
                    info_table += '<tr><th scope="row">'+dataJson.id +'_' + dataJson.color[i].id +'</th><td>'+dataJson.color[i].name+','+dataJson.size+
                    '</td><td style="color : blue" class="popup" onmouseover="showFunction('+i+')" onmouseout="hideFunction('+i+')">'+dataJson.color[i].shops.length+
                    ' Cửa hàng<span class="popuptext" id="'+i+'">'+this.ProcessDisplayListShop(dataJson.color[i].shops)+'</span></td></tr>';

                    other_color += ' <div class="col-sm-6 col-md-4"><img src="'+'/photos/AK_AD_0000_C.jpg'+'" alt="hinh ao" class="product-photo"></div>';
                }
                content_html = this.InsertProperty(content_html, 'INFO_TABLE',info_table);
                content_html = this.InsertProperty(content_html, 'PRODUCT_IMAGE_DIFFERENT_COLOR',other_color);
                content_html = this.InsertProperty(content_html, 'PRODUCT_NAME',dataJson.name);
                content_html = this.InsertProperty(content_html, 'PRODUCT_PRICE',dataJson.out_price);
                content_html = this.InsertProperty(content_html, 'PRODUCT_IMAGE_MAIN','<img id="product-photo-sample" src="'+'/photos/AK_AD_0000_C.jpg'+'" alt="hinh mau">');

                break;
        }

        layout_html = this.InsertProperty(layout_html, 'body', content_html);

        return layout_html;
    }

    ProcessDisplayListShop(listShop){
        let result = '';
        for(var i=0;i<listShop.length;i++){
            result+=listShop[i]+'</br>';
        }
        return result;
    }
    DisplayPageNumber(amountProduct,fivePageNext,numPage){
        amountProduct = amountProduct/8;
        let result ='';
        let limit = (fivePageNext + 5)<=amountProduct?(fivePageNext + 5):amountProduct;
        for(let i= fivePageNext;i<=limit;i++){
            if(i==numPage){
                result+='<li class="page-item active"><a class="page-link" href="/product_list_change?page='+i+'">'+i+'</a></li>';
            }
            else{
                result+='<li class="page-item"><a class="page-link" href="/product_list_change?page='+i+'">'+i+'</a></li>';
            }
        }
        return result;
    }

    SendRequestGetData(urlExtension) {

        let addressProcess="http://localhost:3030"+urlExtension;

        let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        let processHttp = new XMLHttpRequest();
        processHttp.open("GET", addressProcess, false);
        processHttp.send("");
        let str_JSON = processHttp.responseText;
        dataJson = JSON.parse(str_JSON);
    }
}

let render = new UI();
module.exports = render;