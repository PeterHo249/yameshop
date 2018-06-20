Các api server cung cấp hiện tại:

* Lấy thông tin sản phẩm hot và trend
    localhost:3030/home_guest

* Lấy thông tin danh sách sản phẩm
    localhost:3030/product_list?category=...&brand=...

* Lấy thông tin một sản phẩm
    localhost:3030/product?productId=.......
    - Lưu ý: productId có dạng như sau AK_MB_0000_L với L là size sản phẩm

** Dùng postman để kiểm tra các api với các url sau:
    localhost:3030/home_guest
    localhost:3030/product_list?category=AK
    localhost:3030/product_list?category=AK&brand=AD
    localhost:3030/product?productId=AK_MB_0000_L


//-----------------------------------------
** For staff
    localhost:3030/product_list_staff
    localhost:3030/product_list_staff?category=AK
    localhost:3030/product_list_staff?brand=MB
    localhost:3030/product_list_staff?category=AK&brand=AD
    localhost:3030/product_staff?productId=AK_MB_0000

------ bill
    localhost:3030/bill_general
    localhost:3030/bill_general?month=1
    localhost:3030/bill_general?year=2018
    localhost:3030/bill_general?month=1&year=2018
    localhost:3030/bill_detail?id=00000001

** manager 
    localhost:3030/manager_shop_list
    localhost:3030/manager_staff_list

    localhost:3030/manager_product_list
    localhost:3030/manager_product_list?category=AK
    localhost:3030/manager_product_list?category=AK&brand=MB
    localhost:3030/manager_product_list?brand=MB

    localhost:3030/manager_product_detail?id=AK_MB_0000

    localhost:3030/manager_order_list
    localhost:3030/manager_order_list?month=1
    localhost:3030/manager_order_list?year=2018
    localhost:3030/manager_order_list?month=1&year=2018
    localhost:3030/manager_order_detail?id=00000001


    localhost:3030/add_new_staff : {"id":"Nhan_Vien_0","name":"Trần Mạnh Chung11","role":"staff","username":"user0","password":"123456", "shop":"shop_0"}
    localhost:3030/update_staff_info : {"id":"Nhan_Vien_0","name":"Trần Mạnh Chung11","role":"staff","username":"user0","password":"123456", "shop":"shop_0"}
    localhost:3030/delete_staff : {"id":"Nhan_Vien_0"}

    localhost:3030/delete_product : {"id":"QS_NS_0020"}

    localhost:3030/add_new_order : [{"id":"00000001","date":"17/1/2018","type":"in" ,"total":"1071720296","staff_id":"Nhan_Vien_5","shop_id":"shop_13","name_of_staff":"Nguyễn Văn D","name_of_shop":"Yame Q.9: 114 Đỗ Xuân Hợp (Sắp KT)","list_item":[{"id":"AK_AD_0057","count":"44","name":"Áo Khoác Nữ Adachi Thun G03","price":"165000","sum_price":7260000},{"id":"AK_AD_0058","count":"2","name":"Áo Khoác Nam Adachi Thun S02","price":"285000","sum_price":570000}],"revenue":7830000},{"id":"00000001","date":"17/1/2018","total":"1071720296","staff_id":"Nhan_Vien_5","shop_id":"shop_13","name_of_staff":"Nguyễn Văn D","name_of_shop":"Yame Q.9: 114 Đỗ Xuân Hợp (Sắp KT)","list_item":[{"id":"AK_AD_0057","count":"44","name":"Áo Khoác Nữ Adachi Thun G03","price":"165000","sum_price":7260000},{"id":"AK_AD_0058","count":"2","name":"Áo Khoác Nam Adachi Thun S02","price":"285000","sum_price":570000}],"revenue":7830000}]
    localhost:3030/update_order_info : [{"id":"00000001","date":"17/1/2018","type":"in","total":"1071720296","staff_id":"Nhan_Vien_10000000000","shop_id":"shop_13","name_of_staff":"Nguyễn Văn D","name_of_shop":"Yame Q.9: 114 Đỗ Xuân Hợp (Sắp KT)","list_item":[{"id":"AK_AD_0057","count":"44","name":"Áo Khoác Nữ Adachi Thun G03","price":"165000","sum_price":7260000},{"id":"AK_AD_0058","count":"2","name":"Áo Khoác Nam Adachi Thun S02","price":"285000","sum_price":570000}],"revenue":7830000},{"id":"00000001","date":"17/1/2018","total":"1071720296","staff_id":"Nhan_Vien_5","shop_id":"shop_13","name_of_staff":"Nguyễn Văn D","name_of_shop":"Yame Q.9: 114 Đỗ Xuân Hợp (Sắp KT)","list_item":[{"id":"AK_AD_0057","count":"44","name":"Áo Khoác Nữ Adachi Thun G03","price":"165000","sum_price":7260000},{"id":"AK_AD_0058","count":"2","name":"Áo Khoác Nam Adachi Thun S02","price":"285000","sum_price":570000}],"revenue":7830000}]
    localhost:3030/delete_order : {"id":"00000004"}
    //nho goi kem type of order

    localhost:3030/delete_shop : {"id":"shop_0"}
    localhost:3030/add_new_shop : {"id":"shop_100000", "name":"YaMe Q.10: 770F, Sư Vạn Hạnh (nd), P.12 ", "address":"770F, Sư Vạn Hạnh (nd), P.12"}
    localhost:3030/update_shop_info : {"id":"shop_1", "name": "TMC", "address":"TMC"}
    

