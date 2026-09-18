// Dựng bản đồ 3D chính (địa hình, đường đi, mô hình các toà nhà)
// và phát hiện khi nhân vật đến gần một toà nhà.

import * as THREE from 'three';
import { gates, buildingsPositions } from './mapData.js';

export class CampusMap3D {
  constructor(scene) {
    this.scene = scene;
    this.buildingsGroup = new THREE.Group();
    this.environmentGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);
    this.scene.add(this.buildingsGroup);

    this.buildingsMeshes = new Map();
  }

  async build() {
    this.createTerrainAndRoads();
    this.createGates();
    this.createVegetation();
    this.createBuildings();
  }

  // Tạo mặt đất cỏ xanh, các trục đường nội bộ và vạch kẻ đường
  createTerrainAndRoads() {
    // 1. Mặt cỏ toàn khuôn viên
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x558b2f, // Xanh cỏ tươi
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.environmentGroup.add(ground);

    // Vật liệu đường nhựa
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x37474f, // Xám đen đường nhựa
      roughness: 0.7
    });

    // Trục đường 3 Tháng 2 (mặt tiền phía Nam, nối Cổng C - B - A)
    const road32Geo = new THREE.PlaneGeometry(280, 16);
    const road32 = new THREE.Mesh(road32Geo, roadMat);
    road32.rotation.x = -Math.PI / 2;
    road32.position.set(0, 0.05, 75);
    road32.receiveShadow = true;
    this.environmentGroup.add(road32);

    // Trục đường trung tâm đi từ Cổng B vào sâu trong trường (hướng tới C1, CICT)
    const roadCenterGeo = new THREE.PlaneGeometry(14, 150);
    const roadCenter = new THREE.Mesh(roadCenterGeo, roadMat);
    roadCenter.rotation.x = -Math.PI / 2;
    roadCenter.position.set(0, 0.05, 0);
    roadCenter.receiveShadow = true;
    this.environmentGroup.add(roadCenter);

    // Đường nhánh sang ATL và Hội trường Rùa (hướng Tây)
    const roadWestGeo = new THREE.PlaneGeometry(80, 10);
    const roadWest = new THREE.Mesh(roadWestGeo, roadMat);
    roadWest.rotation.x = -Math.PI / 2;
    roadWest.position.set(-40, 0.05, 30);
    roadWest.receiveShadow = true;
    this.environmentGroup.add(roadWest);

    // Đường nhánh sang Thư viện và Khu A (hướng Đông)
    const roadEastGeo = new THREE.PlaneGeometry(80, 10);
    const roadEast = new THREE.Mesh(roadEastGeo, roadMat);
    roadEast.rotation.x = -Math.PI / 2;
    roadEast.position.set(40, 0.05, 35);
    roadEast.receiveShadow = true;
    this.environmentGroup.add(roadEast);

    // Bùng binh trung tâm (gần Nhà điều hành & C1)
    const roundGeo = new THREE.CylinderGeometry(10, 10, 0.1, 32);
    const roundMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
    const roundabout = new THREE.Mesh(roundGeo, roundMat);
    roundabout.position.set(0, 0.1, 15);
    this.environmentGroup.add(roundabout);

    // Hồ nước Hội trường Rùa
    const pondGeo = new THREE.CylinderGeometry(15, 15, 0.15, 32);
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x0288d1,
      roughness: 0.1,
      metalness: 0.3
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.position.set(-52, 0.08, -12);
    this.environmentGroup.add(pond);
  }

  // Tạo 3 cổng trường dọc đường 3/2
  createGates() {
    Object.values(gates).forEach(gate => {
      const gateGroup = new THREE.Group();
      gateGroup.position.set(gate.position.x, 0, gate.position.z);

      // Cột trụ cổng (màu xanh CTU + trắng)
      const pillarGeo = new THREE.BoxGeometry(2, 7, 2);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0055a5 });
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-6, 3.5, 0);
      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pRight.position.set(6, 3.5, 0);
      gateGroup.add(pLeft);
      gateGroup.add(pRight);

      // Xà ngang cổng
      const beamGeo = new THREE.BoxGeometry(16, 1.8, 2.2);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 7.5, 0);
      gateGroup.add(beam);

      // Biển tên cổng 3D
      const label = this.createLabelSign(`${gate.name} (Đ. 3/2)`, 0x003366);
      label.position.set(0, 9.2, 0);
      gateGroup.add(label);

      // Trạm xe đạp / scooter sinh viên tại mỗi cổng
      const station = this.createVehicleStation();
      station.position.set(gate.position.x + 10, 0, gate.position.z - 5);
      this.environmentGroup.add(station);

      this.environmentGroup.add(gateGroup);
    });
  }

  createVehicleStation() {
    const station = new THREE.Group();
    // Mái che trạm xe
    const roofGeo = new THREE.BoxGeometry(8, 0.3, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x00897b });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 3.5, 0);
    station.add(roof);

    // Cột đỡ
    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x78909c });
    [-3.5, 3.5].forEach(x => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(x, 1.75, 0);
      station.add(post);
    });

    const sign = this.createLabelSign('TRẠM XE XANH CTU', 0x00796b);
    sign.position.set(0, 4.2, 0);
    station.add(sign);

    return station;
  }

  // Cây cối xanh khuôn viên
  createVegetation() {
    const treePositions = [
      // Dọc đường 3/2
      [-100, 68], [-50, 68], [-20, 68], [20, 68], [50, 68], [100, 68],
      // Quanh ATL
      [-20, 42], [-22, 22], [-48, 45], [-50, 25],
      // Quanh Hội trường Rùa & Hồ sen
      [-65, -5], [-35, -22], [-65, -20],
      // Dọc trục trung tâm
      [-10, 50], [10, 50], [-10, 30], [10, 30], [-10, -10], [10, -10],
      // Quanh CICT
      [-8, -45], [25, -45], [28, -25], [-5, -22]
    ];

    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 3, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const foliageGeo = new THREE.DodecahedronGeometry(2.2, 1);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });

    treePositions.forEach(([x, z]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.5;
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 4.2;

      tree.add(trunk);
      tree.add(foliage);
      tree.position.set(x, 0, z);
      tree.castShadow = true;
      this.environmentGroup.add(tree);
    });
  }

  // Tạo các toà nhà trọng điểm
  createBuildings() {
    // 1. TÒA NHÀ CÔNG NGHỆ CAO (ATL) - Dựng theo chuẩn bộ ảnh thực tế
    const atlPos = buildingsPositions.ATL.position;
    const atlMesh = this.buildATLBuilding();
    atlMesh.position.set(atlPos.x, 0, atlPos.z);
    this.buildingsGroup.add(atlMesh);
    this.buildingsMeshes.set('ATL', atlMesh);

    // 2. TRƯỜNG CNTT & TT (CICT)
    const cictPos = buildingsPositions.CICT.position;
    const cictMesh = this.buildCICTBuilding();
    cictMesh.position.set(cictPos.x, 0, cictPos.z);
    this.buildingsGroup.add(cictMesh);
    this.buildingsMeshes.set('CICT', cictMesh);

    // 3. HỘI TRƯỜNG RÙA
    const turtlePos = buildingsPositions.TURTLE_HALL.position;
    const turtleMesh = this.buildTurtleHall();
    turtleMesh.position.set(turtlePos.x, 0, turtlePos.z);
    this.buildingsGroup.add(turtleMesh);
    this.buildingsMeshes.set('TURTLE_HALL', turtleMesh);

    // 4. NHÀ HỌC C1
    const c1Pos = buildingsPositions.C1.position;
    const c1Mesh = this.buildC1Building();
    c1Mesh.position.set(c1Pos.x, 0, c1Pos.z);
    this.buildingsGroup.add(c1Mesh);
    this.buildingsMeshes.set('C1', c1Mesh);

    // 5. TRUNG TÂM HỌC LIỆU (THƯ VIỆN)
    const libPos = buildingsPositions.LIBRARY.position;
    const libMesh = this.buildLibraryBuilding();
    libMesh.position.set(libPos.x, 0, libPos.z);
    this.buildingsGroup.add(libMesh);
    this.buildingsMeshes.set('LIBRARY', libMesh);
  }

  // Dựng kiến trúc Toà nhà Công nghệ cao (ATL) bám sát 100% thiết kế thực tế từ bộ ảnh
  buildATLBuilding() {
    const group = new THREE.Group();

    // ========================================================
    // 0. VẬT LIỆU CHUẨN XÁC
    // ========================================================
    const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.35 });
    const greyBaseMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.5 });
    const charcoalMat = new THREE.MeshStandardMaterial({ color: 0x21272c, roughness: 0.35, metalness: 0.25 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x181a1b, roughness: 0.4 });
    const glassCyanMat = new THREE.MeshStandardMaterial({
      color: 0x4dd0e1, // Kính xanh ngọc cyan như trong ảnh
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.88
    });
    const louverWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const metalGreyMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.5, roughness: 0.3 });

    // Tạo texture hoa văn đục lỗ cho khối sảnh đứng trung tâm
    const perforatedTexture = this.createPerforatedTexture();
    const perforatedMat = new THREE.MeshStandardMaterial({
      map: perforatedTexture,
      roughness: 0.4
    });

    // ========================================================
    // 1. CÁNH TRÁI UỐN CONG CÁNH CUNG (CURVED LEFT WING - 7 TẦNG)
    // ========================================================
    const leftWingGroup = new THREE.Group();

    // Dựng 4 phân đoạn cong tạo dáng cánh cung uốn lượn mềm mại
    const segments = 5;
    const segmentWidth = 3.6;
    for (let i = 0; i < segments; i++) {
      const segGroup = new THREE.Group();
      const t = i / (segments - 1);
      // Tọa độ cong hình vòng cung
      const x = -16 + i * segmentWidth;
      const zOffset = Math.sin(t * Math.PI) * 2.2;
      const rotY = (t - 0.5) * 0.22; // Xoay nhẹ theo góc cong

      // Tầng trệt: Tường xám kỹ thuật có lam chớp thông gió
      const baseGeo = new THREE.BoxGeometry(segmentWidth + 0.1, 2.8, 14);
      const baseMesh = new THREE.Mesh(baseGeo, greyBaseMat);
      baseMesh.position.set(0, 1.4, 0);
      segGroup.add(baseMesh);

      // Cửa chớp tầng trệt
      const ventGeo = new THREE.BoxGeometry(segmentWidth - 0.4, 1.2, 0.2);
      const vent = new THREE.Mesh(ventGeo, charcoalMat);
      vent.position.set(0, 1.4, 7.05);
      segGroup.add(vent);

      // Tầng 2 đến Tầng 7: Tường kính xanh cyan kèm các dầm sàn trắng
      const glassGeo = new THREE.BoxGeometry(segmentWidth + 0.05, 11, 13.8);
      const glassMesh = new THREE.Mesh(glassGeo, glassCyanMat);
      glassMesh.position.set(0, 8.3, 0);
      segGroup.add(glassMesh);

      // Các thanh chia tầng ngang màu trắng (Floor slabs)
      for (let floor = 1; floor <= 6; floor++) {
        const slabY = 2.8 + floor * 1.8;
        const slabGeo = new THREE.BoxGeometry(segmentWidth + 0.15, 0.25, 0.4);
        const slab = new THREE.Mesh(slabGeo, whiteWallMat);
        slab.position.set(0, slabY, 7.0);
        segGroup.add(slab);

        // Đố kính đứng màu xanh ngọc / trắng
        const finGeo = new THREE.BoxGeometry(0.12, 1.5, 0.35);
        const fin = new THREE.Mesh(finGeo, metalGreyMat);
        fin.position.set(0, slabY - 0.9, 7.0);
        segGroup.add(fin);
      }

      segGroup.position.set(x, 0, zOffset);
      segGroup.rotation.y = rotY;
      leftWingGroup.add(segGroup);
    }

    // LỒNG CẦU THANG THOÁT HIỂM & HỆ LAM CHẮN NẮNG TRẮNG Ở GÓC TRÁI (ĐIỂM NHẤN ATL)
    const stairCage = new THREE.Group();
    stairCage.position.set(-17.2, 0, 0);

    // Cột góc lồng thang
    const cornerPillarGeo = new THREE.BoxGeometry(0.8, 15, 0.8);
    const cornerPillar = new THREE.Mesh(cornerPillarGeo, whiteWallMat);
    cornerPillar.position.set(0, 7.5, 7.1);
    stairCage.add(cornerPillar);

    // Hệ lam che nắng ngang màu trắng (10 thanh lam bọc góc sắc sảo)
    for (let l = 0; l < 11; l++) {
      const louverY = 3.2 + l * 1.15;
      // Thanh lam mặt trước
      const frontLouver = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 0.45), louverWhiteMat);
      frontLouver.position.set(2.6, louverY, 7.2);
      stairCage.add(frontLouver);
      // Thanh lam mặt bên hông trái
      const sideLouver = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 8.5), louverWhiteMat);
      sideLouver.position.set(-0.6, louverY, 3.2);
      stairCage.add(sideLouver);
    }

    // Các bậc thang thoát hiểm ziczac nhìn xuyên qua lam
    for (let s = 1; s <= 6; s++) {
      const stairFlight = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 1.8), metalGreyMat);
      stairFlight.rotation.z = (s % 2 === 0 ? 0.35 : -0.35);
      stairFlight.position.set(1.5, s * 2.2, 3.5);
      stairCage.add(stairFlight);
    }
    leftWingGroup.add(stairCage);

    // MÁI VÁT NGHIÊNG NHÔ VƯƠN XA CỦA CÁNH TRÁI
    const roofOverhangGeo = new THREE.BoxGeometry(20, 0.5, 16);
    const roofOverhang = new THREE.Mesh(roofOverhangGeo, whiteWallMat);
    roofOverhang.position.set(-8, 14.3, 0);
    roofOverhang.rotation.z = -0.04; // Vát nghiêng nhẹ
    leftWingGroup.add(roofOverhang);

    // Bảng chữ 3D nổi "ĐẠI HỌC CẦN THƠ" trên đỉnh mái cánh trái (như trong ảnh)
    const uniRoofSign = this.createRoofTextSprite('ĐẠI HỌC CẦN THƠ', 0x0055a5);
    uniRoofSign.position.set(-9, 15.6, 6.8);
    leftWingGroup.add(uniRoofSign);

    group.add(leftWingGroup);

    // ========================================================
    // 2. KHỐI SẢNH TRUNG TÂM ĐỤC LỖ HOA VĂN TRẮNG (CENTRAL SPINE)
    // ========================================================
    const spineGroup = new THREE.Group();
    spineGroup.position.set(1.5, 0, 0);

    // Tháp sảnh đứng hoa văn panel trắng
    const spineGeo = new THREE.BoxGeometry(5.2, 16.5, 15);
    const spineMesh = new THREE.Mesh(spineGeo, perforatedMat);
    spineMesh.position.set(0, 8.25, 0);
    spineMesh.castShadow = true;
    spineGroup.add(spineMesh);

    // Mái che kết cấu giàn thép nghiêng vắt trên đỉnh
    const trussRoofGeo = new THREE.BoxGeometry(6.5, 0.4, 16);
    const trussRoof = new THREE.Mesh(trussRoofGeo, charcoalMat);
    trussRoof.position.set(0, 16.8, 0);
    trussRoof.rotation.x = -0.06;
    spineGroup.add(trussRoof);

    // Giàn dầm thép lộ thiên nối với cánh trái
    for (let r = 0; r < 4; r++) {
      const trussBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.5), metalGreyMat);
      trussBeam.rotation.z = Math.PI / 3;
      trussBeam.position.set(-2.5, 15.5, -5 + r * 3.5);
      spineGroup.add(trussBeam);
    }

    group.add(spineGroup);

    // ========================================================
    // 3. KHỐI THÁP THAN CHÌ BÊN PHẢI (CHARCOAL HI-TECH TOWER - 8 TẦNG)
    // ========================================================
    const rightTowerGroup = new THREE.Group();
    rightTowerGroup.position.set(9.5, 0, 0);

    // Khối thân tháp màu than chì đậm
    const towerBodyGeo = new THREE.BoxGeometry(10.5, 18, 16);
    const towerBody = new THREE.Mesh(towerBodyGeo, charcoalMat);
    towerBody.position.set(0, 9.0, 0);
    towerBody.castShadow = true;
    rightTowerGroup.add(towerBody);

    // HỆ LAM SỌC ĐỨNG MÀU ĐEN MẶT TIỀN THÁP (VERTICAL BLACK FINS - ĐẶC TRƯNG ATL)
    const finHeight = 12.5;
    for (let f = -3.8; f <= 3.8; f += 0.75) {
      const finMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, finHeight, 0.6), blackMat);
      finMesh.position.set(f, 9.2, 8.2);
      rightTowerGroup.add(finMesh);
    }

    // Ban công kính bên hông tháp than chì
    for (let b = 1; b <= 6; b++) {
      const balconyY = 2.8 + b * 2.0;
      const balcony = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 6), metalGreyMat);
      balcony.position.set(4.8, balconyY, 3);
      rightTowerGroup.add(balcony);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 6), glassCyanMat);
      rail.position.set(5.3, balconyY + 0.4, 3);
      rightTowerGroup.add(rail);
    }

    // TẦNG MÁI KỸ THUẬT RỖNG THOÁNG KHÍ TRÊN ĐỈNH THÁP THAN CHÌ
    const topFloorGeo = new THREE.BoxGeometry(10.5, 2.2, 16);
    const topFloor = new THREE.Mesh(topFloorGeo, blackMat);
    topFloor.position.set(0, 18.8, 0);
    rightTowerGroup.add(topFloor);

    // Khung ô rỗng thông gió trên nóc
    const ventRoofOpening = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.2, 12), charcoalMat);
    ventRoofOpening.position.set(0, 18.8, 0);
    rightTowerGroup.add(ventRoofOpening);

    // DÃY NHÀ DÀI KÉO SÂU VỀ PHÍA SAU (RIGHT WING EXTENSION - THEO ẢNH PHÍA HÔNG)
    const rearWingGeo = new THREE.BoxGeometry(9.8, 14, 22);
    const rearWing = new THREE.Mesh(rearWingGeo, whiteWallMat);
    rearWing.position.set(0, 7.0, -18);
    rearWing.castShadow = true;
    rightTowerGroup.add(rearWing);

    // Các ô cửa sổ kính đều tăm tắp ở mặt hông phía sau
    for (let row = 1; row <= 5; row++) {
      const winY = 2.2 + row * 2.2;
      for (let col = -26; col <= -10; col += 3.2) {
        const windowPane = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 2.2), glassCyanMat);
        windowPane.position.set(5.0, winY, col);
        rightTowerGroup.add(windowPane);
      }
    }

    group.add(rightTowerGroup);

    // ========================================================
    // 4. KHỐI SẢNH ĐÓN TẦNG TRỆT (GRAND ENTRANCE CANOPY & LOBBY)
    // ========================================================
    const entranceGroup = new THREE.Group();

    // Mái hiên phẳng vươn rộng màu xám đen tuyền
    const canopyGeo = new THREE.BoxGeometry(25, 0.5, 8.5);
    const canopy = new THREE.Mesh(canopyGeo, blackMat);
    canopy.position.set(-1.0, 3.2, 11.5);
    canopy.castShadow = true;
    entranceGroup.add(canopy);

    // Cột đỡ mái đón kim loại thanh mảnh
    [-11, -3, 5, 10].forEach(cx => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.2, 12), blackMat);
      post.position.set(cx, 1.6, 14.8);
      entranceGroup.add(post);
    });

    // BỨC TƯỜNG SẢNH ĐÓN ỐP ĐÁ TRẮNG CÓ BẢNG HIỆU CHỮ NỔI
    const lobbyWallGeo = new THREE.BoxGeometry(12, 3.0, 0.8);
    const lobbyWall = new THREE.Mesh(lobbyWallGeo, whiteWallMat);
    lobbyWall.position.set(-7.5, 1.5, 7.6);
    entranceGroup.add(lobbyWall);

    // Bảng tên toà nhà thực tế: "TÒA NHÀ CÔNG NGHỆ CAO - CTU HI-TECH BUILDING"
    const entranceSign = this.createEntranceSignSprite();
    entranceSign.position.set(-7.5, 1.8, 8.2);
    entranceGroup.add(entranceSign);

    // Cửa kính sảnh chính vào toà nhà (lối đi tự động)
    const glassEntranceGeo = new THREE.BoxGeometry(8, 2.8, 0.3);
    const glassEntrance = new THREE.Mesh(glassEntranceGeo, glassCyanMat);
    glassEntrance.position.set(3.5, 1.4, 7.6);
    entranceGroup.add(glassEntrance);

    // BẬC TAM CẤP GRANITE SÂN TRƯỚC SẢNH ĐÓN
    for (let step = 0; step < 3; step++) {
      const stepGeo = new THREE.BoxGeometry(28 + step * 2, 0.2, 6 + step * 1.5);
      const stepMesh = new THREE.Mesh(stepGeo, greyBaseMat);
      stepMesh.position.set(-1.0, 0.1 * step, 12 + step * 1.0);
      stepMesh.receiveShadow = true;
      entranceGroup.add(stepMesh);
    }

    // HÒN ĐÁ LƯU NIỆM JICA TRƯỚC SẢNH (NHƯ TRONG BỘ ẢNH)
    const jicaStoneGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const jicaStoneMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
    const jicaStone = new THREE.Mesh(jicaStoneGeo, jicaStoneMat);
    jicaStone.position.set(8.5, 0.8, 15.5);
    jicaStone.scale.set(1.4, 1.1, 0.9);
    entranceGroup.add(jicaStone);

    // BẢNG TIÊU ĐỀ BAY TRÊN KHÔNG (FLOATING PIN)
    const label = this.createLabelSign('TÒA NHÀ CÔNG NGHỆ CAO (ATL)', 0x0055a5);
    label.position.set(0, 21.0, 0);
    group.add(label);

    group.add(entranceGroup);

    return group;
  }

  // Tạo texture procedural cho hoa văn đục lỗ sảnh đứng trung tâm
  createPerforatedTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Nền trắng ngà
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, 256, 512);

    // Vẽ lưới hoa văn đục lỗ màu xám nhạt tinh tế
    ctx.fillStyle = '#cfd8dc';
    for (let y = 10; y < 512; y += 18) {
      for (let x = 10; x < 256; x += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 3);
    return texture;
  }

  // Tạo chữ nổi trên nóc "ĐẠI HỌC CẦN THƠ"
  createRoofTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 90);
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 45);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(10, 2, 1);
    return sprite;
  }

  // Tạo bảng tên thực tế gắn tường sảnh: "TÒA NHÀ CÔNG NGHỆ CAO"
  createEntranceSignSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(0, 0, 512, 120);

    // Dòng 1 tiếng Việt
    ctx.fillStyle = '#0055a5';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TÒA NHÀ CÔNG NGHỆ CAO', 20, 50);

    // Dòng 2 tiếng Anh
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('CTU HI-TECH BUILDING', 22, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 1.3), mat);
    return mesh;
  }


  // Dựng Trường CNTT & TT (CICT)
  buildCICTBuilding() {
    const group = new THREE.Group();

    // Khối nhà chính nhiều tầng
    const bodyGeo = new THREE.BoxGeometry(24, 11, 15);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.4 }); // Xanh công nghệ
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 5.5, 0);
    group.add(body);

    // Dải kính cửa sổ
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x90caf9, roughness: 0.1 });
    for (let y = 3; y <= 9; y += 3) {
      const windowGeo = new THREE.BoxGeometry(22, 1.2, 0.4);
      const win = new THREE.Mesh(windowGeo, glassMat);
      win.position.set(0, y, 7.6);
      group.add(win);
    }

    // Điểm nhấn sảnh đón màu cam CICT
    const entranceGeo = new THREE.BoxGeometry(8, 4, 3);
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf57c00 });
    const entrance = new THREE.Mesh(entranceGeo, orangeMat);
    entrance.position.set(0, 2, 8);
    group.add(entrance);

    const label = this.createLabelSign('TRƯỜNG CNTT & TT (CICT)', 0xe65100);
    label.position.set(0, 13, 0);
    group.add(label);

    return group;
  }

  // Dựng Hội trường Rùa
  buildTurtleHall() {
    const group = new THREE.Group();

    // Thân tròn bên dưới
    const baseGeo = new THREE.CylinderGeometry(8, 9, 3.5, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 1.75, 0);
    group.add(base);

    // Mái vòm hình mai rùa đặc trưng
    const domeGeo = new THREE.SphereGeometry(8.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32, // Xanh rêu mai rùa
      roughness: 0.5
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 3.5, 0);
    group.add(dome);

    const label = this.createLabelSign('HỘI TRƯỜNG RÙA', 0x1b5e20);
    label.position.set(0, 8.5, 0);
    group.add(label);

    return group;
  }

  // Dựng Nhà học C1
  buildC1Building() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(22, 9, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xef6c00 }); // Màu vàng cam học đường
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 4.5, 0);
    group.add(body);

    // Hành lang lam trắng
    const balconyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const balconyGeo = new THREE.BoxGeometry(22.2, 0.4, 1.5);
    for (let y = 3; y <= 6; y += 3) {
      const b = new THREE.Mesh(balconyGeo, balconyMat);
      b.position.set(0, y, 6.2);
      group.add(b);
    }

    const label = this.createLabelSign('NHÀ HỌC C1', 0x6a1b9a);
    label.position.set(0, 10.5, 0);
    group.add(label);

    return group;
  }

  // Dựng Trung tâm Học liệu (Thư viện)
  buildLibraryBuilding() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(18, 11, 14);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00838f, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 5.5, 0);
    group.add(body);

    const label = this.createLabelSign('TRUNG TÂM HỌC LIỆU (THƯ VIỆN)', 0x006064);
    label.position.set(0, 13, 0);
    group.add(label);

    return group;
  }

  // Tạo biển hiệu chữ 3D nổi trên nóc toà nhà
  createLabelSign(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Nền thẻ
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(10, 10, 492, 108, 20);
    ctx.fill();

    // Viền
    ctx.lineWidth = 8;
    ctx.strokeStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.stroke();

    // Chữ
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(16, 4, 1);
    return sprite;
  }

  // Kiểm tra nhân vật đang đứng gần toà nhà nào
  checkNearbyBuilding(characterPosition) {
    if (!characterPosition) return null;

    for (const [id, info] of Object.entries(buildingsPositions)) {
      const dx = characterPosition.x - info.position.x;
      const dz = characterPosition.z - info.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= info.interactRadius) {
        return id;
      }
    }
    return null;
  }
}

