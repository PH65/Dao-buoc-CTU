// Component hộp thoại dùng chung (tái sử dụng cho BuildingDialog và các thông báo khác).

export function createDialogBox({ title, message, buttons = [], onClose = null }) {
  let modal = document.getElementById('common-dialog-box');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'common-dialog-box';
  modal.className = 'modal-backdrop';

  const buttonsHtml = buttons.map((b, i) => `
    <button class="btn-action ${b.primary ? 'primary' : 'secondary'}" data-index="${i}">
      ${b.label}
    </button>
  `).join('');

  modal.innerHTML = `
    <div class="common-dialog-card animate-pop">
      ${title ? `<h3>${title}</h3>` : ''}
      <div class="dialog-content">${message}</div>
      <div class="dialog-actions">
        ${buttonsHtml}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll('.dialog-actions button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      modal.remove();
      if (buttons[idx] && buttons[idx].onClick) {
        buttons[idx].onClick();
      }
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onClose) onClose();
    }
  });

  return {
    close: () => modal.remove()
  };
}

