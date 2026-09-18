// Dữ liệu chi tiết từng toà nhà: tên đầy đủ, mô tả, danh sách tiện ích,
// danh sách ảnh toàn cảnh thực tế và mã dấu passport tương ứng.

export const buildings = {
  ATL: {
    id: 'ATL',
    code: 'ATL',
    name: 'Tòa nhà Công nghệ cao (ATL)',
    subTitle: 'CTU Hi-Tech Building (Dự án JICA)',
    color: '#0066cc',
    description: 'Công trình kiến trúc hiện đại bậc nhất Trường Đại học Cần Thơ thuộc dự án ODA của JICA (Nhật Bản). Tòa nhà cao 7 tầng với hệ thống phòng thí nghiệm công nghệ cao, phòng nuôi cấy mô, trung tâm nghiên cứu chuyên sâu và văn phòng viện.',
    amenities: [
      'Phòng thí nghiệm Công nghệ sinh học & Thực phẩm',
      'Hệ thống phòng nghiên cứu Công nghệ cao',
      'Phòng máy chủ & Tính toán hiệu năng cao (HPC)',
      'Hội trường tổ chức hội thảo quốc tế',
      'Khu triển lãm thành tựu nghiên cứu khoa học',
      'Khu tiện ích thang máy & WC hiện đại từng tầng'
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
    subTitle: 'Khoa CNTT&TT trước đây',
    color: '#e65100',
    description: 'Cái nôi đào tạo và nghiên cứu nguồn nhân lực công nghệ số hàng đầu vùng ĐBSCL. Trường bao gồm nhiều bộ môn mũi nhọn: Kỹ thuật phần mềm, Khoa học máy tính, Hệ thống thông tin, Mạng máy tính & An toàn thông tin, Trí tuệ nhân tạo.',
    amenities: [
      'Văn phòng Ban Giám hiệu trường CNTT&TT',
      'Hơn 20 phòng thực hành máy tính cấu hình cao',
      'Phòng nghiên cứu AI, Big Data & IoT Lab',
      'Khu vực tự học CICT Student Lounge & Căn tin',
      'Văn phòng Đoàn TN - Hội Sinh viên CICT',
      'Hội trường báo cáo đồ án tốt nghiệp'
    ],
    photos: [
      '/assets/images/panorama/atl/phia-truoc-xien-trai-atl.jpeg'
    ],
    passportStampId: 'cict_check'
  },
  TURTLE_HALL: {
    id: 'TURTLE_HALL',
    name: 'Hội trường Rùa',
    subTitle: 'Biểu tượng lịch sử văn hoá trường ĐH Cần Thơ',
    color: '#2e7d32',
    description: 'Công trình kiến trúc độc đáo với mái vòm mô phỏng hình mai rùa, gắn liền với ký ức của biết bao thế hệ sinh viên Cần Thơ. Nơi diễn ra các sự kiện khai giảng, bế giảng và đại nhạc hội sinh viên lớn nhất trường.',
    amenities: [
      'Khán phòng chính sức chứa hơn 1.200 chỗ ngồi',
      'Sân khấu nghệ thuật và hệ thống âm thanh ánh sáng',
      'Khuôn viên quảng trường và hồ sen râm mát xung quanh',
      'Địa điểm check-in kỷ yếu truyền thống'
    ],
    photos: [],
    passportStampId: 'turtle_hall_check'
  },
  C1: {
    id: 'C1',
    name: 'Khu Nhà học C1',
    subTitle: 'Khu giảng đường trung tâm',
    color: '#6a1b9a',
    description: 'Khu giảng đường lớn nằm ở trục trung tâm trường, phục vụ giảng dạy các môn học đại cương và chuyên ngành cho sinh viên nhiều khoa.',
    amenities: [
      'Hệ thống giảng đường bậc thang từ 60 - 200 chỗ ngồi',
      'Khu vực hành lang ghế đá tự học thoáng mát',
      'Căn tin sinh viên phục vụ ăn uống liền kề'
    ],
    photos: [],
    passportStampId: 'c1_check'
  },
  LIBRARY: {
    id: 'LIBRARY',
    name: 'Trung tâm Học liệu (Thư viện)',
    subTitle: 'Thư viện trung tâm ĐH Cần Thơ',
    color: '#00838f',
    description: 'Trung tâm tư liệu và học liệu số hiện đại, nơi cung cấp nguồn tài nguyên sách, tạp chí khoa học quốc tế, không gian đọc sách yên tĩnh và máy tính tra cứu tự động cho toàn thể giảng viên, sinh viên.',
    amenities: [
      'Phòng đọc sách mở với hàng trăm nghìn đầu sách',
      'Hệ thống máy tính tra cứu cơ sở dữ liệu số',
      'Khu phòng thảo luận nhóm trang bị màn hình chiếu',
      'Khu vực in ấn, photocopy tài liệu học tập'
    ],
    photos: [],
    passportStampId: 'library_check'
  }
};

