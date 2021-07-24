import { gsap } from 'gsap';
import { MathUtils, select } from '../utils';
import { EventEmitter } from 'events';

// ? https://medium.com/14islands/developing-a-performant-custom-cursor-89f1688a02eb
export default class Cursor extends EventEmitter {
  constructor(el) {
    super();
    this.DOM = {cursor: el};
    this.DOM.cursorInner = this.DOM.cursor.querySelector('.cursor__inner');

    this.filterId = '#Distortion';

    this.DOM.feTurbulence = select(`${this.filterId} > feTurbulence`);

    this.primitiveValues = {turb: 0};

    this._createTimeline();

    this.rect = this.DOM.cursor.getBoundingClientRect();

    this.renderedStyles = {
      radius: {
        previous: 60,
        current: 60,
        amt: 0.2,
      },
      stroke: {
        previous: 1,
        current: 1,
        amt: 0.2,
      },
    };

    // Исправлена ошибка с позиционированием курсора при прокрутке
    document.addEventListener('mousemove', (e) => {
      let x = e.clientX - this.rect.width / 2;
      let y = e.clientY - this.rect.height / 2;

      // let anim = this.DOM.cursor.animate(
      //   { transform: `translate(${x}px, ${y}px)` },
      //   { fill: 'forwards', duration: 500 }
      // );

      gsap.to(this.DOM.cursor, {
        x: x,
        y: y,
        ease: 'power3',
      });

      gsap.set(this.DOM.cursor, {
        '--cursor-alpha': 1,
        delay: 0.18,
        duration: 0.9,
        ease: 'power3.easeOut',
      });
    });

    this._listen();

    requestAnimationFrame(() => this._render());
  }

  _render() {
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].previous = MathUtils.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].amt
      );
    }

    this.DOM.cursorInner.setAttribute(
      'r',
      this.renderedStyles['radius'].previous
    );
    this.DOM.cursorInner.style.setProperty(
      '--cursor-width',
      this.renderedStyles['stroke'].previous + 'px'
    );

    requestAnimationFrame(() => this._render());
  }

  _createTimeline() {
    // https://greensock.com/docs/v3/Eases/RoughEase
    let roughEase = `rough({
      template: none.out,
      strength: 2,
      points: 120,
      taper: 'none',
      randomize: true,
      clamp: false
    })`;

    this.tl = gsap.timeline({
      paused: true,
      onStart: () => {
        this.DOM.cursorInner.style
          .setProperty('--cursor-svg-filter', `url(${this.filterId})`);
      },
      onUpdate: () => {
        this.DOM.feTurbulence
          .setAttribute('baseFrequency', this.primitiveValues.turb);
      },
      onComplete: () => {
        this.DOM.cursorInner.style
          .setProperty('--cursor-svg-filter', 'none');
      },
    });

    this.tl.to(this.primitiveValues, {
      duration: 0.5,
      ease: roughEase,
      startAt: {turb: 0.07},
      turb: 0,
    });

    // this.tl.timeScale(.75);
  }

  _enter() {
    this.renderedStyles['radius'].current = 40;
    this.renderedStyles['stroke'].current = 2;
    this.tl.restart();
  }

  _leave() {
    this.renderedStyles['radius'].current = 60;
    this.renderedStyles['stroke'].current = 1;
    this.tl.progress(1).kill();
  }

  _listen() {
    this.on('enter', () => this._enter());
    this.on('leave', () => this._leave());
  }
}
