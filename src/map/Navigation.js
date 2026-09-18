// Vẽ đường chỉ dẫn (mũi tên đỏ) nối từ vị trí nhân vật đến toà nhà
// đích đã chọn trên MiniMap, cập nhật liên tục khi nhân vật di chuyển.

import * as THREE from 'three';
import { buildingsPositions } from './mapData.js';

export class Navigation {
  constructor(scene) {
    this.scene = scene;
    this.targetBuildingId = null;
    this.targetPosition = null;
    this.arrowGroup = new THREE.Group();
    this.scene.add(this.arrowGroup);

    // Vật liệu mũi tên đỏ phát sáng
    this.arrowMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1744,
      emissive: 0xd50000,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.2
    });

    // Tạo hình dạng mũi tên (Cone + Cylinder)
    this.arrowGeometry = this.createArrowGeometry();
    this.pulseTime = 0;
  }

  createArrowGeometry() {
    // Ghép cone và cylinder thành 1 geometry mũi tên nằm ngang chỉ theo trục Z
    const geom = new THREE.BufferGeometry();
    const cone = new THREE.ConeGeometry(0.8, 1.6, 12);
    cone.rotateX(Math.PI / 2);
    cone.translate(0, 0, 0.8);

    const stem = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 8);
    stem.rotateX(Math.PI / 2);
    stem.translate(0, 0, -0.4);

    const group = new THREE.Group();
    const mCone = new THREE.Mesh(cone);
    const mStem = new THREE.Mesh(stem);
    group.add(mCone);
    group.add(mStem);

    return { cone, stem };
  }

  setTarget(buildingId) {
    if (!buildingId || !buildingsPositions[buildingId]) {
      this.clear();
      return;
    }
    this.targetBuildingId = buildingId;
    const b = buildingsPositions[buildingId];
    this.targetPosition = new THREE.Vector3(b.position.x, 0.3, b.position.z);
  }

  update(characterPosition) {
    if (!this.targetPosition || !characterPosition) {
      this.clearArrows();
      return;
    }

    this.pulseTime += 0.05;

    // Khoảng cách từ nhân vật đến toà nhà
    const charPos2D = new THREE.Vector3(characterPosition.x, 0.25, characterPosition.z);
    const dist = charPos2D.distanceTo(this.targetPosition);

    // Nếu đã tới nơi (< 10m)
    if (dist < 10) {
      this.clear();
      return;
    }

    // Tính toán số lượng mũi tên dọc theo đoạn thẳng nối nhân vật -> đích
    const step = 4.0; // Khoảng cách giữa các mũi tên
    const count = Math.min(25, Math.floor(dist / step));

    // Dọn dẹp arrows cũ
    this.clearArrows();

    const dir = new THREE.Vector3().subVectors(this.targetPosition, charPos2D).normalize();
    const rotationAngle = Math.atan2(dir.x, dir.z);

    for (let i = 1; i <= count; i++) {
      const pos = new THREE.Vector3().copy(charPos2D).addScaledVector(dir, i * step);
      
      const arrowMesh = new THREE.Group();
      const cone = new THREE.Mesh(this.arrowGeometry.cone, this.arrowMaterial);
      const stem = new THREE.Mesh(this.arrowGeometry.stem, this.arrowMaterial);
      arrowMesh.add(cone);
      arrowMesh.add(stem);

      // Hiệu ứng nhấp nhô nhẹ lượn sóng
      const wave = Math.sin(this.pulseTime * 3 - i * 0.4) * 0.15;
      arrowMesh.position.set(pos.x, 0.4 + wave, pos.z);
      arrowMesh.rotation.y = rotationAngle;

      this.arrowGroup.add(arrowMesh);
    }
  }

  clearArrows() {
    while (this.arrowGroup.children.length > 0) {
      const child = this.arrowGroup.children[0];
      this.arrowGroup.remove(child);
    }
  }

  clear() {
    this.targetBuildingId = null;
    this.targetPosition = null;
    this.clearArrows();
  }
}

