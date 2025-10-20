class Haptics {
  constructor() {
    this.supportsVibrate = 'vibrate' in navigator;
    this.isIosWebKit =
      /iP(hone|od|ad)/.test(navigator.userAgent) &&
      /AppleWebKit/.test(navigator.userAgent);
    this._createIosSwitchIfNeeded();
  }

  _createIosSwitchIfNeeded() {
    if (!this.isIosWebKit) return;

    this._input = document.createElement('input');
    this._input.type = 'checkbox';
    try { this._input.setAttribute('switch', ''); } catch(e) {}

    const id = '__ios_haptic_switch_' + Math.random().toString(36).slice(2);
    this._input.id = id;

    this._label = document.createElement('label');
    this._label.htmlFor = id;

    Object.assign(this._input.style, {
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      opacity: '0',
      pointerEvents: 'none',
    });
    Object.assign(this._label.style, {
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      opacity: '0',
      pointerEvents: 'none',
    });

    document.body.appendChild(this._input);
    document.body.appendChild(this._label);
  }

  trigger() {
    // On iOS Safari, toggling the checkbox triggers a single native haptic
    if (this.isIosWebKit && this._label && this._input) {
      try {
        this._label.click(); // Toggle once → one haptic
        return true;
      } catch (e) {}
    }

    // Fallback for Android or desktop browsers
    if (this.supportsVibrate) {
      navigator.vibrate(10);
      return true;
    }

    return false;
  }
}

const haptics = new Haptics();