// Màn hình chọn nhân vật: nam/nữ, có mặc áo CTU hay không,
// chọn phương tiện ban đầu và chọn cổng xuất phát (A, B, hoặc C trên đường 3/2).

import { gates } from '../map/mapData.js';
import { VEHICLE_TYPES, VEHICLE_CONFIGS } from '../utils/constants.js';

export function showCharacterSelect({ onConfirm }) {
  const container = document.getElementById('screen-character-select');
  if (!container) return;

  container.classList.remove('hidden');

  let selectedGender = 'male';
  let wearCtuShirt = true;
  let selectedGate = 'B'; // Mặc định Cổng B trung tâm
  let selectedVehicle = VEHICLE_TYPES.WALK;

  container.innerHTML = `
    <div class="character-select-card animate-pop">
      <div class="card-header">
        <span class="ctu-badge">ĐẠI HỌC CẦN THƠ</span>
        <h2>KHỞI TẠO NHÂN VẬT</h2>
        <p>Tuỳ chỉnh diện mạo sinh viên và chọn điểm xuất phát của bạn</p>
      </div>

      <div class="select-section">
        <label class="section-label">1. Chọn Giới Tính</label>
        <div class="btn-group-toggle" id="group-gender">
          <button class="opt-btn active" data-val="male">
            <span class="opt-icon">👨</span>
            <span>Sinh viên Nam</span>
          </button>
          <button class="opt-btn" data-val="female">
            <span class="opt-icon">👩</span>
            <span>Sinh viên Nữ</span>
          </button>
        </div>
      </div>

      <div class="select-section">
        <label class="section-label">2. Trang Phục</label>
        <div class="btn-group-toggle" id="group-shirt">
          <button class="opt-btn active" data-val="true">
            <span class="opt-icon">👕</span>
            <span>Áo xanh CTU</span>
          </button>
          <button class="opt-btn" data-val="false">
            <span class="opt-icon">👚</span>
            <span>Trang phục tự do</span>
          </button>
        </div>
      </div>

      <div class="select-section">
        <label class="section-label">3. Phương Tiện Di Chuyển</label>
        <div class="vehicle-select-grid" id="group-vehicle">
          ${Object.values(VEHICLE_CONFIGS).map(v => `
            <button class="opt-vehicle-btn ${v.id === VEHICLE_TYPES.WALK ? 'active' : ''}" data-val="${v.id}">
              <span class="v-icon">${v.icon}</span>
              <strong>${v.name}</strong>
              <small>${v.labelSpeed}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="select-section">
        <label class="section-label">4. Cổng Xuất Phát (Trục đường 3/2)</label>
        <div class="gate-cards-grid" id="group-gate">
          <div class="gate-card" data-gate="C">
            <div class="gate-badge">CỔNG C</div>
            <div class="gate-name">Gần đường Nguyễn Văn Linh</div>
            <div class="gate-hint">Tiếp giáp ATL & Khoa Luật</div>
          </div>
          <div class="gate-card active" data-gate="B">
            <div class="gate-badge">CỔNG B</div>
            <div class="gate-name">Cổng chính Trung tâm</div>
            <div class="gate-hint">Đối diện Nhà Điều hành & Thư viện</div>
          </div>
          <div class="gate-card" data-gate="A">
            <div class="gate-badge">CỔNG A</div>
            <div class="gate-name">Gần Cầu Đầu Sấu</div>
            <div class="gate-hint">Tiếp giáp Nhà học A3 & KTX Khu A</div>
          </div>
        </div>
      </div>

      <button class="btn-confirm-start" id="btn-confirm-character">
        🚀 BẮT ĐẦU DẠO BƯỚC CTU NGAY
      </button>
    </div>
  `;

  // Xử lý chọn giới tính
  const genderBtns = container.querySelectorAll('#group-gender .opt-btn');
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGender = btn.dataset.val;
    });
  });

  // Xử lý chọn áo
  const shirtBtns = container.querySelectorAll('#group-shirt .opt-btn');
  shirtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shirtBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wearCtuShirt = (btn.dataset.val === 'true');
    });
  });

  // Xử lý chọn phương tiện
  const vehicleBtns = container.querySelectorAll('#group-vehicle .opt-vehicle-btn');
  vehicleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vehicleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedVehicle = btn.dataset.val;
    });
  });

  // Xử lý chọn cổng
  const gateCards = container.querySelectorAll('.gate-card');
  gateCards.forEach(card => {
    card.addEventListener('click', () => {
      gateCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedGate = card.dataset.gate;
    });
  });

  // Bấm bắt đầu
  container.querySelector('#btn-confirm-character').addEventListener('click', () => {
    container.classList.add('hidden');
    if (onConfirm) {
      onConfirm({
        gender: selectedGender,
        wearCtuShirt: wearCtuShirt,
        startGate: selectedGate,
        vehicleType: selectedVehicle
      });
    }
  });
}

