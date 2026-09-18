# KIẾN TRÚC HỆ THỐNG "DẠO BƯỚC CTU"

## 1. Tổng quan kiến trúc đa tầng (Multi-tier Architecture)
Ứng dụng được thiết kế theo mô hình kiến trúc phân lớp (Layered Architecture) với cơ chế Modularization của JavaScript ES Modules:

```
+-------------------------------------------------------------+
|                      PRESENTATION LAYER                     |
|  - HTML5 Canvas (3D Scene)                                  |
|  - Modern DOM UI (Menu, HUD, BuildingDialog, Passport, Map) |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                      APPLICATION / CORE                     |
|  - SceneManager (Game Loop, Lighting, Renderer)             |
|  - CameraController (Smooth Lerp Follow Target)             |
|  - InputController (WASD, Arrow Keys, Virtual Mobile Touch) |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                       GAMEPLAY MODULES                      |
|  - Character & Vehicle (Walk / Bicycle / Scooter / Motor)   |
|  - CampusMap3D (Roads, Buildings, Vegetation, Collisions)   |
|  - Navigation (Dynamic Red Arrow Wayfinding)                |
|  - BuildingManager & PanoramaViewer (360 Interactive View)  |
|  - PassportManager (Stamp Collection System)                |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                          DATA LAYER                         |
|  - mapData.js (Coordinates of Gates A, B, C & Buildings)   |
|  - buildingsData.js (Amenities, Photo paths, Stamp IDs)     |
|  - stampsData.js (Stamp metadata)                           |
|  - Web Storage API (localStorage for persistence)           |
+-------------------------------------------------------------+
```

---

## 2. Sơ đồ luồng trạng thái người chơi (User Flow)
1. **Menu khởi đầu:** Người dùng chọn bắt đầu trải nghiệm.
2. **Khởi tạo nhân vật & Điểm xuất phát:**
   - Chọn Giới tính: Nam / Nữ.
   - Chọn Trang phục: Áo xanh CTU truyền thống / Trang phục thường.
   - Chọn Phương tiện ban đầu: Đi bộ / Xe đạp CTU / Scooter điện / Xe máy.
   - Chọn Cổng xuất phát: Cổng A, Cổng B, hoặc Cổng C (tất cả trên trục đường 3/2).
3. **Gameplay chính (Vòng lặp tương tác):**
   - Di chuyển tự do trong không gian 3D khuôn viên CTU.
   - Chuyển đổi phương tiện bất kỳ lúc nào qua thanh HUD hoặc phím tắt `V`.
   - Mở bản đồ khuôn viên (Minimap) -> Chọn toà nhà muốn đến (ví dụ: CICT) -> Hệ thống vẽ mũi tên đỏ chỉ đường.
   - Khi tiến vào phạm vi toà nhà (ATL, CICT...): Hộp thoại tương tác xuất hiện:
     - *Tham quan tổng quát:* Mở chế độ xem toàn cảnh 360° đa góc nhìn có thể quẹt xoay hình ảnh.
     - *Tìm hiểu tiện ích:* Xem danh sách các phòng ban, tiện ích hỗ trợ sinh viên.
4. **Hệ thống Hộ chiếu (Passport CTU):**
   - Hoàn thành tham quan toà nhà -> Hệ thống tự động đóng dấu check-in (ví dụ: *"ATL Checked"*).
   - Tiến trình được ghi nhớ tự động vào `localStorage`.

---

## 3. Quản lý trạng thái phương tiện (Vehicle State Machine)
Nhân vật hỗ trợ 4 trạng thái vận tốc (`speedModifier`):
- `WALK`: Tốc độ 1.0x (bình thường, chi tiết).
- `BICYCLE`: Tốc độ 1.8x (xe đạp sinh viên CTU, bánh xe quay nhịp nhàng).
- `SCOOTER`: Tốc độ 2.5x (scooter điện, lướt êm ái).
- `MOTORBIKE`: Tốc độ 3.0x (xe máy, di chuyển nhanh giữa các khoa xa nhau).

Khi tiến vào bán kính tiếp xúc toà nhà, hệ thống tự động đưa nhân vật về trạng thái tiếp cận an toàn để mở hộp thoại tham quan.

---

## 4. Cơ chế tích hợp mô hình 3D từ Blender (Hybrid 3D Pipeline)
Hệ thống sử dụng cơ chế nạp mô hình kép (Dual Loading Fallback):
- **Ưu tiên 1:** Nếu phát hiện file 3D `.glb` tương ứng trong `public/assets/models/` (do người dùng thiết kế và xuất từ Blender), `GLTFLoader` sẽ tải mô hình tùy chỉnh đó.
- **Dự phòng (Fallback):** Nếu chưa có file `.glb`, Three.js Procedural Generator sẽ tự động sinh khối 3D chuẩn hóa (toà nhà ATL, CICT, cây xanh, xe cộ) với màu sắc và tỷ lệ thực tế, đảm bảo ứng dụng luôn chạy mượt mà ngay lập tức.

