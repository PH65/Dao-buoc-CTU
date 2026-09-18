# Dạo bước CTU

Website dạng game nhẹ cho phép người dùng tham quan ảo khuôn viên
Trường Đại học Cần Thơ (CTU) dưới dạng nhân vật di chuyển trên bản đồ 3D.

## Công nghệ
- Three.js (dựng scene 3D, nhân vật, bản đồ)
- Vite (dev server / build)
- Vanilla JavaScript (ES Modules)

## Cài đặt
```bash
npm install
npm run dev
```

## Cấu trúc thư mục

```
dao-buoc-ctu/
├── docs/                      Tài liệu nghiên cứu (đề cương, thiết kế)
├── public/assets/
│   ├── models/                Model 3D (.glb): nhân vật, toà nhà, địa hình
│   ├── textures/               Texture bản đồ, mặt đất, v.v.
│   ├── images/panorama/       Ảnh 360 từng toà nhà
│   └── audio/                 Âm thanh nền / hiệu ứng (nếu có)
└── src/
    ├── main.js                Điểm khởi chạy ứng dụng
    ├── core/                  Scene, camera, input, asset loader
    ├── character/             Chọn & điều khiển nhân vật
    ├── map/                   Bản đồ 3D, minimap, chỉ đường (mũi tên đỏ)
    ├── buildings/              Dữ liệu & tương tác các toà nhà, panorama viewer
    ├── passport/               Hệ thống thu thập dấu "Passport CTU"
    ├── ui/                     Menu, HUD, dialog dùng chung
    └── utils/                  Hằng số, lưu trữ localStorage
```

## Luồng chơi chính
1. Menu -> Chọn nhân vật (nam/nữ, áo CTU) -> Chọn cổng xuất phát (A/B/C)
2. Di chuyển nhân vật trên bản đồ 3D bằng phím/vuốt
3. Đến gần 1 toà nhà -> hộp thoại: "Tham quan tổng quát" hoặc "Tìm hiểu tiện ích"
4. Tham quan tổng quát -> mở PanoramaViewer (ảnh 360, vuốt xoay)
5. Icon Bản đồ -> chọn toà nhà đích -> Navigation vẽ mũi tên đỏ dẫn đường
6. Tham quan xong 1 toà nhà -> nhận dấu trong Passport CTU
