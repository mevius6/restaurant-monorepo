import { gsap } from 'gsap';
import {
  findByData,
  createNodeWithClass,
  appendNode,
  selectAll,
  randomValue,
} from '../utils';
import panoImage1 from 'url:../../images/pano/1.jpg';
import panoImage2 from 'url:../../images/pano/2.jpg';
import panoImage3 from 'url:../../images/pano/3.jpg';
import panoImage1_mod from 'url:../../images/pano/1.webp';
import panoImage2_mod from 'url:../../images/pano/2.webp';
import panoImage3_mod from 'url:../../images/pano/3.webp';

const panoImages = {
  old: [panoImage1, panoImage2, panoImage3],
  mod: [panoImage1_mod, panoImage2_mod, panoImage3_mod]
};

let webp = document.documentElement.classList.contains('webp');

let randomImage = webp
  ? randomValue(panoImages.mod)
  : randomValue(panoImages.old);

const pano = findByData('panorama', 'id');
const centered = {
  left: '50%',
  top: '50%',
  xPercent: -50,
  yPercent: -50,
};

gsap.set(pano, { perspective: 1000 });

// let zoom = 1;
let stageH = gsap.getProperty(pano, 'height'),
    mouse = { x: 0.5, y: 0.5 },
    pov = { x: 0.5, y: 0.5, speed: 0.03 },
    auto = true;

const num = 16;

for (let i = 0; i < num; i++) {
  let box = createNodeWithClass('div', 'pano-box');
  appendNode(pano, box);

  gsap.set(box, {
    ...centered,
    color: '#fff',
    z: 1300,
    width: 250,
    height: 1125,
    scaleX: -1,
    rotationY: -89 + (i / num) * -360 + 90,
    transformOrigin: String('50% 50% -626%'),
    backgroundImage: `url(${randomImage})`,
    backgroundPosition: i * -250 + 'px 0px',
  });
}

const panoControlWrap = createNodeWithClass('div', 'pano-switches');
appendNode(pano.parentNode, panoControlWrap);

panoImages.mod.forEach((el, i) => {
  let btn = createNodeWithClass('button', 'pano-switch');
  btn.textContent = i+1;
  appendNode(panoControlWrap, btn);
});

const panoSwitches = selectAll('.pano-switch');
panoSwitches.map((panoSwitch, index) => {
  panoSwitch.addEventListener('click', () => {
    gsap.set('.pano-box', {
      backgroundImage: `url(${webp
        ? panoImages.mod[index]
        : panoImages.old[index]
      })`,
    });
  });
});

window.onresize = () => {
  stageH = gsap.getProperty(pano, 'height');
  gsap.to('.pano-box', { y: 0 });
};

pano.onmousemove = (e) => {
  auto = false;
  gsap.killTweensOf(mouse);
  mouse.x = e.clientX / window.innerWidth;
  mouse.y = e.clientY / window.innerHeight;
};

pano.onmouseleave = () => {
  auto = true;
};

// pano.onclick = (e) => {
//   gsap.to('.pano-box', {
//     duration: 0.4,
//     z: [1300,1500,1700][zoom]
//   });
//   zoom++;
//   if (zoom == 3) zoom = 0;
// }

setAutoX();
function setAutoX() {
  if (auto)
    gsap.to(mouse, {
      duration: 5,
      x: gsap.utils.random(0.45, 0.55),
      ease: 'sine.in',
    });
  gsap.delayedCall(gsap.utils.random(3, 5), setAutoX);
}

setAutoY();
function setAutoY() {
  if (auto)
    gsap.to(mouse, {
      duration: 6,
      y: gsap.utils.random(0, 1),
      ease: 'sine.in',
    });
  gsap.delayedCall(gsap.utils.random(4, 6), setAutoY);
}

gsap.ticker.add(() => {
  pov.x += (mouse.x - pov.x) * pov.speed;
  pov.y += (mouse.y - pov.y) * pov.speed;
  gsap.set('.pano-box', {
    rotationY: (i) => -89 + (i / num) * -360 + 90 * pov.x,
    y: Math.abs(1000 - stageH) / 2 - Math.abs(1000 - stageH) * pov.y,
  });
});
