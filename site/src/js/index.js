import Cursor from './modules/cursor';
import {
  checkBrowser,
  checkWebpFeature,
  isMobileDevice,
  selectAll
} from './utils';

const doc = document,
      root = doc.documentElement,
      {body} = doc;

// const os = checkSystem();
const browser = checkBrowser();

let imageFormat = '';
checkWebpFeature('lossy')
  .then(() => {
    imageFormat = 'webp';
    root.classList.add(imageFormat);
  })
  .catch(() => {
    imageFormat = 'no-webp';
    root.classList.add(imageFormat);
  });

let device = '';
isMobileDevice()
  .then(() => {
    device = 'mobile';
    root.dataset.device = device;
  })
  .catch(() => {
    device = 'desktop';
    root.dataset.device = device;
  });

window.addEventListener('load', () => {
  root.classList.replace('no-js', 'js');
  body.classList.replace('page--loading', 'page--loaded');
  root.dataset.browser = browser;
  // root.dataset.os = os;

  if (root.dataset.device !== 'mobile') {
    const cursor = new Cursor(doc.querySelector('.cursor'));
    const hoverable = selectAll('button, a, label, theme-switch');
    hoverable.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.emit('enter'));
      el.addEventListener('mouseleave', () => cursor.emit('leave'));
    });
  }
});
