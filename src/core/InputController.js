// Bắt sự kiện bàn phím (WASD / mũi tên) và cảm ứng (vuốt trên mobile)
// để điều khiển nhân vật di chuyển lên/xuống/trái/phải.

export class InputController {
  constructor({ onToggleVehicle, onToggleMap, onTogglePassport } = {}) {
    this.keys = {};
    this.touchVector = { x: 0, z: 0 };
    this.callbacks = {
      onToggleVehicle,
      onToggleMap,
      onTogglePassport
    };

    this.setupKeyboard();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Bỏ qua nếu đang gõ chữ trong input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      this.keys[e.code] = true;

      // Phím tắt nhanh
      if (e.code === 'KeyV' && this.callbacks.onToggleVehicle) {
        this.callbacks.onToggleVehicle();
      }
      if (e.code === 'KeyM' && this.callbacks.onToggleMap) {
        this.callbacks.onToggleMap();
      }
      if (e.code === 'KeyP' && this.callbacks.onTogglePassport) {
        this.callbacks.onTogglePassport();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  setTouchVector(x, z) {
    this.touchVector.x = x;
    this.touchVector.z = z;
  }

  getMoveDirection() {
    let dx = 0;
    let dz = 0;

    // Phím W / Mũi tên Lên: Đi sâu vào trường (Z âm)
    if (this.keys['KeyW'] || this.keys['ArrowUp']) dz -= 1;
    // Phím S / Mũi tên Xuống: Ra hướng cổng 3/2 (Z dương)
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dz += 1;
    // Phím A / Mũi tên Trái: Về hướng Cổng C / ATL (X âm)
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    // Phím D / Mũi tên Phải: Về hướng Cổng A / Thư viện (X dương)
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    // Kết hợp với touch ảo trên điện thoại nếu có
    if (this.touchVector.x !== 0 || this.touchVector.z !== 0) {
      dx += this.touchVector.x;
      dz += this.touchVector.z;
    }

    // Chuẩn hoá vector đường chéo
    const length = Math.sqrt(dx * dx + dz * dz);
    if (length > 0.001) {
      return { x: dx / length, z: dz / length };
    }
    return { x: 0, z: 0 };
  }
}

