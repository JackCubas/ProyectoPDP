(function () {
  const modalId = 'global-modal-helper';
  const overlayClass = 'modal-overlay';
  const dialogClass = 'modal-dialog';
  const titleClass = 'modal-title';
  const messageClass = 'modal-message';
  const actionsClass = 'modal-actions';
  const okClass = 'modal-ok';
  const cancelClass = 'modal-cancel';

  function buildModal() {
    if (document.getElementById(modalId)) {
      return document.getElementById(modalId);
    }

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.className = overlayClass;
    overlay.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.className = dialogClass;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('tabindex', '-1');

    const title = document.createElement('div');
    title.className = titleClass;
    title.textContent = 'Aviso';

    const message = document.createElement('div');
    message.className = messageClass;

    const actions = document.createElement('div');
    actions.className = actionsClass;

    const okButton = document.createElement('button');
    okButton.type = 'button';
    okButton.className = okClass;
    okButton.textContent = 'Aceptar';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = cancelClass;
    cancelButton.textContent = 'Cancelar';

    actions.appendChild(cancelButton);
    actions.appendChild(okButton);
    dialog.appendChild(title);
    dialog.appendChild(message);
    dialog.appendChild(actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });

    return overlay;
  }

  function openModal({ title = 'Aviso', message = '', type = 'info', okText = 'Aceptar', cancelText = 'Cancelar', showCancel = false, onOk, onCancel }) {
    const overlay = buildModal();
    const dialog = overlay.querySelector(`.${dialogClass}`);
    const titleEl = overlay.querySelector(`.${titleClass}`);
    const messageEl = overlay.querySelector(`.${messageClass}`);
    const okButton = overlay.querySelector(`.${okClass}`);
    const cancelButton = overlay.querySelector(`.${cancelClass}`);

    titleEl.textContent = title;
    messageEl.textContent = message;
    okButton.textContent = okText;
    cancelButton.textContent = cancelText;
    cancelButton.style.display = showCancel ? 'inline-flex' : 'none';

    const cleanup = () => {
      okButton.onclick = null;
      cancelButton.onclick = null;
      document.removeEventListener('keydown', onKeyDown);
      overlay.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('modal-open');
    };

    const closeModal = () => {
      cleanup();
      overlay.classList.remove('modal-visible');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 200);
    };

    const confirmClick = () => {
      closeModal();
      if (typeof onOk === 'function') {
        onOk();
      }
    };

    const cancelClick = () => {
      closeModal();
      if (typeof onCancel === 'function') {
        onCancel();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        cancelClick();
      }
      if (event.key === 'Enter') {
        confirmClick();
      }
    };

    okButton.onclick = confirmClick;
    cancelButton.onclick = cancelClick;
    document.addEventListener('keydown', onKeyDown);

    overlay.style.display = 'flex';
    overlay.classList.add('modal-visible');
    overlay.setAttribute('aria-hidden', 'false');
    dialog.focus();
  }

  function closeModal() {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.remove('modal-visible');
    overlay.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 200);
  }

  window.modalAlert = function (message, callback, title = 'Aviso') {
    openModal({ title, message, showCancel: false, onOk: callback });
  };

  window.modalConfirm = function (message, onOk, onCancel, title = 'Confirmar') {
    openModal({ title, message, showCancel: true, onOk, onCancel });
  };

  window.modalSuccess = function (message, callback) {
    openModal({ title: 'Éxito', message, showCancel: false, onOk: callback });
  };

  window.modalError = function (message, callback) {
    openModal({ title: 'Error', message, showCancel: false, onOk: callback });
  };

  window.alert = function (message) {
    modalAlert(String(message));
  };
})();
