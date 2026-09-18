// Điểm khởi chạy của toàn bộ ứng dụng "Dạo bước CTU".
// Trình tự: MenuScreen -> CharacterSelect -> khởi tạo SceneManager & HUD -> vào gameplay.

import { SceneManager } from './core/SceneManager.js';
import { showMenu } from './ui/MenuScreen.js';
import { showCharacterSelect } from './character/CharacterSelect.js';
import { renderHUD } from './ui/HUD.js';
import { PassportManager } from './passport/PassportManager.js';
import { showPassport } from './passport/PassportUI.js';
import { toggleMiniMap } from './map/MiniMap.js';
import { BuildingManager } from './buildings/BuildingManager.js';
import { buildingsPositions } from './map/mapData.js';

window.addEventListener('DOMContentLoaded', () => {
  const passportManager = new PassportManager();
  let sceneManager = null;
  let hud = null;
  let currentDestination = null;

  // 1. Hiển thị Menu bắt đầu
  showMenu({
    onStart: () => {
      // 2. Chuyển sang màn hình chọn nhân vật & cổng xuất phát
      showCharacterSelect({
        onConfirm: async (characterOptions) => {
          passportManager.setPlayerInfo(characterOptions);

          // 3. Hiện Canvas 3D
          const canvas = document.getElementById('game-canvas');
          canvas.classList.remove('hidden');

          // 4. Khởi tạo BuildingManager
          const buildingManager = new BuildingManager(passportManager, null);

          // 5. Khởi tạo SceneManager
          sceneManager = new SceneManager(canvas, {
            buildingManager,
            hud: null
          });

          // 6. Khởi tạo HUD giao diện
          hud = renderHUD({
            passportManager,
            sceneManager,
            onSelectVehicle: (vType) => {
              sceneManager.setVehicle(vType);
            },
            onOpenMap: () => {
              toggleMiniMap({
                currentDestination,
                onSelectBuilding: (buildingId) => {
                  currentDestination = buildingId;
                  sceneManager.setDestination(buildingId);
                  const bInfo = buildingsPositions[buildingId];
                  const name = bInfo ? bInfo.name : buildingId;
                  hud.setDestinationText(`🧭 Điểm đến: ${name}`);
                  hud.showNotification(`Đã bật mũi tên đỏ dẫn đường đến: ${name}! Hãy đi theo mũi tên.`);
                },
                onClearNav: () => {
                  currentDestination = null;
                  sceneManager.clearDestination();
                  hud.setDestinationText('Khuôn viên Khu II - ĐH Cần Thơ');
                  hud.showNotification('Đã tắt đường dẫn.');
                }
              });
            },
            onOpenPassport: () => {
              showPassport(passportManager);
            }
          });

          // Gắn liên kết HUD vào SceneManager và BuildingManager
          sceneManager.hud = hud;
          buildingManager.hud = hud;

          // Khởi động Scene 3D
          await sceneManager.init(characterOptions);

          // Thông báo chào mừng
          setTimeout(() => {
            hud.showNotification(`Chào mừng bạn đến với Trường ĐH Cần Thơ! Hãy dùng phím WASD để dạo bước nhé!`);
          }, 800);
        }
      });
    }
  });
});

