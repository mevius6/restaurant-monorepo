const UA = navigator.userAgent;
const root = document.documentElement;
const body = document.body;

const MathUtils = {
  map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
  // линейная интерполяция
  lerp: (min, max, val) => min * (1 - val) + max * val,
  // расстояние между двумя точками
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  // случайное число
  getRandomNum: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
};

const calcWinsize = () => {
  return { ww: window.innerWidth, wh: window.innerHeight };
};

const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;

  if (!e) e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + body.scrollLeft + root.scrollLeft;
    posy = e.clientY + body.scrollTop + root.scrollTop;
  }

  return { x: posx, y: posy };
};

/**
 * https://github.com/ykob/tplh.net-2019/blob/master/src/utils/checkWebpFeature.js
 * @param {*} feature 'lossy' / 'lossless' / 'alpha' / 'animation'
 * @usage checkWebpFeature('alpha').then(() => {...}).catch(() => {...});
 */
const checkWebpFeature = (feature) => {
  return new Promise((resolve, reject) => {
    let testImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha:
        'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation:
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    let img = new Image();
    img.onload = () => {
      if (img.width > 0 && img.height > 0) {
        resolve(feature);
      } else {
        reject(feature);
      }
    };
    img.onerror = () => {
      reject(feature);
    };
    img.src = 'data:image/webp;base64,' + testImages[feature];
  });
};

const isMobileDevice = () => {
  let hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    let mql = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mql && mql.media === '(pointer:coarse)') {
      hasTouchScreen = !!mql.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      hasTouchScreen = (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
      );
    }
  }

  return new Promise((resolve, reject) => {
    hasTouchScreen ? resolve() : reject();
  });
}

// https://thisthat.dev/natural-width-vs-width/
// const getNaturalWidth = (url) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.addEventListener('load', () => {
//       resolve(img.naturalWidth);
//     });
//     img.addEventListener('error', () => reject());
//     img.src = url;
//   });
// };

const getWidth = (elem) =>
  parseFloat(getComputedStyle(elem, null).width.replace('px', ''));

const getHeight = (elem) =>
  parseFloat(getComputedStyle(elem, null).height.replace('px', ''));

const select = (expr, con = null) => (con || document).querySelector(expr);

const selectAll = (expr, con) => {
  return Array.prototype.slice.call((con || document).querySelectorAll(expr));
};

const findByData = (expr, con) => selectAll(`[data-${con}]`).find(
  (elem) => elem.dataset[con] === expr
);

const createNode = (expr) => document.createElement(expr);

const appendNode = (expr, con) => expr.appendChild(con);

const createNodeWithClass = (expr, con) => {
  const elem = createNode(expr);
  // elem.classList.add(con);
  elem.className += con;
  return elem;
};

// const objectKeys = (obj) => Object.keys(obj);

function handleAriaExpanded(evt) {
  let isExpanded = evt.currentTarget.getAttribute('aria-expanded') === 'true';

  ['aria-expanded', 'aria-pressed'].map((state) => {
    evt.currentTarget.setAttribute(state, !isExpanded);
  });
}

/**
 * https://developers.google.com/web/fundamentals/primers/async-functions#async_return_values
 * https://davidwalsh.name/javascript-promise-tricks
 *
 * @param {*} ms время в миллисекундах
 * @usage await delay(200);
 */
const delay = (ms) => new Promise(r => setTimeout(r, ms));

/**
 *
 * @param {*} url источник данных
 * @param {*} options объект с параметрами запроса
 * @param {*} query структура запроса
 * @returns декодированный ответ в формате JSON
 */
const asyncFetchJSON = async (url, options = {}, query = {}) => {
  const response = await fetch(url, options, query);
  const json = await response.json();

  if (!response.ok || json.errors) {
    // console.error(json.errors);
    const message = `Произошла ошибка: ${response.status}`;
    throw new Error(message);
  }

  return json;
};

function checkBrowser() {
  let UA = navigator.userAgent;
  let browser;

  // es5: UA.indexOf('...') > -1;
  let chromeAgent = UA.includes('Chrome');
  let IExplorerAgent = UA.includes('MSIE') || UA.includes('rv:');
  let firefoxAgent = UA.includes('Firefox');
  let safariAgent = UA.includes('Safari');
  if (chromeAgent && safariAgent) safariAgent = false;
  let operaAgent = UA.includes('OP');
  if (chromeAgent && operaAgent) chromeAgent = false;

  if (safariAgent) browser = 'Safari';
  if (chromeAgent) browser = 'Chrome';
  if (IExplorerAgent) browser = 'IE';
  if (operaAgent) browser = 'Opera';
  if (firefoxAgent) browser = 'Firefox';

  return browser;
}

function checkSystem() {
  let AV = navigator.appVersion;
  let os;

  // es5: AV.indexOf('...') != -1)
  if (AV.includes('Win')) os = 'Windows';
  if (AV.includes('Mac')) os = 'macOS';
  if (AV.includes('X11')) os = 'UNIX';
  if (AV.includes('Linux')) os = 'Linux';

  return os;
}

// https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
function trapFocus(element) {
  let focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'),
      firstFocusableEl = focusableEls[0],
      lastFocusableEl = focusableEls[focusableEls.length - 1];
  const KEYCODE_TAB = 9;

  element.addEventListener('keydown', function(e) {
    let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  });
}

/**
 * https://w3c.github.io/IntersectionObserver/ — spec
 *
 * https://github.blog/2021-01-29-making-githubs-new-homepage-fast-and-performant/
 *
 * @param {*} entries target
 * @param {*} observer io w/ default options
 * @example
 * let options = {
 *  root: document.querySelector('[data-scroll-root]'),
 *  rootMargin: '0px',
 *  threshold: [1.0],
 *  // V2: Track the actual visibility of the element
 *  trackVisibility: true,
 *  // V2: Set a minimum delay b/t notifications
 *  delay: 100
 * }
 *
 * for (const element of querySelectorAll('.js-anim')) {
 *  animationObserver.observe(element, options);
 * }
 */
const animationObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    entry.target.classList.toggle('.js-anim--running', entry.isIntersecting)
  }
});

const randomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

export {
  MathUtils,
  calcWinsize,
  getMousePos,
  isMobileDevice,
  checkBrowser,
  checkSystem,
  checkWebpFeature,
  select,
  selectAll,
  findByData,
  getWidth,
  getHeight,
  createNode,
  appendNode,
  createNodeWithClass,
  handleAriaExpanded,
  delay,
  asyncFetchJSON,
  trapFocus,
  randomValue,
};
