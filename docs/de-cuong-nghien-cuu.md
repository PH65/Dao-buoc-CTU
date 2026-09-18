# ĐỀ CƯƠNG NGHIÊN CỨU KHOA HỌC SINH VIÊN

**TÊN ĐỀ TÀI:**  
**NGHIÊN CỨU VÀ XÂY DỰNG ỨNG DỤNG WEB 3D THAM QUAN ẢO KHUÔN VIÊN ĐẠI HỌC CẦN THƠ TÍCH HỢP GAMIFICATION VÀ ĐIỀU HƯỚNG ĐA PHƯƠNG TIỆN ("DẠO BƯỚC CTU")**

---

## 1. Lý do chọn đề tài (Tính cấp thiết)
- **Bối cảnh thực tiễn:** Trường Đại học Cần Thơ (CTU) – cơ sở Khu II có quy mô diện tích gần 90 hecta với hàng chục viện, trường thành viên, khoa, phòng thí nghiệm và hệ thống giảng đường phức hợp. Hàng năm, trường đón nhận hơn 10.000 tân sinh viên cùng hàng chục nghìn lượt phụ huynh, học sinh phổ thông và đối tác đến tham quan, học tập và làm việc.
- **Vấn đề tồn tại:** Người dùng mới thường xuyên gặp khó khăn trong việc định hướng đường đi, tìm kiếm các toà nhà học vụ và tiện ích hỗ trợ sinh viên. Cả 3 cổng chính (Cổng A, Cổng B, Cổng C) đều nằm dọc theo trục đường 3 Tháng 2 (phường Xuân Khánh / Ninh Kiều, Cần Thơ), khuôn viên trải dài vào sâu bên trong. Các phương thức hỗ trợ hiện tại (bản đồ giấy, sơ đồ 2D dạng ảnh tĩnh) thiếu tính trực quan, khó tương tác; trong khi các ứng dụng định vị phổ biến (Google Maps) chưa thể hiện chi tiết không gian nội bộ và không truyền tải được văn hoá học đường CTU.
- **Giải pháp đề xuất:** Đề tài nghiên cứu ứng dụng công nghệ **Web 3D tương tác thời gian thực (Three.js/WebGL)** kết hợp cơ chế **Trò chơi hoá (Gamification)** và **Mô phỏng di chuyển xanh (Bicycle/Scooter Mobility)**. Ứng dụng hoạt động trực tiếp trên trình duyệt Web không cần cài đặt, mang lại trải nghiệm khám phá không gian ảo trực quan, sống động và hấp dẫn.

---

## 2. Mục tiêu nghiên cứu
### 2.1. Mục tiêu chung
Xây dựng thành công ứng dụng Web 3D "Dạo bước CTU" hỗ trợ người dùng tham quan ảo khuôn viên Khu II Đại học Cần Thơ, định hướng đường đi thời gian thực và tra cứu thông tin tiện ích các toà nhà.

### 2.2. Mục tiêu cụ thể
1. **Mô hình hoá không gian 3D khuôn viên:** Tái hiện không gian Khu II (hệ thống đường nội bộ, thảm cỏ, cây xanh, các cổng chính A, B, C trên trục đường 3/2) và các toà nhà trọng điểm (Tòa nhà Công nghệ cao - ATL, Trường CNTT&TT - CICT, Hội trường Rùa, Nhà học C1, Thư viện...).
2. **Xây dựng hệ thống điều khiển & Đa phương tiện di chuyển:** Hiện thực hoá cơ chế điều khiển nhân vật di chuyển tự do với các tuỳ chọn phương tiện: Đi bộ, Xe đạp CTU, Scooter điện, Xe gắn máy.
3. **Phát triển thuật toán điều hướng thời gian thực (Waypoint Wayfinding):** Tự động vẽ đường dẫn đường bằng chuỗi mũi tên trực quan từ vị trí người chơi đến toà nhà được chọn trên bản đồ.
4. **Tích hợp cơ chế tương tác đa phương tiện & Gamification:**
   - Chế độ xem toàn cảnh 360° / quẹt xoay góc nhìn thực tế của toà nhà (như ATL).
   - Hệ thống "Hộ chiếu CTU" (Passport CTU) tự động đóng dấu check-in khi người chơi hoàn thành tham quan toà nhà, lưu trữ tiến trình qua LocalStorage.

---

## 3. Đối tượng và Phạm vi nghiên cứu
- **Đối tượng nghiên cứu:** 
  - Công nghệ đồ hoạ Web 3D (WebGL, Three.js).
  - Thuật toán tìm đường và điều hướng không gian 3D (Wayfinding & Path Generation).
  - Kỹ thuật Gamification trong ứng dụng hướng nghiệp, du lịch ảo học đường.
