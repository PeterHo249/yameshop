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