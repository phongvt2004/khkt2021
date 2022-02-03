# khkt21
Mô hình:
- Api
    controllers => Rest API
    models => Cấu trúc dữ liệu database
    middlewares => chứa các middleware
- App => frontend
    public => chứa các file css, js,...
      css
      js
      uploads => nơi up dữ liệu
        img
        video
        files
    views => hiển thị UI
      resourses => tài nguyên của trang
        image
        vendor => các thư viện, ...
-config/db => kết nối database
- routes => định nghĩa các tuyến đường
    api => lấy api
    etc => các tuyến render giao diện
    index.js => đường trang chủ
- index.js

******User Infomation********
fullname: string
username: string
email: string
password: string
class: number
gender: string
goodAt: array => Môn học tốt
badAt: array => Môn học chưa tốt

******API********
post: /api/auth/register => đăng kí
post: /api/auth/login => Đăng nhập
get: /api/auth/login => Đăng xuất
# khkt2021