- **Phạm vi áp dụng:**
  - Không gian địa lý: Khuôn viên Khu II - Đại học Cần Thơ (trục mặt tiền đường 3/2 với Cổng A, Cổng B, Cổng C và các toà nhà tiêu biểu).
  - Nền tảng triển khai: Web đa nền tảng (Responsive trên cả Desktop và Smartphone).

---

## 4. Phương pháp nghiên cứu
1. **Phương pháp khảo sát & Thu thập dữ liệu thực địa:** 
   - Khảo sát sơ đồ Khu II, định vị toạ độ tương đối của các cổng và toà nhà.
   - Chụp ảnh thực tế đa góc nhìn (toàn cảnh, mặt tiền, hông toà nhà ATL, CICT...) để làm tư liệu tham quan 360° và tham chiếu tỷ lệ dựng hình 3D.
2. **Phương pháp mô hình hoá & Thiết kế 3D (Stylized / Low-poly):**
   - Xây dựng mô hình 3D tối ưu đa giác bằng Blender và công cụ Three.js Procedural Geometry nhằm đảm bảo hiệu năng tải trang web dưới 3 giây.
3. **Phương pháp lập trình & Tích hợp hệ thống:**
   - Sử dụng chuẩn JavaScript ES Modules, thư viện Three.js, công cụ đóng gói Vite.
   - Thiết kế mô hình kiến trúc hướng module (Modular Architecture) tách biệt rõ ràng giữa Core Engine, Map System, Character Controller, Navigation, UI và Data Layer.
4. **Phương pháp đánh giá & Kiểm thử:**
   - Kiểm thử chức năng (Functional Testing) trên các trình duyệt phổ biến (Chrome, Edge, Safari).
   - Đánh giá hiệu năng tốc độ khung hình (duy trì 60 FPS) và mức độ chiếm dụng bộ nhớ.

---

## 5. Công nghệ sử dụng
- **Engine 3D:** Three.js (WebGL rendering, Shadow maps, Raycasting, Camera Orbit/Follow).
- **Bundler & Dev Environment:** Vite (ES Modules, HMR).
- **Ngôn ngữ:** JavaScript (ES6+), HTML5 Canvas, CSS3 Modern Glassmorphism.
- **Dựng hình & Tài nguyên:** Blender 3D (xuất chuẩn .glb/glTF 2.0).
- **Lưu trữ cục bộ:** Web Storage API (localStorage).

---

## 6. Kế hoạch thực hiện (6 giai đoạn)
| Giai đoạn | Nội dung công việc | Kết quả đầu ra |
| :--- | :--- | :--- |
| **GĐ 1** | Khảo sát thực địa, thu thập bản đồ và hình ảnh các toà nhà | Bộ tư liệu ảnh toà nhà, sơ đồ vị trí toạ độ |
| **GĐ 2** | Thiết kế kiến trúc phần mềm và đặc tả mô hình dữ liệu | Sơ đồ module, file cấu hình toạ độ & dữ liệu JSON |
| **GĐ 3** | Xây dựng Scene 3D, mặt đất, hệ thống giao thông và toà nhà | Không gian ảo 3D khuôn viên CTU chạy trên Three.js |
| **GĐ 4** | Phát triển Character Controller, xe đạp/scooter và Navigation | Nhân vật di chuyển mượt mà, hệ thống mũi tên đỏ chỉ đường |
| **GĐ 5** | Tích hợp chế độ xem 360°, hộp thoại tiện ích và Hộ chiếu CTU | Bộ tính năng tương tác toà nhà và passport lưu trữ |
| **GĐ 6** | Tối ưu hóa hiệu năng, đóng gói nghiệm thu và viết báo cáo NCKH | Sản phẩm website hoàn chỉnh và báo cáo tổng kết |

---

## 7. Kết quả dự kiến & Đóng góp của đề tài
1. **Về mặt khoa học - công nghệ:** Làm chủ quy trình phát triển ứng dụng Web 3D dung lượng nhẹ, tối ưu hoá trải nghiệm tương tác trực quan thời gian thực trên nền web mà không phụ thuộc vào ứng dụng cài đặt nặng nề.
2. **Về mặt thực tiễn - xã hội:** 
   - Cung cấp một công cụ hỗ trợ tân sinh viên và khách tham quan làm quen với khuôn viên CTU một cách trực quan, thú vị.
   - Quảng bá hình ảnh hiện đại, năng động, thân thiện và định hướng "Đại học xanh - thông minh" của Đại học Cần Thơ đến cộng đồng học sinh, sinh viên cả nước.
