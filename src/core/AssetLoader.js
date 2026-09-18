// Load tập trung: model 3D (.glb) nhân vật/toà nhà từ Blender, texture bản đồ,
// và ảnh thực tế của từng toà nhà.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AssetLoader {
  static loader = new GLTFLoader();
  static cache = new Map();

  static async loadModel(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          this.cache.set(path, gltf.scene);
          resolve(gltf.scene.clone());
        },
        undefined,
        (error) => {
          console.warn(`[AssetLoader] Không tìm thấy file 3D tại ${path}, sử dụng mô hình Three.js mặc định.`, error);
          resolve(null);
        }
      );
    });
  }

  static async preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (e) => resolve(null);
    });
  }
}

