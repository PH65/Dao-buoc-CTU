// Hằng số dùng chung toàn dự án "Dạo bước CTU"

export const VEHICLE_TYPES = {
  WALK: 'WALK',
  BICYCLE: 'BICYCLE',
  SCOOTER: 'SCOOTER',
  MOTORBIKE: 'MOTORBIKE'
};

export const VEHICLE_CONFIGS = {
  [VEHICLE_TYPES.WALK]: {
    id: 'WALK',
    name: 'Đi bộ',
    icon: '🚶',
    speed: 0.18,
    labelSpeed: '5 km/h',
    description: 'Thong thả dạo bước ngắm cảnh khuôn viên'
  },
  [VEHICLE_TYPES.BICYCLE]: {
    id: 'BICYCLE',
    name: 'Xe đạp CTU',
    icon: '🚲',
    speed: 0.32,
    labelSpeed: '15 km/h',
    description: 'Chiếc xe đạp sinh viên CTU thân thiện môi trường'
  },
  [VEHICLE_TYPES.SCOOTER]: {
    id: 'SCOOTER',
    name: 'Scooter điện',
    icon: '🛴',
    speed: 0.44,
    labelSpeed: '22 km/h',
    description: 'Phương tiện xanh hiện đại lướt êm ái'
  },
  [VEHICLE_TYPES.MOTORBIKE]: {
    id: 'MOTORBIKE',
    name: 'Xe gắn máy',
    icon: '🛵',
    speed: 0.58,
    labelSpeed: '35 km/h',
    description: 'Di chuyển nhanh qua các trục đường lớn'
  }
};

export const BUILDING_INTERACT_DISTANCE = 9.0; // Khoảng cách kích hoạt hộp thoại toà nhà
export const STORAGE_KEY_PASSPORT = 'CTU_PASSPORT_DATA';
export const STORAGE_KEY_SETTINGS = 'CTU_GAME_SETTINGS';

