// https://github.com/GoogleChromeLabs/dark-mode-toggle/
const doc = document;
const store = localStorage;

const NAME = 'theme-switch';
const DARK = 'dark';
const LIGHT = 'light';
const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
const MQ_DARK = `(${PREFERS_COLOR_SCHEME}:${DARK})`;
const MQ_LIGHT = `(${PREFERS_COLOR_SCHEME}:${LIGHT})`;
const COLOR_SCHEME_CHANGE = 'colorschemechange';
const PERMANENT_COLOR_SCHEME = 'permanentcolorscheme';
const ICON_GRADIENT = `%3E%3Cdefs%3E%3ClinearGradient id='Grad' gradientUnits='userSpaceOnUse' x1='0%25' y1='0%25' x2='100%25' y2='0%25' gradientTransform='rotate(45)'%3E%3Cstop offset='0%25' stop-color='%23b6ada5' /%3E%3Cstop offset='100%25' stop-color='%238c8279' /%3E%3C/linearGradient%3E%3C/defs%3E`;
const ICON_SUN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E${ICON_GRADIENT}%3Cpath fill='url(%23Grad)' d='M256 143.7c-61.8 0-112 50.3-112 112.1s50.2 112.1 112 112.1 112-50.3 112-112.1-50.2-112.1-112-112.1zm0 192.2c-44.1 0-80-35.9-80-80.1s35.9-80.1 80-80.1 80 35.9 80 80.1-35.9 80.1-80 80.1zm256-80.1c0-5.3-2.7-10.3-7.1-13.3L422 187l19.4-97.9c1-5.2-.6-10.7-4.4-14.4-3.8-3.8-9.1-5.5-14.4-4.4l-97.8 19.4-55.5-83c-6-8.9-20.6-8.9-26.6 0l-55.5 83-97.8-19.5c-5.3-1.1-10.6.6-14.4 4.4-3.8 3.8-5.4 9.2-4.4 14.4L90 187 7.1 242.5c-4.4 3-7.1 8-7.1 13.3 0 5.3 2.7 10.3 7.1 13.3L90 324.6l-19.4 97.9c-1 5.2.6 10.7 4.4 14.4 3.8 3.8 9.1 5.5 14.4 4.4l97.8-19.4 55.5 83c3 4.5 8 7.1 13.3 7.1s10.3-2.7 13.3-7.1l55.5-83 97.8 19.4c5.4 1.2 10.7-.6 14.4-4.4 3.8-3.8 5.4-9.2 4.4-14.4L422 324.6l82.9-55.5c4.4-3 7.1-8 7.1-13.3zm-116.7 48.1c-5.4 3.6-8 10.1-6.8 16.4l16.8 84.9-84.8-16.8c-6.6-1.4-12.8 1.4-16.4 6.8l-48.1 72-48.1-71.9c-3-4.5-8-7.1-13.3-7.1-1 0-2.1.1-3.1.3l-84.8 16.8 16.8-84.9c1.2-6.3-1.4-12.8-6.8-16.4l-71.9-48.1 71.9-48.2c5.4-3.6 8-10.1 6.8-16.4l-16.8-84.9 84.8 16.8c6.5 1.3 12.8-1.4 16.4-6.8l48.1-72 48.1 72c3.6 5.4 9.9 8.1 16.4 6.8l84.8-16.8-16.8 84.9c-1.2 6.3 1.4 12.8 6.8 16.4l71.9 48.2-71.9 48z'/%3E%3C/svg%3E")`;
const ICON_MOON_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E${ICON_GRADIENT}%3Cpath fill='url(%23Grad)' d='M448.964 365.617C348.188 384.809 255.14 307.765 255.14 205.419c0-58.893 31.561-112.832 82.574-141.862 25.83-14.7 19.333-53.859-10.015-59.28A258.114 258.114 0 00280.947 0c-141.334 0-256 114.546-256 256 0 141.334 114.547 256 256 256 78.931 0 151.079-35.924 198.85-94.783 18.846-23.22-1.706-57.149-30.833-51.6zM280.947 480c-123.712 0-224-100.288-224-224s100.288-224 224-224c13.984 0 27.665 1.294 40.94 3.745-58.972 33.56-98.747 96.969-98.747 169.674 0 122.606 111.613 214.523 231.81 191.632C413.881 447.653 351.196 480 280.947 480z'/%3E%3C/svg%3E")`;

