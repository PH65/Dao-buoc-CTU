// Dữ liệu bản đồ: toạ độ 3 cổng (A, B, C đều trên đường 3/2) và danh sách toà nhà
// dùng chung cho CampusMap3D, MiniMap và Navigation.

export const gates = {
  C: {
    id: 'C',
    name: 'Cổng C',
    street: 'Đường 3/2',
    description: 'Cổng gần nút giao Nguyễn Văn Linh - 3/2, gần ATL và Khoa Luật',
    position: { x: -75, y: 0, z: 75 }
  },
  B: {
    id: 'B',
    name: 'Cổng B',
    street: 'Đường 3/2',
    description: 'Cổng chính trung tâm - đối diện trục Nhà Điều hành & Thư viện',
    position: { x: 0, y: 0, z: 75 }
  },
  A: {
    id: 'A',
    name: 'Cổng A',
    street: 'Đường 3/2',
    description: 'Cổng phía Đông gần Cầu Đầu Sấu, Nhà học A3 và KTX Khu A',
    position: { x: 75, y: 0, z: 75 }
  }
};

export const buildingsPositions = {
  ATL: {
    id: 'ATL',
    name: 'Tòa nhà Công nghệ cao (ATL)',
    shortName: 'ATL',
    position: { x: -35, y: 0, z: 35 },
    size: { width: 22, height: 15, depth: 24 },
    interactRadius: 14
  },
  CICT: {
    id: 'CICT',
    name: 'Trường CNTT & TT (CICT)',
    shortName: 'CICT',
    position: { x: 10, y: 0, z: -35 },
    size: { width: 26, height: 12, depth: 18 },
    interactRadius: 14
  },
  TURTLE_HALL: {
    id: 'TURTLE_HALL',
    name: 'Hội trường Rùa',
    shortName: 'H.Trường Rùa',
    position: { x: -45, y: 0, z: -5 },
    size: { width: 18, height: 8, depth: 18 },
    interactRadius: 12
  },
  C1: {
    id: 'C1',
    name: 'Khu Nhà học C1',
    shortName: 'Nhà C1',
    position: { x: 18, y: 0, z: 8 },
    size: { width: 25, height: 10, depth: 14 },
    interactRadius: 12
  },
  LIBRARY: {
    id: 'LIBRARY',
    name: 'Trung tâm Học liệu (Thư viện)',
    shortName: 'Thư Viện',
    position: { x: 42, y: 0, z: 38 },
    size: { width: 20, height: 12, depth: 16 },
    interactRadius: 12
  }
};

