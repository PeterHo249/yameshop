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
    localhost:3030/product_staff?productId=AK_MB_0000//loi

------ bill
    localhost:3030/bill_general
    localhost:3030/bill_general?month=1
    localhost:3030/bill_general?year=2018
    localhost:3030/bill_general?month=1&year=2018
    localhost:3030/bill_detail?id=1

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
    localhost:3030/manager_order_detail?id=1

    //Lưu ý đối với trường update chỉ cần có id là bắt buộc , các trường khác trong ví dụ có thể có hoặc không, để xem thay đổi thì mở file dữ liệu lên,
    ,chỉ có 1 biến dữ liệu đối với mỗi đối tượng dữ liệu đọc từ file lên nên nếu thực hiện nhiều thao tác trên biến này sẽ dẫn đến dữ liệu bị sai, sử dụng "rs" để reset lại biến
    (bản hoàn chỉnh sẽ tính số lượt request r mới ghi dữ liệu xuống, k ghi liên tục như hiện tại)
    localhost:3030/add_new_staff : {"name":"Trần Mạnh Chung11","role":"staff","username":"user0","password":"123456", "shop":"shop_0"}
    localhost:3030/update_staff_info : {"id":"Nhan_Vien_0","name":"Trần Mạnh Chung11","role":"staff","username":"user0","password":"123456", "shop":"shop_0"}
    localhost:3030/delete_staff : {"id":"Nhan_Vien_0"}

    localhost:3030/delete_product : {"id":"AK_AD_0000"}
    localhost:3030/update_product : {"id":"AK_AD_0000","in_stock":"true","name":"tranmanhchung","list_size":[{"size":"M","list_color":[{"color":"C","list_shop":[{"id_shop":"shop_8","inventory_num":"1"}]}]}]}

    localhost:3030/add_new_order : {"date":"17/3/2018","type":"in" ,"staff_id":"Nhan_Vien_5","shop_id":"shop_13","list_item":[{"id":"AK_AD_0057","count":"44"},{"id":"AK_AD_0058","count":"2"}]}
    localhost:3030/update_order_info : {"id":"29","staff_id":"Nhan_Vien_5","shop_id":"shop_13","list_item":[{"id":"AK_AD_0027","count":"44"},{"id":"AK_AD_0028","count":"2"}]}
    localhost:3030/delete_order : {"id":"29"}
    //nho goi kem type of order

    localhost:3030/delete_shop : {"id":"shop_0"}
    localhost:3030/add_new_shop : {"name":"YaMe Q.10: 770F, Sư Vạn Hạnh (nd), P.12 ", "address":"770F, Sư Vạn Hạnh (nd), P.12"}
    localhost:3030/update_shop_info : {"id":"shop_1", "name": "TMC", "address":"TMC"}

    data test add order: {"date":"17/3/2018","type":"in" ,"staff_id":"Nhan_Vien_5","shop_id":"shop_13","list_item":[{"id":"AK_AD_0000_M_C","count":"10"},{"id":"AK_AD_0000_M_XN","count":"10"}]}
    

