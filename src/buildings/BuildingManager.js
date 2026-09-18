// Điều phối tương tác khi nhân vật đến gần 1 toà nhà: mở BuildingDialog,
// xử lý lựa chọn "tham quan tổng quát" hay "tìm hiểu tiện ích", và trao dấu passport.

import { buildings } from './buildingsData.js';
import { showBuildingDialog, showAmenitiesDialog } from './BuildingDialog.js';
import { openPanoramaViewer } from './PanoramaViewer.js';

export class BuildingManager {
  constructor(passportManager, hud) {
    this.passportManager = passportManager;
    this.hud = hud;
    this.activeBuildingId = null;
    this.cooldowns = new Map(); // Ngăn pop-up liên tục khi đứng yên tại toà nhà
  }

  handleArrival(buildingId, { onDialogClose } = {}) {
    if (!buildingId || !buildings[buildingId]) return;
    
    // Kiểm tra cooldown (tránh việc mỗi frame lại mở lại dialog nếu người chơi vừa đóng)
    const now = Date.now();
    const lastTime = this.cooldowns.get(buildingId) || 0;
    if (now - lastTime < 10000) {
      return; // Đang cooldown 10 giây
    }

    this.activeBuildingId = buildingId;
    const building = buildings[buildingId];

    showBuildingDialog(building, {
      onGeneralTour: (b) => {
        openPanoramaViewer(b, {
          onClose: () => {
            this.cooldowns.set(buildingId, Date.now());
            if (onDialogClose) onDialogClose();
          },
          onFinishTour: (b) => {
            this.awardStamp(b);
            this.cooldowns.set(buildingId, Date.now());
            if (onDialogClose) onDialogClose();
          }
        });
      },
      onAmenities: (b) => {
        showAmenitiesDialog(b, {
          onClose: () => {
            this.cooldowns.set(buildingId, Date.now());
            if (onDialogClose) onDialogClose();
          },
          onOpenTour: (b) => {
            openPanoramaViewer(b, {
              onClose: () => {
                this.cooldowns.set(buildingId, Date.now());
                if (onDialogClose) onDialogClose();
              },
              onFinishTour: (b) => {
                this.awardStamp(b);
                this.cooldowns.set(buildingId, Date.now());
                if (onDialogClose) onDialogClose();
              }
            });
          }
        });
      },
      onClose: () => {
        this.cooldowns.set(buildingId, Date.now());
        if (onDialogClose) onDialogClose();
      }
    });
  }

  awardStamp(building) {
    if (!building || !building.passportStampId) return;
    const result = this.passportManager.addStamp(building.passportStampId, building.id);
    if (result && result.isNew) {
      if (this.hud && this.hud.showNotification) {
        this.hud.showNotification(`🎉 Bạn đã nhận được con dấu: [${result.stamp.title}] trong Hộ Chiếu CTU!`);
      }
    } else if (result && !result.isNew) {
      if (this.hud && this.hud.showNotification) {
        this.hud.showNotification(`✨ Bạn đã check-in lại tại ${building.name}!`);
      }
    }
  }

  resetCooldown(buildingId) {
    this.cooldowns.delete(buildingId);
  }
}

