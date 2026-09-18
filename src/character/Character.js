// Đại diện nhân vật người chơi trong scene 3D: model, animation
// (đi/đứng yên), phương tiện di chuyển và xử lý toạ độ.

import * as THREE from 'three';
import { gates } from '../map/mapData.js';
import { VEHICLE_TYPES, VEHICLE_CONFIGS } from '../utils/constants.js';

export class Character {
  constructor({ gender = 'male', wearCtuShirt = true, startGate = 'B', initialVehicle = VEHICLE_TYPES.WALK } = {}) {
    this.gender = gender;
    this.wearCtuShirt = wearCtuShirt;
    this.startGate = startGate;
    this.vehicleType = initialVehicle;
    this.currentSpeed = VEHICLE_CONFIGS[this.vehicleType]?.speed || 0.2;

    this.mesh = new THREE.Group();
    this.animationTime = 0;
    this.isMoving = false;

    // Lấy toạ độ xuất phát theo Cổng đã chọn
    const gateInfo = gates[startGate] || gates['B'];
    const startPos = gateInfo.position;
    this.mesh.position.set(startPos.x, 0, startPos.z - 4); // Hơi bước vào trong cổng

    this.buildCharacterMesh();
    this.buildVehicleMeshes();
    this.updateVehicleVisibility();
  }

