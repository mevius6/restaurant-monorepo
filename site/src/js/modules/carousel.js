import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { selectAll, getWidth, findByData } from '../utils';

gsap.registerPlugin(ScrollTrigger);

// TODO: кнопки управления и доступность
// https://w3c.github.io/aria-practices/#carousel
// TODO: бесконечное прокручивание / перетаскивание
// https://codepen.io/GreenSock/pen/LYRwgPo
// https://codepen.io/jh3y/pen/WNRvqJP

export default class Carousel {
  constructor(el, vars = {}) {
    this.vars = vars || {};
    this._initializeDOM(el);

    this._calcSpacing();
    this._createAnim();
    this._setOffset();

    if (this.vars.reveal) {
      gsap.set(this.DOM.items, { opacity: 0 });
      this._revealItems();
    }

    if (this.vars.control === 'scroll') {
      this._createST();
    }

    this._initializeEvents();
  }

  _initializeDOM(el) {
    this.DOM = { section: el };
    this.DOM.items = selectAll('.item', this.DOM.section);
    this.DOM.columns = getComputedStyle(this.DOM.section)
      .getPropertyValue('--columns');
    this.DOM.totalItems = this.DOM.columns || this.DOM.items.length;

    this.DOM.firstItem = this.DOM.items[0];
    this.DOM.itemWidth = getWidth(this.DOM.firstItem);
    this.DOM.wrap = this.DOM.firstItem.parentNode;
    this.DOM.wrapWidth = getWidth(this.DOM.wrap);

    if (this.vars.control === 'dots') {
      this.DOM.dots = selectAll('[name=position]', this.DOM.section);

      this.DOM.dots.forEach((dot, i) => {
        const progress = i / (this.DOM.dots.length - 1);

        const onChange = () => gsap.to(this.anim, {
          progress: progress,
          overwrite: 'auto'
        });

        dot.addEventListener('change', onChange, false);
      });
    }
  }

  _calcSpacing() {
    let gutterVal = getComputedStyle(this.DOM.section)
      .getPropertyValue('--gutter')
      .replace('rem', '');
    let rootVal = getComputedStyle(document.documentElement)
      .getPropertyValue('font-size')
      .replace('px', '');

    this.gutter = (gutterVal * rootVal);
    this.totalSpacing = (this.DOM.totalItems - 1) * this.gutter;

    return this.totalSpacing;
  }

  _createST() {
    const st = ScrollTrigger.create({
      trigger: this.DOM.section,
      start: 'top +=66,666%',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: self => {
        gsap.to(this.anim, {
          progress: self.progress,
          overwrite: 'auto'
        });
      }
    });

    return st;
  }

  _revealItems() {
    const tl = gsap.timeline({
            defaults: {
              duration: 1,
              ease: 'elastic.out(1, 0.75)',
              stagger: { axis: 'x', each: 0.04 },
            }
          }),
          st = ScrollTrigger.create({
            trigger: this.DOM.section,
            start: 'top center',
            end: 'bottom top',
            invalidateOnRefresh: true,
            onEnter: () => tl.to(this.DOM.items, { opacity: 1 }),
          });

    return st;
  }

  _createAnim() {
    this.anim = gsap.to(this.DOM.wrap, {
      x: -(this.DOM.itemWidth * (this.DOM.totalItems - 1) + this.totalSpacing),
      ease: 'none',
      paused: true
    });

    return this.anim;
  }

  _setOffset() {
    gsap.set(this.DOM.wrap, { position: 'absolute', top: 0 });

    if (this.vars.offset === 'half') {
      gsap.set(this.DOM.wrap, {
        left: `calc(50% - ${this.DOM.itemWidth/2}px)`,
      });
    } else {
      gsap.set(this.DOM.wrap, { left: 0 });
    }
  }

  // RWD
  _updateOffset() {
    this.DOM.itemWidth = getWidth(this.DOM.firstItem);
    this.anim.vars.x = -(
      this.DOM.itemWidth * (this.DOM.totalItems - 1) + this.totalSpacing
    );

    if (this.vars.offset === 'half') {
      gsap.set(this.DOM.wrap, {
        left: `calc(50% - ${this.DOM.itemWidth/2}px)`,
      });
    }
  }

  _initializeEvents() {
    this._onResizeEv = () => this._onResize();

    window.addEventListener('resize', this._onResizeEv, false);
  }

  // RWD
  _onResize() {
    this._calcSpacing();
    this._updateOffset();
    this.anim.pause(0).invalidate();
  }
}

// eslint-disable-next-line no-unused-vars
const carousel = new Carousel(findByData('reviews', 'id'), {
  control: 'dots',
  offset: 'half',
  reveal: 'true',
});
