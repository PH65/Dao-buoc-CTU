// Giao diện hiển thị cuốn "Passport CTU": danh sách dấu đã có/chưa có.

import { stamps } from './stampsData.js';

export function showPassport(passportManager) {
  // Kiểm tra nếu modal đã mở thì đóng lại
  let modal = document.getElementById('passport-modal');
  if (modal) {
    modal.remove();
    return;
  }

  const { collected, total, percent } = passportManager.getProgress();
  const player = passportManager.playerInfo || {};

  modal = document.createElement('div');
  modal.id = 'passport-modal';
  modal.className = 'modal-backdrop';

  const stampsHtml = Object.values(stamps).map(stamp => {
    const isCollected = passportManager.hasStamp(stamp.id);
    const timeStr = isCollected ? new Date(passportManager.collectedStamps.get(stamp.id)).toLocaleDateString('vi-VN') : '';

    return `
      <div class="stamp-card ${isCollected ? 'collected' : 'locked'}">
        <div class="stamp-badge" style="border-color: ${stamp.color};">
          <div class="stamp-icon">${stamp.icon}</div>
          <div class="stamp-title" style="color: ${stamp.color};">${stamp.title}</div>
          ${isCollected ? `<div class="stamp-check-seal">CHECKED</div>` : `<div class="stamp-lock-seal">CHƯA KHÁM PHÁ</div>`}
        </div>
        <div class="stamp-info">
          <div class="stamp-name">${stamp.label}</div>
          <div class="stamp-desc">${stamp.desc}</div>
          ${isCollected ? `<div class="stamp-time">📅 Đã check-in: ${timeStr}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="passport-booklet animate-pop">
      <div class="passport-header">
        <div class="passport-emblem">
          <span class="ctu-crest">🏛️</span>
          <div>
            <h2>HỘ CHIẾU CTU • CTU PASSPORT</h2>
            <p>Trường Đại học Cần Thơ - Sổ lưu niệm khám phá khuôn viên</p>
          </div>
        </div>
        <button class="btn-close" id="btn-close-passport" title="Đóng">&times;</button>
      </div>

      <div class="passport-user-bar">
        <div class="user-chip">
          <span>${player.gender === 'female' ? '👩 Nữ' : '👨 Nam'}</span>
          <span>${player.wearCtuShirt ? '👕 Áo CTU Xanh' : '👕 Trang phục thường'}</span>
          <span>🚪 Xuất phát: Cổng ${player.startGate || 'B'}</span>
        </div>
        <div class="passport-progress">
          <span>Tiến trình khám phá: <strong>${collected}/${total}</strong> địa điểm (${percent}%)</span>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${percent}%;"></div>
          </div>
        </div>
      </div>

      <div class="passport-grid">
        ${stampsHtml}
      </div>

      <div class="passport-footer">
        <p>💡 <em>Mẹo: Hãy di chuyển đến gần các toà nhà trong khuôn viên trường và chọn "Tham quan" để thu thập thêm con dấu!</em></p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Đóng modal
  const btnClose = modal.querySelector('#btn-close-passport');
  btnClose.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

