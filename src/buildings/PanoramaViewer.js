// Hiển thị ảnh toàn cảnh toà nhà, cho phép người dùng
// vuốt/kéo qua lại để xoay góc nhìn (giống ảnh động) và duyệt ảnh thực tế.

export function openPanoramaViewer(building, { onClose, onFinishTour } = {}) {
  let viewer = document.getElementById('panorama-viewer-modal');
  if (viewer) viewer.remove();

  viewer = document.createElement('div');
  viewer.id = 'panorama-viewer-modal';
  viewer.className = 'modal-backdrop panorama-backdrop';

  const photos = (building.photos && building.photos.length > 0)
    ? building.photos
    : ['/assets/images/panorama/atl/phia-truoc-atl.jpg'];

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentOffset = 0;

  viewer.innerHTML = `
    <div class="panorama-container animate-fade">
      <div class="panorama-topbar">
        <div class="building-title-wrap">
          <span class="badge-tag" style="background: ${building.color || '#0066cc'};">360° VIEW</span>
          <h3>${building.name}</h3>
          <span class="sub">${building.subTitle || ''}</span>
        </div>
        <button class="btn-close" id="btn-close-panorama" title="Đóng">&times;</button>
      </div>

      <div class="panorama-viewport" id="panorama-stage">
        <div class="panorama-pan-layer" id="pan-layer">
          <img id="panorama-img" src="${photos[0]}" alt="${building.name}" draggable="false" />
        </div>
        <div class="panorama-touch-hint">
          <span>👈 Kéo chuột hoặc vuốt ngón tay để ngắm toà nhà 👉</span>
        </div>
        ${photos.length > 1 ? `
          <button class="nav-btn prev" id="btn-prev-photo">&#10094;</button>
          <button class="nav-btn next" id="btn-next-photo">&#10095;</button>
        ` : ''}
      </div>

      <div class="panorama-bottombar">
        <div class="photo-dots">
          ${photos.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
        </div>
        <div class="action-buttons">
          <button class="btn-action btn-finish-tour" id="btn-finish-tour">
            ⭐ Xác nhận đã tham quan & Nhận dấu Passport
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(viewer);

  const img = viewer.querySelector('#panorama-img');
  const panLayer = viewer.querySelector('#pan-layer');
  const stage = viewer.querySelector('#panorama-stage');
  const dots = viewer.querySelectorAll('.dot');

  function updatePhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = photos[currentIndex];
      img.onload = () => { img.style.opacity = '1'; };
    }, 150);
    currentOffset = 0;
    panLayer.style.transform = `translateX(0px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  // Vuốt chạm cảm ứng và kéo chuột
  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    panLayer.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    startX = clientX;
    currentOffset += deltaX * 1.3;
    // Giới hạn độ dịch chuyển xoay góc
    currentOffset = Math.max(-120, Math.min(120, currentOffset));
    panLayer.style.transform = `translateX(${currentOffset}px) scale(1.05)`;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    panLayer.style.transition = 'transform 0.4s ease-out';
    if (currentOffset > 60 && photos.length > 1) {
      updatePhoto(currentIndex - 1);
    } else if (currentOffset < -60 && photos.length > 1) {
      updatePhoto(currentIndex + 1);
    } else {
      panLayer.style.transform = `translateX(0px) scale(1)`;
      currentOffset = 0;
    }
  }

  stage.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  stage.addEventListener('touchstart', onPointerDown, { passive: true });
  stage.addEventListener('touchmove', onPointerMove, { passive: true });
  stage.addEventListener('touchend', onPointerUp);

  // Nút lướt ảnh
  const btnPrev = viewer.querySelector('#btn-prev-photo');
  const btnNext = viewer.querySelector('#btn-next-photo');
  if (btnPrev) btnPrev.addEventListener('click', () => updatePhoto(currentIndex - 1));
  if (btnNext) btnNext.addEventListener('click', () => updatePhoto(currentIndex + 1));
  dots.forEach(d => {
    d.addEventListener('click', () => updatePhoto(parseInt(d.dataset.index)));
  });

  // Hoàn thành tham quan
  const btnFinish = viewer.querySelector('#btn-finish-tour');
  btnFinish.addEventListener('click', () => {
    viewer.remove();
    if (onFinishTour) onFinishTour(building);
  });

  // Nút đóng
  const btnClose = viewer.querySelector('#btn-close-panorama');
  btnClose.addEventListener('click', () => {
    viewer.remove();
    if (onClose) onClose();
  });
}

