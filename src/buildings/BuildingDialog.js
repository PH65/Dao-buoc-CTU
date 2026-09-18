// Hộp thoại hỏi người chơi: "Tham quan tổng quát" hay "Tìm hiểu tiện ích".

export function showBuildingDialog(building, { onGeneralTour, onAmenities, onClose }) {
  let dialog = document.getElementById('building-dialog-modal');
  if (dialog) dialog.remove();

  dialog = document.createElement('div');
  dialog.id = 'building-dialog-modal';
  dialog.className = 'modal-backdrop';

  dialog.innerHTML = `
    <div class="building-dialog-card animate-pop">
      <div class="dialog-badge" style="background: ${building.color || '#0066cc'};">
        📍 ĐÃ ĐẾN NƠI
      </div>
      <h2>${building.name}</h2>
      <p class="building-sub">${building.subTitle || ''}</p>
      <p class="building-desc">${building.description}</p>

      <div class="dialog-question">
        <p>👋 <strong>Chào bạn! Bạn muốn trải nghiệm gì tại toà nhà này?</strong></p>
      </div>

      <div class="dialog-choices">
        <button class="choice-btn primary" id="btn-choice-tour">
          <span class="btn-icon">🏛️</span>
          <div class="btn-text">
            <strong>Tham quan tổng quát</strong>
            <small>Xem ảnh toàn cảnh đa góc nhìn, vuốt xoay 360°</small>
          </div>
        </button>

        <button class="choice-btn secondary" id="btn-choice-amenities">
          <span class="btn-icon">📋</span>
          <div class="btn-text">
            <strong>Tìm hiểu các tiện ích</strong>
            <small>Phòng thí nghiệm, phòng ban, khu chức năng</small>
          </div>
        </button>
      </div>

      <button class="btn-text-close" id="btn-choice-close">Tiếp tục dạo bước 🏃</button>
    </div>
  `;

  document.body.appendChild(dialog);

  dialog.querySelector('#btn-choice-tour').addEventListener('click', () => {
    dialog.remove();
    if (onGeneralTour) onGeneralTour(building);
  });

  dialog.querySelector('#btn-choice-amenities').addEventListener('click', () => {
    dialog.remove();
    if (onAmenities) onAmenities(building);
  });

  dialog.querySelector('#btn-choice-close').addEventListener('click', () => {
    dialog.remove();
    if (onClose) onClose();
  });
}

// Modal danh sách tiện ích
export function showAmenitiesDialog(building, { onClose, onOpenTour }) {
  let modal = document.getElementById('amenities-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'amenities-modal';
  modal.className = 'modal-backdrop';

  const amenitiesList = (building.amenities || []).map(item => `
    <li class="amenity-item">
      <span class="amenity-bullet">✅</span>
      <span>${item}</span>
    </li>
  `).join('');

  modal.innerHTML = `
    <div class="amenities-card animate-pop">
      <div class="modal-header">
        <div>
          <h3>Tiện ích & Phòng ban: ${building.name}</h3>
          <p class="sub">${building.subTitle || ''}</p>
        </div>
        <button class="btn-close" id="btn-close-amenities">&times;</button>
      </div>

      <ul class="amenities-list">
        ${amenitiesList}
      </ul>

      <div class="amenities-footer">
        <button class="btn-action primary" id="btn-goto-tour">
          🖼️ Xem hình ảnh toà nhà
        </button>
        <button class="btn-action secondary" id="btn-done-amenities">
          Xong
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#btn-close-amenities').addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-done-amenities').addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-goto-tour').addEventListener('click', () => {
    modal.remove();
    if (onOpenTour) onOpenTour(building);
  });
}

