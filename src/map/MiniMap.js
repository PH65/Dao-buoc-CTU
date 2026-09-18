// Bản đồ thu nhỏ hiện qua icon: hiển thị vị trí các toà nhà (dạng chữ/icon
// tượng trưng), cho phép bấm chọn một toà nhà để bắt đầu chỉ đường.

import { buildingsPositions, gates } from './mapData.js';

export function toggleMiniMap({ onSelectBuilding, currentDestination = null, onClearNav = null }) {
  let modal = document.getElementById('minimap-modal');
  if (modal) {
    modal.remove();
    return;
  }

  modal = document.createElement('div');
  modal.id = 'minimap-modal';
  modal.className = 'modal-backdrop';

  const buildingsListHtml = Object.values(buildingsPositions).map(b => {
    const isTarget = currentDestination === b.id;
    return `
      <div class="map-building-item ${isTarget ? 'is-active-target' : ''}" data-id="${b.id}">
        <div class="map-item-left">
          <span class="building-chip">${b.shortName}</span>
          <div class="building-text">
            <strong>${b.name}</strong>
            <small>📍 Nhấn để bật mũi tên đỏ chỉ đường</small>
          </div>
        </div>
        <button class="btn-navigate ${isTarget ? 'btn-nav-active' : ''}">
          ${isTarget ? 'Đang dẫn đường' : '🧭 Dẫn đường'}
        </button>
      </div>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="minimap-window animate-pop">
      <div class="minimap-header">
        <div class="header-title">
          <span class="header-icon">🗺️</span>
          <div>
            <h3>BẢN ĐỒ KHU II - ĐẠI HỌC CẦN THƠ</h3>
            <p>Chọn toà nhà bạn muốn đến để kích hoạt mũi tên đỏ chỉ đường</p>
          </div>
        </div>
        <button class="btn-close" id="btn-close-map">&times;</button>
      </div>

      <div class="minimap-body">
        <!-- Khu vực hiển thị sơ đồ 2D trực quan -->
        <div class="map-canvas-container">
          <img src="/assets/images/panorama/map-ctu/Map_CTU.jpg" alt="Sơ đồ Khu II CTU" class="campus-map-img" />
          <div class="map-pins-layer">
            <div class="map-pin pin-atl" data-id="ATL" title="Tòa nhà Công nghệ cao (ATL)">
              <span class="pin-badge">🔬 ATL</span>
            </div>
            <div class="map-pin pin-cict" data-id="CICT" title="Trường CNTT & TT (CICT)">
              <span class="pin-badge">💻 CICT</span>
            </div>
            <div class="map-pin pin-turtle" data-id="TURTLE_HALL" title="Hội trường Rùa">
              <span class="pin-badge">🐢 Rùa</span>
            </div>
            <div class="map-pin pin-c1" data-id="C1" title="Nhà học C1">
              <span class="pin-badge">📚 C1</span>
            </div>
            <div class="map-pin pin-lib" data-id="LIBRARY" title="Trung tâm Học liệu">
              <span class="pin-badge">📖 Thư viện</span>
            </div>
          </div>
        </div>

        <!-- Danh sách toà nhà chọn nhanh -->
        <div class="map-sidebar">
          <h4>🏢 Danh Sách Điểm Đến:</h4>
          <div class="map-building-list">
            ${buildingsListHtml}
          </div>

          ${currentDestination ? `
            <button class="btn-clear-navigation" id="btn-clear-nav">
              ❌ Hủy đường dẫn hiện tại
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Xử lý chọn toà nhà từ danh sách
  modal.querySelectorAll('.map-building-item').forEach(item => {
    item.addEventListener('click', () => {
      const bId = item.dataset.id;
      modal.remove();
      if (onSelectBuilding) onSelectBuilding(bId);
    });
  });

  // Xử lý chọn toà nhà từ pin trên bản đồ
  modal.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const bId = pin.dataset.id;
      modal.remove();
      if (onSelectBuilding) onSelectBuilding(bId);
    });
  });

  // Hủy đường dẫn
  const btnClear = modal.querySelector('#btn-clear-nav');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      modal.remove();
      if (onClearNav) onClearNav();
    });
  }

  // Đóng modal
  const btnClose = modal.querySelector('#btn-close-map');
  btnClose.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

