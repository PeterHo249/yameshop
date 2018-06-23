/*jshint esversion: 6 */

(function() {
    if($(window).width()>769){
        $('.navbar .dropdown').hover(function() {
            $(this).find('.dropdown-menu').first().stop(true, true).delay(250).slideDown();

        }, function() {
            $(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp();

        });

        $('.navbar .dropdown > a').click(function(){
            location.href = this.href;
        });

    }
}) ();

$('#category-droplist').change(function () {
    let cate = $(this).val();
    let html_string = '';
    for (let i = 0; i < cate_brand_ref.length; i++) {
        if (cate_brand_ref[i].id === cate) {
            for (let j = 0; j < cate_brand_ref[i].brands.length; j++) {
                html_string += '<option value="' + cate_brand_ref[i].brands[j].id + '">' + cate_brand_ref[i].brands[j].name + '</option>';
            }
            break;
        }
    }
    $('#brand-droplist').html(html_string);
});

$('#year-droplist').change(function() {
    let current_date = new Date();
    let html_string = '';
    if ($(this).val() === current_date.getFullYear()) {
        for (let i = 1; i <= (current_date.getMonth() + 1); i++) {
            html_string += '<option value="' + i + '">' + i + '</option>';
        }
    } else {
        html_string = '<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="7">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>';
    }
    $('#month-droplist').html(html_string);
});

let year_origin = 2018;
(function() {
    let current_date = new Date();
    let html_string = '';
    for (let i = year_origin; i <= current_date.getFullYear(); i++) {
        html_string += '<option value="' + i + '">' + i + '</option>';
    }
    $('#year-droplist').html(html_string);
    html_string = '';
    for (let i = 1; i <= (current_date.getMonth() + 1); i++) {
        html_string += '<option value="' + i + '">' + i + '</option>';
    }
    $('#month-droplist').html(html_string);
}) ();

let cate_brand_ref = [{
        id: 'AK',
        name: 'Áo khoác',
        brands: [{
                id: 'AD',
                name: 'Adachi'
            },
            {
                id: 'KM',
                name: 'Kirimaru'
            },
            {
                id: 'MB',
                name: 'Mabu'
            },
            {
                id: 'NS',
                name: 'No Style'
            }
        ]
    },
    {
        id: 'ASM',
        name: 'Áo sơmi',
        brands: [{
                id: 'AD',
                name: 'Adachi'
            },
            {
                id: 'KM',
                name: 'Kirimaru'
            },
            {
                id: 'MB',
                name: 'Mabu'
            },
            {
                id: 'NS',
                name: 'No Style'
            }
        ]
    },
    {
        id: 'AT',
        name: 'Áo Thun',
        brands: [{
                id: 'AD',
                name: 'Adachi'
            },
            {
                id: 'KM',
                name: 'Kirimaru'
            },
            {
                id: 'MB',
                name: 'Mabu'
            },
            {
                id: 'NS',
                name: 'No Style'
            }
        ]
    },
    {
        id: 'BL',
        name: 'Balo',
        brands: [{
            id: 'BL',
            name: 'Balo'
        }]
    },
    {
        id: 'DS',
        name: 'Dép - Sandal',
        brands: [{
                id: 'N',
                name: 'Dép nam'
            },
            {
                id: 'AD',
                name: 'Couple Adachi'
            },
            {
                id: 'S',
                name: 'Sandal'
            }
        ]
    },
    {
        id: 'GN1',
        name: 'Giày Nam',
        brands: [{
                id: 'AD',
                name: 'Adachi'
            },
            {
                id: 'GD',
                name: 'Giày da'
            },
            {
                id: 'GTT',
                name: 'Giày thời trang'
            }
        ]
    },
    {
        id: 'GN2',
        name: 'Giày nữ',
        brands: [{
            id: 'GN2',
            name: 'Giày nữ'
        }]
    },
    {
        id: 'PK',
        name: 'Phụ kiện',
        brands: [{
                id: 'DN',
                name: 'Thắt lưng'
            },
            {
                id: 'K',
                name: 'Kính'
            },
            {
                id: 'N',
                name: 'Nón'
            },
            {
                id: 'VD',
                name: 'Ví da'
            }
        ]
    },
    {
        id: 'QD',
        name: 'Quần Dài',
        brands: [{
                id: 'AD',
                name: 'Adachi'
            },
            {
                id: 'KM',
                name: 'Kirimaru'
            },
            {
                id: 'MB',
                name: 'Mabu'
            },
            {
                id: 'NS',
                name: 'No Style'
            },
            {
                id: 'QT',
                name: 'Quần tây'
            }
        ]
    },
    {
        id: 'QS',
        name: 'Quần Short',
        brands: [{
                id: 'AD',
                name: 'Adachi'
            },
            {
                id: 'KM',
                name: 'Kirimaru'
            },
            {
                id: 'MB',
                name: 'Mabu'
            },
            {
                id: 'NS',
                name: 'No Style'
            }
        ]
    }
];

function addRowItemList() {
    var table = document.getElementById('item-table');
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = '<input type="text" name="id" id="id-input" required>';
    row.insertCell(1).innerHTML = '<input type="number" name="count" id="count-input" required>';
    row.insertCell(2).innerHTML = '<p class="table-control"><i class="fas fa-times" onclick="deleteRow(this)"></i></p>';
}

function deleteRow(obj) {
    var index = obj.parentNode.parentNode.parentNode.rowIndex;
    console.log(index);
    var table = document.getElementById('item-table');
    table.deleteRow(index);
}