  buildCharacterMesh() {
    this.humanoid = new THREE.Group();

    // 1. Đầu & Khuôn mặt
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc80 }); // Tông da sáng
    const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.95;
    this.head.castShadow = true;
    this.humanoid.add(this.head);

    // Tóc
    const hairColor = this.gender === 'female' ? 0x3e2723 : 0x212121;
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor });
    const hairGeo = this.gender === 'female'
      ? new THREE.BoxGeometry(0.76, 0.8, 0.85) // Tóc dài hơn
      : new THREE.BoxGeometry(0.75, 0.35, 0.75); // Tóc ngắn nam
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, this.gender === 'female' ? 2.05 : 2.25, 0);
    this.humanoid.add(hair);

    // 2. Thân mình (Áo CTU xanh hoặc áo thường)
    const shirtColor = this.wearCtuShirt ? 0x0055a5 : (this.gender === 'female' ? 0xe91e63 : 0xf57c00);
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5 });
    const torsoGeo = new THREE.BoxGeometry(0.85, 0.95, 0.5);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 1.15;
    this.torso.castShadow = true;
    this.humanoid.add(this.torso);

    // Điểm nhấn cổ áo trắng sinh viên CTU
    if (this.wearCtuShirt) {
      const collarGeo = new THREE.BoxGeometry(0.4, 0.15, 0.52);
      const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.set(0, 1.55, 0);
      this.humanoid.add(collar);
    }

    // 3. Tay trái & Tay phải
    const armGeo = new THREE.BoxGeometry(0.24, 0.75, 0.24);
    this.leftArm = new THREE.Mesh(armGeo, shirtMat);
    this.leftArm.position.set(-0.55, 1.15, 0);
    this.leftArm.castShadow = true;

    this.rightArm = new THREE.Mesh(armGeo, shirtMat);
    this.rightArm.position.set(0.55, 1.15, 0);
    this.rightArm.castShadow = true;

    this.humanoid.add(this.leftArm);
    this.humanoid.add(this.rightArm);

    // 4. Chân trái & Chân phải
    const pantsColor = 0x263238; // Quần tây xám đậm
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor });
    const legGeo = new THREE.BoxGeometry(0.28, 0.8, 0.3);

    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.25, 0.4, 0);
    this.leftLeg.castShadow = true;

    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.25, 0.4, 0);
    this.rightLeg.castShadow = true;

    this.humanoid.add(this.leftLeg);
    this.humanoid.add(this.rightLeg);

    this.mesh.add(this.humanoid);
  }

  // Dựng mô hình các phương tiện đi kèm
  buildVehicleMeshes() {
    this.vehiclesGroup = new THREE.Group();

    // 1. Xe đạp CTU
    this.bicycleMesh = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0055a5 }); // Khung xanh CTU
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
    // Bánh trước và sau
    const wheelGeo = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
    this.bikeWheelFront = new THREE.Mesh(wheelGeo, wheelMat);
    this.bikeWheelFront.position.set(0, 0.4, 0.9);
    this.bikeWheelBack = new THREE.Mesh(wheelGeo, wheelMat);
    this.bikeWheelBack.position.set(0, 0.4, -0.9);
    // Khung xe
    const barGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.6);
    const frameBar = new THREE.Mesh(barGeo, frameMat);
    frameBar.rotation.x = Math.PI / 3;
    frameBar.position.set(0, 0.6, 0);
    // Ghi đông
    const hBarGeo = new THREE.BoxGeometry(0.8, 0.06, 0.06);
    const hBar = new THREE.Mesh(hBarGeo, wheelMat);
    hBar.position.set(0, 1.1, 0.7);

    this.bicycleMesh.add(this.bikeWheelFront);
    this.bicycleMesh.add(this.bikeWheelBack);
    this.bicycleMesh.add(frameBar);
    this.bicycleMesh.add(hBar);
    this.vehiclesGroup.add(this.bicycleMesh);

    // 2. Scooter điện
    this.scooterMesh = new THREE.Group();
    const scColor = new THREE.MeshStandardMaterial({ color: 0x00b0ff }); // Xanh dạ quang
    const scWheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12);
    scWheelGeo.rotateZ(Math.PI / 2);
    const scW1 = new THREE.Mesh(scWheelGeo, wheelMat);
    scW1.position.set(0, 0.18, 0.7);
    const scW2 = new THREE.Mesh(scWheelGeo, wheelMat);
    scW2.position.set(0, 0.18, -0.7);
    const boardGeo = new THREE.BoxGeometry(0.35, 0.08, 1.3);
    const board = new THREE.Mesh(boardGeo, scColor);
    board.position.set(0, 0.22, 0);
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2);
    const stem = new THREE.Mesh(stemGeo, scColor);
    stem.position.set(0, 0.8, 0.65);
    const scBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.05), wheelMat);
    scBar.position.set(0, 1.35, 0.65);

    this.scooterMesh.add(scW1);
    this.scooterMesh.add(scW2);
    this.scooterMesh.add(board);
    this.scooterMesh.add(stem);
    this.scooterMesh.add(scBar);
    this.vehiclesGroup.add(this.scooterMesh);

    // 3. Xe gắn máy
    this.motorMesh = new THREE.Group();
    const motorBodyGeo = new THREE.BoxGeometry(0.5, 0.5, 1.5);
    const motorBodyMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f }); // Đỏ thể thao
    const mBody = new THREE.Mesh(motorBodyGeo, motorBodyMat);
    mBody.position.set(0, 0.55, 0);
    const mW1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16), wheelMat);
    mW1.rotateZ(Math.PI / 2);
    mW1.position.set(0, 0.3, 0.8);
    const mW2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16), wheelMat);
    mW2.rotateZ(Math.PI / 2);
    mW2.position.set(0, 0.3, -0.8);
    // Đèn pha
    const lightGeo = new THREE.BoxGeometry(0.25, 0.2, 0.1);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, emissive: 0xffeb3b, emissiveIntensity: 0.5 });
    const mLight = new THREE.Mesh(lightGeo, lightMat);
    mLight.position.set(0, 0.8, 0.78);

    this.motorMesh.add(mBody);
    this.motorMesh.add(mW1);
    this.motorMesh.add(mW2);
    this.motorMesh.add(mLight);
    this.vehiclesGroup.add(this.motorMesh);

    this.mesh.add(this.vehiclesGroup);
  }

  setVehicle(vehicleType) {
    if (!VEHICLE_TYPES[vehicleType]) return;
    this.vehicleType = vehicleType;
    this.currentSpeed = VEHICLE_CONFIGS[vehicleType]?.speed || 0.2;
    this.updateVehicleVisibility();
  }

  updateVehicleVisibility() {
    this.bicycleMesh.visible = (this.vehicleType === VEHICLE_TYPES.BICYCLE);
    this.scooterMesh.visible = (this.vehicleType === VEHICLE_TYPES.SCOOTER);
    this.motorMesh.visible = (this.vehicleType === VEHICLE_TYPES.MOTORBIKE);

    // Điều chỉnh độ cao nhân vật khi ngồi xe
    if (this.vehicleType === VEHICLE_TYPES.BICYCLE) {
      this.humanoid.position.y = 0.3;
      this.leftArm.rotation.x = -Math.PI / 3;
      this.rightArm.rotation.x = -Math.PI / 3;
    } else if (this.vehicleType === VEHICLE_TYPES.SCOOTER) {
      this.humanoid.position.y = 0.1;
      this.leftArm.rotation.x = -Math.PI / 3.5;
      this.rightArm.rotation.x = -Math.PI / 3.5;
    } else if (this.vehicleType === VEHICLE_TYPES.MOTORBIKE) {
      this.humanoid.position.y = 0.2;
      this.leftArm.rotation.x = -Math.PI / 3;
      this.rightArm.rotation.x = -Math.PI / 3;
    } else {
      this.humanoid.position.y = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
    }
  }

  // Di chuyển nhân vật dựa trên vector hướng (x, z)
  move(dirX, dirZ) {
    if (dirX === 0 && dirZ === 0) {
      this.isMoving = false;
      // Reset về tư thế đứng
      if (this.vehicleType === VEHICLE_TYPES.WALK) {
        this.leftLeg.rotation.x = 0;
        this.rightLeg.rotation.x = 0;
        this.leftArm.rotation.x = 0;
        this.rightArm.rotation.x = 0;
      }
      return;
    }

    this.isMoving = true;
    this.animationTime += 0.25;

    // Di chuyển vị trí
    this.mesh.position.x += dirX * this.currentSpeed;
    this.mesh.position.z += dirZ * this.currentSpeed;

    // Giới hạn biên khuôn viên trường để không chạy ra ngoài vũ trụ
    this.mesh.position.x = Math.max(-140, Math.min(140, this.mesh.position.x));
    this.mesh.position.z = Math.max(-120, Math.min(85, this.mesh.position.z));

    // Xoay mặt nhân vật theo hướng đi
    const angle = Math.atan2(dirX, dirZ);
    this.mesh.rotation.y = angle;

    // Animation đi bộ hoặc quay bánh xe
    if (this.vehicleType === VEHICLE_TYPES.WALK) {
      const swing = Math.sin(this.animationTime * 1.5) * 0.6;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.8;
      this.rightArm.rotation.x = swing * 0.8;
    } else if (this.vehicleType === VEHICLE_TYPES.BICYCLE) {
      this.bikeWheelFront.rotation.x += 0.3;
      this.bikeWheelBack.rotation.x += 0.3;
      // Chân đạp xe
      const pedal = Math.sin(this.animationTime * 2) * 0.4;
      this.leftLeg.rotation.x = pedal;
      this.rightLeg.rotation.x = -pedal;
    }
  }

  getPosition() {
    return this.mesh.position;
  }
}

