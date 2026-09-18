// Quản lý trạng thái các dấu đã thu thập (lưu vào localStorage),
// cấp dấu mới khi người chơi tham quan xong 1 toà nhà.

import { loadData, saveData } from '../utils/storage.js';
import { STORAGE_KEY_PASSPORT } from '../utils/constants.js';
import { stamps } from './stampsData.js';

export class PassportManager {
  constructor() {
    const saved = loadData(STORAGE_KEY_PASSPORT, null);
    this.collectedStamps = new Map();
    this.visitedBuildings = new Set();
    this.playerInfo = {
      gender: 'male',
      wearCtuShirt: true,
      startGate: 'B'
    };

    if (saved) {
      if (Array.isArray(saved.collectedStamps)) {
        saved.collectedStamps.forEach(item => {
          this.collectedStamps.set(item.stampId, item.timestamp);
        });
      }
      if (Array.isArray(saved.visitedBuildings)) {
        saved.visitedBuildings.forEach(bId => this.visitedBuildings.add(bId));
      }
      if (saved.playerInfo) {
        this.playerInfo = { ...this.playerInfo, ...saved.playerInfo };
      }
    }
  }

  setPlayerInfo(info) {
    this.playerInfo = { ...this.playerInfo, ...info };
    this.persist();
  }

  addStamp(stampId, buildingId = null) {
    if (!stamps[stampId]) return null;
    const isNew = !this.collectedStamps.has(stampId);
    
    if (isNew) {
      const now = new Date().toISOString();
      this.collectedStamps.set(stampId, now);
      if (buildingId) {
        this.visitedBuildings.add(buildingId);
      }
      this.persist();
    }

    return {
      isNew,
      stamp: stamps[stampId]
    };
  }

  hasStamp(stampId) {
    return this.collectedStamps.has(stampId);
  }

  hasVisited(buildingId) {
    return this.visitedBuildings.has(buildingId);
  }

  getProgress() {
    const total = Object.keys(stamps).length;
    const collected = this.collectedStamps.size;
    const percent = Math.round((collected / total) * 100);
    return { collected, total, percent };
  }

  persist() {
    const data = {
      playerInfo: this.playerInfo,
      collectedStamps: Array.from(this.collectedStamps.entries()).map(([stampId, timestamp]) => ({
        stampId,
        timestamp
      })),
      visitedBuildings: Array.from(this.visitedBuildings)
    };
    saveData(STORAGE_KEY_PASSPORT, data);
  }
}