// https://developer.mozilla.org/en-US/docs/Web/CSS/::part
// https://github.com/mdn/web-components-examples/blob/master/shadow-part/index.html
// ? https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSModules/v1Explainer.md
const template = doc.createElement('template');
template.innerHTML = `
  <style>
    *,::after,::before{box-sizing:border-box}:host{contain:content;display:block}form{padding:0;background:transparent;color:inherit}fieldset{border:0;margin:0;padding:0}legend{font:var(--${NAME}-legend-font,inherit);padding:0;margin-block-end:0.5rem}input,label{cursor:pointer}

    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      position: absolute;
      pointer-events: none;
      margin: 0;
      border: 0;
      padding: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
      white-space: nowrap;
    }

    input:focus:not(:focus-visible) + label { outline: 0; }

    input:focus-visible + label {
      --${NAME}-border-color: var(--accent);
      /*
      outline: var(--accent) dotted thin;
      outline-offset: 2px; */
    }

    label {
      display: inline-block;
      position: relative;
      border-width: 1px;
      border-style: solid;
      border-color: var(--${NAME}-border-color, transparent);
      border-radius: 50%;
      padding: 1ch;
      font-size: 14px;
      line-height: 1;
      vertical-align: top;
      transition-delay: 0s;
      transition-duration: 300ms;
      transition-property: border-color, filter;
      transition-timing-function: ease-in-out;
    }

    label::before {
      content: '';
      display: inline-block;
      background-size: var(--${NAME}-icon-size, 1rem);
      background-repeat: no-repeat;
      width: var(--${NAME}-icon-size, 1rem);
      height: var(--${NAME}-icon-size, 1rem);
      filter: var(--${NAME}-icon-filter, none);
      vertical-align: middle;
      transition: filter 200ms ease-in-out;
    }

    [part="darkLabel"]::before {
      background-image: var(--${NAME}-${DARK}-icon, ${ICON_MOON_URL});
    }

    [part="lightLabel"]::before {
      background-image: var(--${NAME}-${LIGHT}-icon, ${ICON_SUN_URL});
    }

    [part="toggleLabel"]::before {
      background-image: var(--${NAME}-icon, none);
    }

    @media (hover: hover) {
      label:hover::before { filter: brightness(120%); }
    }
  </style>
  <form part="form">
    <fieldset part="fieldset">
      <!--<legend part="legend">Поменять оформление</legend>-->
      <!--<input part="${LIGHT}Radio" id="r1" type="radio" name="mode" value="${LIGHT}">-->
      <!--<label part="${LIGHT}Label" for="r1" title="Светлое оформление"></label>-->
      <!--<input part="${DARK}Radio" id="r2" type="radio" name="mode" value="${DARK}">-->
      <!--<label part="${DARK}Label" for="r2" title="Тёмное оформление"></label>-->

      <input part="toggleCheckbox" id="cb" type="checkbox">
      <label part="toggleLabel" for="cb" title="Поменять оформление"></label>
    </fieldset>
  </form>
`;

export class ThemeSwitch extends HTMLElement {
  constructor() {
    super();

    doc.addEventListener(COLOR_SCHEME_CHANGE, (event) => {
      this.mode = event.detail.colorScheme;
      // this._updateRadios();
      this._updateCheckbox();
    });

    doc.addEventListener(PERMANENT_COLOR_SCHEME, (event) => {
      this.permanent = event.detail.permanent;
    });

    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    // this._lightRadio = shadowRoot.querySelector('[part=lightRadio]');
    // this._lightLabel = shadowRoot.querySelector('[part=lightLabel]');
    // this._darkRadio = shadowRoot.querySelector('[part=darkRadio]');
    // this._darkLabel = shadowRoot.querySelector('[part=darkLabel]');

    this._toggleCheckbox = shadowRoot.querySelector('[part=toggleCheckbox]');
    this._toggleLabel = shadowRoot.querySelector('[part=toggleLabel]');

    const hasNativePrefersColorScheme = matchMedia(MQ_DARK).media !== 'not all';

    if (hasNativePrefersColorScheme) {
      matchMedia(MQ_DARK).addListener(({matches}) => {
        this.mode = matches ? DARK : LIGHT;
        this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
      });
    }

    const rememberedValue = store.getItem(NAME);

    if (rememberedValue && [DARK, LIGHT].includes(rememberedValue)) {
      this.mode = rememberedValue;
      this.permanent = true;
    }
    // Задать цветовую схему в зависимости от системных настроек
    // else if (hasNativePrefersColorScheme) {
    //   this.mode = matchMedia(MQ_LIGHT).matches ? LIGHT : DARK;
    // }
    if (!this.mode) {
      this.mode = LIGHT;
    }
    if (this.permanent && !rememberedValue) {
      store.setItem(NAME, this.mode);
    }

    // this._updateRadios();

    this._updateCheckbox();

    // [this._lightRadio, this._darkRadio].forEach((input) => {
    //   input.addEventListener('change', e => {
    //     if (e.target.checked) {
    //       this.mode = e.target.value;
    //       this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode})
    //     }
    //   }, false);
    // });

    this._toggleCheckbox.addEventListener('change', () => {
      this.mode = this._toggleCheckbox.checked ? LIGHT : DARK;
      this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});

      this.permanent = true;

      if (this.permanent) {
        store.setItem(NAME, this.mode);
      } else {
        store.removeItem(NAME);
      }
    });

    this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
    this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
      permanent: this.permanent,
    });
  }

  _dispatchEvent(type, value) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: value,
    }));
  }

  // _updateRadios() {
  //   if (this.mode === LIGHT) {
  //     this._lightRadio.checked = true;
  //   } else {
  //     this._darkRadio.checked = true;
  //   }
  // }

  _updateCheckbox() {
    if (this.mode === DARK) {
      this._toggleLabel.style.setProperty(
        `--${NAME}-icon`, `${ICON_SUN_URL}`
      );
      this._toggleCheckbox.checked = false;
    } else {
      this._toggleLabel.style.setProperty(
        `--${NAME}-icon`, `${ICON_MOON_URL}`
      );
      this._toggleCheckbox.checked = true;
    }
  }
}

window.customElements.define(NAME, ThemeSwitch);
