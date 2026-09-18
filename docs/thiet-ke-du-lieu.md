# ĐẶC TẢ THIẾT KẾ DỮ LIỆU "DẠO BƯỚC CTU"

## 1. Dữ liệu các Cổng xuất phát (Gates - Trục đường 3/2)
Các cổng A, B, C đều tọa lạc trên mặt tiền đường 3 Tháng 2, tương ứng với các toạ độ không gian 3D $(x, y, z)$ trong Three.js (với trục $y = 0$ là cao độ mặt đất):

```javascript
export const gates = {
  C: {
    id: 'C',
    name: 'Cổng C',
    address: 'Đường 3/2 (gần nút giao Nguyễn Văn Linh)',
    position: { x: -80, y: 0, z: 70 },
    description: 'Cổng tiếp giáp khu vực Khoa Sư phạm, Khoa Luật và Tòa nhà Công nghệ cao ATL.'
  },
  B: {
    id: 'B',
    name: 'Cổng B',
    address: 'Đường 3/2 (Cổng chính - Khu vực trung tâm)',
    position: { x: 0, y: 0, z: 70 },
    description: 'Cổng trung tâm đối diện trục Nhà Điều hành, Trung tâm Học liệu và Nhà học C1.'
  },
  A: {
    id: 'A',
    name: 'Cổng A',
    address: 'Đường 3/2 (gần Cầu Đầu Sấu)',
    position: { x: 80, y: 0, z: 70 },
    description: 'Cổng phía Đông tiếp giáp Nhà học A3, Khoa KHXH&NV, Khoa KHTN và KTX Khu A.'
  }
};
```

---

## 2. Dữ liệu Toà nhà & Tiện ích (Buildings & Amenities)
Mỗi toà nhà chứa thông tin định danh, tên gọi, vị trí 3D, danh mục tiện ích, mảng hình ảnh thực tế (phục vụ chế độ tham quan toàn cảnh quẹt xoay) và mã dấu Passport:

```javascript
export const buildings = {
  ATL: {
    id: 'ATL',
    code: 'ATL',
    name: 'Tòa nhà Công nghệ cao (ATL)',
    subName: 'CTU Hi-Tech Building (Dự án JICA)',
    position: { x: -35, y: 0, z: 25 },
    size: { width: 18, height: 14, depth: 22 },
    description: 'Công trình kiến trúc hiện đại thuộc dự án nâng cấp trường ĐH Cần Thơ do JICA (Nhật Bản) tài trợ, gồm các phòng thí nghiệm công nghệ cao, phòng nghiên cứu chuyên sâu và văn phòng viện.',
    amenities: [
      'Phòng thí nghiệm Công nghệ sinh học hiện đại',
      'Hệ thống phòng nghiên cứu Công nghệ cao',
      'Phòng máy chủ & Tính toán hiệu năng cao',
      'Hội trường hội thảo quốc tế',
      'Khu vực sảnh triển lãm nghiên cứu khoa học',
      'Khu tiện ích thang máy & WC hiện đại các tầng'
    ],
    photos: [
      '/assets/images/panorama/atl/phia-truoc-atl.jpg',
      '/assets/images/panorama/atl/phia-truoc-xien-trai-atl.jpeg',
      '/assets/images/panorama/atl/phia-truoc-xien-phai-atl.jpg',
      '/assets/images/panorama/atl/phia-truoc-atl-2.jpg',
      '/assets/images/panorama/atl/phia-hong-atl.jpg'
    ],
    passportStampId: 'atl_check'
  },
  CICT: {
    id: 'CICT',
    code: 'DI',
    name: 'Trường Công nghệ Thông tin & Truyền thông (CICT)',
    subName: 'Khoa CNTT&TT trước đây',
    position: { x: 5, y: 0, z: -30 },
    size: { width: 22, height: 10, depth: 16 },
    description: 'Trung tâm đào tạo và nghiên cứu đầu ngành về CNTT, Khoa học máy tính, Kỹ thuật phần mềm, Mạng máy tính và An toàn thông tin tại ĐBSCL.',
    amenities: [
      'Văn phòng Ban Giám hiệu trường CNTT&TT',
      'Hơn 20 phòng thực hành máy tính chuyên dụng',
      'Phòng nghiên cứu AI, IoT & Dữ liệu lớn',
      'Văn phòng Đoàn - Hội trường CICT',
      'Khu tự học sinh viên (CICT Student Lounge)',
      'Hội trường tổ chức hội thảo công nghệ'
    ],
    photos: [],
    passportStampId: 'cict_check'
  },
  TURTLE_HALL: {
    id: 'TURTLE_HALL',
    name: 'Hội trường Rùa',
    subName: 'Biểu tượng lịch sử văn hoá CTU',
    position: { x: -40, y: 0, z: -10 },
    size: { width: 16, height: 7, depth: 16 },
    description: 'Hội trường lớn với kiến trúc mái vòm hình mai rùa độc đáo, nơi diễn ra các lễ khai giảng, tốt nghiệp và sự kiện trọng đại của trường.',
    amenities: [
      'Khán phòng chính sức chứa hơn 1.000 chỗ ngồi',
      'Sân khấu biểu diễn nghệ thuật sinh viên',
      'Quảng trường và hồ sen kỷ niệm xung quanh'
    ],
    photos: [],
    passportStampId: 'turtle_hall_check'
  },
  C1: {
    id: 'C1',
    name: 'Nhà học C1',
    subName: 'Khu giảng đường trung tâm',
    position: { x: 15, y: 0, z: 0 },
    size: { width: 24, height: 9, depth: 12 },
    description: 'Khu giảng đường phức hợp với nhiều phòng học lý thuyết dành cho sinh viên các khoa.',
    amenities: [
      'Hệ thống giảng đường từ 50 - 150 chỗ',
      'Khu vực tự học hành lang xanh',
      'Căn tin sinh viên liền kề'
    ],
    photos: [],
    passportStampId: 'c1_check'
  },
  LIBRARY: {
    id: 'LIBRARY',
    name: 'Trung tâm Học liệu (Thư viện)',
    subName: 'Thư viện trung tâm ĐH Cần Thơ',
    position: { x: 30, y: 0, z: 35 },
    size: { width: 18, height: 11, depth: 15 },
    description: 'Một trong những trung tâm học liệu hiện đại nhất khu vực ĐBSCL với hàng trăm nghìn đầu sách, tài liệu số và phòng đọc yên tĩnh.',
    amenities: [
      'Phòng đọc sách mở đa ngành',
      'Khu máy tính tra cứu tài liệu số',
      'Phòng thảo luận nhóm sinh viên',
      'Khu in ấn, photo tài liệu'
    ],
    photos: [],
    passportStampId: 'library_check'
  }
};
```

