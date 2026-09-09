// Keep pointer-held driving separate from keyboard state and track every finger.
export const bindDriveButtons = (buttons, enabled) => {
  const held = new Map();
  for (const button of buttons) {
    button.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !enabled()) return;
      event.preventDefault();
      held.set(event.pointerId, button.dataset.key);
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener('pointermove', event => {
      if (held.has(event.pointerId)) event.preventDefault();
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(name, event => held.delete(event.pointerId));
    }
  }
  return {
    clear: () => held.clear(),
    keys: () => new Set(held.values()),
  };
};

export const bindGameAction = (button, action, touchMode, enabled) => {
  button.addEventListener('pointerdown', event => {
    if (!touchMode() || event.button !== 0 || !enabled()) return;
    event.preventDefault();
    action();
  });
  button.addEventListener('click', event => {
    // Pointer presses already fired above. Keyboard and assistive clicks still work.
    if (touchMode() && event.detail !== 0) return;
    if (enabled()) action();
  });
};
