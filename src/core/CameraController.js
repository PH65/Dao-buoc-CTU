// Camera theo sau nhân vật (third-person góc nghiêng bao quát
// phong cách Isometric Stylized cho khuôn viên trường CTU).

import * as THREE from 'three';

export class CameraController {
  constructor(camera, targetMesh) {
    this.camera = camera;
    this.target = targetMesh; // Three.js Mesh / Group của nhân vật
    
    // Khoảng cách camera so với nhân vật
    this.offset = new THREE.Vector3(0, 15, 20);
    this.lookOffset = new THREE.Vector3(0, 1.5, 0);
    this.lerpSpeed = 0.08; // Tỷ lệ làm mềm chuyển động camera
  }

  setTarget(targetMesh) {
    this.target = targetMesh;
  }

  update() {
    if (!this.target) return;

    const targetPos = this.target.position;
    const desiredPos = new THREE.Vector3(
      targetPos.x + this.offset.x,
      targetPos.y + this.offset.y,
      targetPos.z + this.offset.z
    );

    // Lerp vị trí mượt mà
    this.camera.position.lerp(desiredPos, this.lerpSpeed);

    // Điểm nhìn hướng về nhân vật
    const lookTarget = new THREE.Vector3(
      targetPos.x + this.lookOffset.x,
      targetPos.y + this.lookOffset.y,
      targetPos.z + this.lookOffset.z
    );
    this.camera.lookAt(lookTarget);
  }
}