---

## 3. Dữ liệu Con dấu Hộ chiếu (Passport Stamps)
```javascript
export const stamps = {
  atl_check: {
    id: 'atl_check',
    buildingId: 'ATL',
    name: 'Dấu mộc Tòa nhà Công nghệ cao',
    title: 'ATL CHECK',
    color: '#0066cc',
    icon: '🔬',
    dateDesc: 'Khám phá Công nghệ cao'
  },
  cict_check: {
    id: 'cict_check',
    buildingId: 'CICT',
    name: 'Dấu mộc Trường CNTT&TT',
    title: 'CICT CHECK',
    color: '#e65100',
    icon: '💻',
    dateDesc: 'Khám phá Công nghệ thông tin'
  },
  turtle_hall_check: {
    id: 'turtle_hall_check',
    buildingId: 'TURTLE_HALL',
    name: 'Dấu mộc Hội trường Rùa',
    title: 'TURTLE HALL CHECK',
    color: '#2e7d32',
    icon: '🐢',
    dateDesc: 'Khám phá Biểu tượng CTU'
  },
  c1_check: {
    id: 'c1_check',
    buildingId: 'C1',
    name: 'Dấu mộc Nhà học C1',
    title: 'C1 CHECK',
    color: '#6a1b9a',
    icon: '📚',
    dateDesc: 'Khám phá Giảng đường C1'
  },
  library_check: {
    id: 'library_check',
    buildingId: 'LIBRARY',
    name: 'Dấu mộc Trung tâm Học liệu',
    title: 'LIBRARY CHECK',
    color: '#00838f',
    icon: '📖',
    dateDesc: 'Khám phá Thư viện'
  }
};
```

---

## 4. Dữ liệu Phương tiện (Vehicles)
```javascript
export const VEHICLES = {
  WALK: {
    id: 'walk',
    name: 'Đi bộ',
    icon: '🚶',
    speed: 0.18,
    labelSpeed: '5 km/h',
    description: 'Thong thả dạo bước ngắm cảnh khuôn viên'
  },
  BICYCLE: {
    id: 'bicycle',
    name: 'Xe đạp CTU',
    icon: '🚲',
    speed: 0.32,
    labelSpeed: '15 km/h',
    description: 'Chiếc xe đạp sinh viên CTU thân thiện môi trường'
  },
  SCOOTER: {
    id: 'scooter',
    name: 'Scooter điện',
    icon: '🛴',
    speed: 0.45,
    labelSpeed: '22 km/h',
    description: 'Phương tiện xanh hiện đại lướt êm ái'
  },
  MOTORBIKE: {
    id: 'motorbike',
    name: 'Xe gắn máy',
    icon: '🛵',
    speed: 0.58,
    labelSpeed: '35 km/h',
    description: 'Di chuyển nhanh qua các trục đường lớn'
  }
};
```

---

## 5. Cấu trúc lưu trữ cục bộ (LocalStorage Schema)
Khóa: `CTU_PASSPORT_DATA`  
Giá trị (JSON Object):
```json
{
  "playerName": "Sinh viên CTU",
  "gender": "male",
  "wearCtuShirt": true,
  "startGate": "B",
  "collectedStamps": [
    {
      "stampId": "atl_check",
      "timestamp": "2026-09-17T18:50:00.000Z"
    }
  ],
  "visitedBuildings": ["ATL"]
}
```

