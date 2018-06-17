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
    localhost:3030/bill_general?month=5
    localhost:3030/bill_general?year=2018
    localhost:3030/bill_general?month=1&year=2018
    localhost:3030/bill_detail?id=00000001

** manager 
    localhost:3030/manager_shop_list
    localhost:3030/manager_staff_list

    localhost:3030/manager_produc_list
    localhost:3030/manager_produc_list?category=AK
    localhost:3030/manager_produc_list?category=AK&brand=MB
    localhost:3030/manager_produc_list?brand=MB

    localhost:3030/manager_produc_detail?id=AK_MB_0000

    localhost:3030/manager_order_list
    localhost:3030/manager_order_list?month=1
    localhost:3030/manager_order_list?year=2018
    localhost:3030/manager_order_list?month=1&year=2018
    localhost:3030/manager_order_detail?id=00000001
