// Màn hình menu chính (tên game, nút Bắt đầu, giới thiệu đề tài NCKH).

export function showMenu({ onStart }) {
  const container = document.getElementById('screen-menu');
  if (!container) return;

  container.classList.remove('hidden');

  container.innerHTML = `
    <div class="menu-hero-card animate-fade">
      <div class="menu-emblem">
        <span class="ctu-crest-large">🏛️</span>
        <div class="uni-name">TRƯỜNG ĐẠI HỌC CẦN THƠ</div>
      </div>

      <h1 class="game-title">DẠO BƯỚC CTU</h1>
      <p class="game-subtitle">Ứng dụng Web 3D Tham quan ảo khuôn viên trường tích hợp Gamification & Điều hướng</p>

      <div class="menu-highlights">
        <div class="highlight-item">
          <span class="hl-icon">📍</span>
          <span>3 Cổng chính đường 3/2 & các toà nhà trọng điểm</span>
        </div>
        <div class="highlight-item">
          <span class="hl-icon">🚲</span>
          <span>Đa phương tiện: Xe đạp CTU, Scooter điện, Xe máy</span>
        </div>
        <div class="highlight-item">
          <span class="hl-icon">🔬</span>
          <span>Khám phá Tòa nhà Công nghệ cao (ATL) góc nhìn 360°</span>
        </div>
        <div class="highlight-item">
          <span class="hl-icon">📘</span>
          <span>Thu thập con dấu đóng mộc vào "Passport CTU"</span>
        </div>
      </div>

      <button class="btn-menu-start" id="btn-menu-start">
        ✨ BẮT ĐẦU HÀNH TRÌNH
      </button>

      <div class="menu-footer">
        <span>Đề tài Nghiên cứu Khoa học Sinh viên • Đại học Cần Thơ</span>
      </div>
    </div>
  `;

  container.querySelector('#btn-menu-start').addEventListener('click', () => {
    container.classList.add('hidden');
    if (onStart) onStart();
  });
}

