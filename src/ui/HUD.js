// Thanh giao diện trong lúc chơi: icon mở MiniMap, icon mở Passport,
// nút đổi phương tiện nhanh, thông báo toast và bộ phím ảo trên mobile.

import { VEHICLE_TYPES, VEHICLE_CONFIGS } from '../utils/constants.js';

export function renderHUD({ onOpenMap, onOpenPassport, onSelectVehicle, sceneManager, passportManager }) {
  const hudContainer = document.getElementById('hud');
  if (!hudContainer) return null;

  hudContainer.classList.remove('hidden');

  let currentVehicleIndex = 0;
  const vehicleList = Object.keys(VEHICLE_TYPES);

  hudContainer.innerHTML = `
    <!-- Top-left: Huy hiệu CTU & Thông tin vị trí -->
    <div class="hud-top-left">
      <div class="hud-card ctu-brand">
        <span class="ctu-logo-icon">🏛️</span>
        <div class="brand-text">
          <strong>DẠO BƯỚC CTU</strong>
          <small id="hud-nav-status">Khuôn viên Khu II - ĐH Cần Thơ</small>
        </div>
      </div>
    </div>

    <!-- Top-right: Nút thao tác chính -->
    <div class="hud-top-right">
      <button class="hud-circle-btn" id="btn-hud-vehicle" title="Đổi phương tiện (Phím V)">
        <span class="hud-btn-icon" id="hud-vehicle-icon">🚶</span>
        <span class="hud-btn-label" id="hud-vehicle-label">Đi bộ</span>
      </button>

      <button class="hud-circle-btn" id="btn-hud-map" title="Bản đồ chỉ đường (Phím M)">
        <span class="hud-btn-icon">🗺️</span>
        <span class="hud-btn-label">Bản đồ</span>
      </button>

      <button class="hud-circle-btn" id="btn-hud-passport" title="Hộ chiếu CTU (Phím P)">
        <span class="hud-btn-icon">📘</span>
        <span class="hud-btn-label">Hộ chiếu</span>
      </button>

      <button class="hud-circle-btn" id="btn-hud-export" title="Xuất file 3D cho Blender (.glb)">
        <span class="hud-btn-icon">📥</span>
        <span class="hud-btn-label">Xuất Blender</span>
      </button>

      <button class="hud-circle-btn btn-small" id="btn-hud-help" title="Hướng dẫn">
        <span class="hud-btn-icon">❓</span>
      </button>
    </div>

    <!-- D-pad cảm ứng cho điện thoại (Góc dưới bên trái) -->
    <div class="hud-touch-controls" id="touch-controls">
      <div class="dpad-grid">
        <button class="dpad-btn up" id="dpad-up">▲</button>
        <button class="dpad-btn left" id="dpad-left">◀</button>
        <div class="dpad-center">●</div>
        <button class="dpad-btn right" id="dpad-right">▶</button>
        <button class="dpad-btn down" id="dpad-down">▼</button>
      </div>
    </div>

    <!-- Phím tắt gợi ý trên máy tính (Góc dưới bên phải) -->
    <div class="hud-bottom-right">
      <div class="keyboard-hints">
        <span>⌨️ <strong>WASD / Mũi tên:</strong> Di chuyển</span>
        <span>🚲 <strong>V:</strong> Đổi xe</span>
        <span>🗺️ <strong>M:</strong> Bản đồ</span>
        <span>📘 <strong>P:</strong> Hộ chiếu</span>
      </div>
    </div>

    <!-- Toast Notification (Giữa màn hình phía dưới) -->
    <div class="hud-toast-container" id="hud-toast-container"></div>
  `;

  const vehicleBtn = hudContainer.querySelector('#btn-hud-vehicle');
  const vehicleIcon = hudContainer.querySelector('#hud-vehicle-icon');
  const vehicleLabel = hudContainer.querySelector('#hud-vehicle-label');
  const navStatus = hudContainer.querySelector('#hud-nav-status');
  const toastContainer = hudContainer.querySelector('#hud-toast-container');

  function cycleNextVehicle() {
    currentVehicleIndex = (currentVehicleIndex + 1) % vehicleList.length;
    const vType = vehicleList[currentVehicleIndex];
    const config = VEHICLE_CONFIGS[vType];
    vehicleIcon.textContent = config.icon;
    vehicleLabel.textContent = config.name;

    if (onSelectVehicle) onSelectVehicle(vType);
    showNotification(`Đã chuyển sang: ${config.icon} ${config.name} (${config.labelSpeed})`);
  }

  function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'hud-toast animate-slide-up';
    toast.innerHTML = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  function setDestinationText(text) {
    if (navStatus) navStatus.textContent = text;
  }

  // Gắn sự kiện nút HUD
  vehicleBtn.addEventListener('click', cycleNextVehicle);
  hudContainer.querySelector('#btn-hud-map').addEventListener('click', onOpenMap);
  hudContainer.querySelector('#btn-hud-passport').addEventListener('click', onOpenPassport);
  const btnExport = hudContainer.querySelector('#btn-hud-export');
  if (btnExport && sceneManager) {
    btnExport.addEventListener('click', () => {
      sceneManager.exportToGLTF();
    });
  }
  hudContainer.querySelector('#btn-hud-help').addEventListener('click', () => {
    showNotification('💡 Dạo bước đến gần các toà nhà (ATL, CICT, C1, Thư viện, Rùa) để khám phá và đóng dấu Passport!');
  });

  // Gắn sự kiện D-pad cảm ứng cho mobile
  if (sceneManager && sceneManager.inputController) {
    const dpadUp = hudContainer.querySelector('#dpad-up');
    const dpadDown = hudContainer.querySelector('#dpad-down');
    const dpadLeft = hudContainer.querySelector('#dpad-left');
    const dpadRight = hudContainer.querySelector('#dpad-right');

    let touchX = 0;
    let touchZ = 0;

    const bindDpad = (btn, dx, dz) => {
      const start = (e) => {
        e.preventDefault();
        touchX = dx;
        touchZ = dz;
        sceneManager.inputController.setTouchVector(touchX, touchZ);
      };
      const end = (e) => {
        e.preventDefault();
        touchX = 0;
        touchZ = 0;
        sceneManager.inputController.setTouchVector(0, 0);
      };

      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end);
    };

    bindDpad(dpadUp, 0, -1);
    bindDpad(dpadDown, 0, 1);
    bindDpad(dpadLeft, -1, 0);
    bindDpad(dpadRight, 1, 0);
  }

  return {
    cycleNextVehicle,
    showNotification,
    setDestinationText,
    openMap: onOpenMap,
    openPassport: onOpenPassport
  };
}

