// Quản lý scene Three.js chính: khởi tạo renderer, scene, ánh sáng,
// gắn CameraController + InputController, chạy vòng lặp render và phát hiện toà nhà.

import * as THREE from 'three';
import { CampusMap3D } from '../map/CampusMap3D.js';
import { Character } from '../character/Character.js';
import { CameraController } from './CameraController.js';
import { InputController } from './InputController.js';
import { Navigation } from '../map/Navigation.js';

export class SceneManager {
  constructor(canvas, { buildingManager, hud } = {}) {
    this.canvas = canvas;
    this.buildingManager = buildingManager;
    this.hud = hud;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.campusMap = null;
    this.character = null;
    this.cameraController = null;
    this.inputController = null;
    this.navigation = null;

    this.isRunning = false;
    this.isPausedForDialog = false;
  }

  async init(characterOptions = {}) {
    // 1. Khởi tạo Three.js Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd0e8ff); // Bầu trời xanh nhạt nắng sáng
    this.scene.fog = new THREE.FogExp2(0xd0e8ff, 0.004);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 600);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Ánh sáng (Mặt trời chiếu bóng mát khuôn viên CTU)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.85);
    hemiLight.position.set(0, 100, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(60, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.shadow.camera.top = 120;
    dirLight.shadow.camera.bottom = -120;
    this.scene.add(dirLight);

    // 5. Xây dựng bản đồ khuôn viên 3D (CampusMap3D)
    this.campusMap = new CampusMap3D(this.scene);
    await this.campusMap.build();

    // 6. Khởi tạo nhân vật (Character)
    this.character = new Character(characterOptions);
    this.scene.add(this.character.mesh);

    // 7. Hệ thống chỉ đường mũi tên đỏ (Navigation)
    this.navigation = new Navigation(this.scene);

    // 8. Camera Controller
    this.cameraController = new CameraController(this.camera, this.character.mesh);

    // 9. Input Controller
    this.inputController = new InputController({
      onToggleVehicle: () => {
        if (this.hud && this.hud.cycleNextVehicle) {
          this.hud.cycleNextVehicle();
        }
      },
      onToggleMap: () => {
        if (this.hud && this.hud.openMap) {
          this.hud.openMap();
        }
      },
      onTogglePassport: () => {
        if (this.hud && this.hud.openPassport) {
          this.hud.openPassport();
        }
      }
    });

    // 10. Xử lý Resize cửa sổ
    window.addEventListener('resize', () => this.onWindowResize());

    // Bắt đầu vòng lặp game
    this.isRunning = true;
    this.animate();
  }

  setVehicle(vehicleType) {
    if (this.character) {
      this.character.setVehicle(vehicleType);
    }
  }

  setDestination(buildingId) {
    if (this.navigation) {
      this.navigation.setTarget(buildingId);
    }
  }

  clearDestination() {
    if (this.navigation) {
      this.navigation.clear();
    }
  }

  exportToGLTF() {
    import('three/examples/jsm/exporters/GLTFExporter.js').then(({ GLTFExporter }) => {
      const exporter = new GLTFExporter();
      const exportGroup = new THREE.Group();
      if (this.campusMap) {
        exportGroup.add(this.campusMap.environmentGroup.clone());
        exportGroup.add(this.campusMap.buildingsGroup.clone());
      }

      exporter.parse(
        exportGroup,
        (gltf) => {
          const blob = new Blob([gltf], { type: 'model/gltf-binary' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'campus_map_ctu.glb';
          link.click();
          URL.revokeObjectURL(link.href);
          if (this.hud && this.hud.showNotification) {
            this.hud.showNotification('📥 Đã xuất file: campus_map_ctu.glb! Hãy mở bằng Blender.');
          }
        },
        (error) => {
          console.error('Lỗi xuất file GLTF:', error);
        },
        { binary: true }
      );
    });
  }

  animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(() => this.animate());

    // Nếu không bị pause bởi dialog thì cập nhật di chuyển
    if (!this.isPausedForDialog) {
      const dir = this.inputController.getMoveDirection();
      this.character.move(dir.x, dir.z);

      const charPos = this.character.getPosition();

      // Cập nhật mũi tên chỉ đường
      this.navigation.update(charPos);

      // Kiểm tra toà nhà lân cận
      const nearbyId = this.campusMap.checkNearbyBuilding(charPos);
      if (nearbyId && this.buildingManager) {
        this.buildingManager.handleArrival(nearbyId, {
          onDialogClose: () => {
            this.isPausedForDialog = false;
          }
        });
      }
    }

    // Camera luôn cập nhật mượt mà
    this.cameraController.update();

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}


