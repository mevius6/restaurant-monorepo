import { gsap } from 'gsap';
import { EventEmitter } from 'events';
import {
  createNode,
  createNodeWithClass,
  appendNode,
  selectAll,
  delay,
} from './utils';
import { getAllPostsForHome } from './fetch-posts';

// eslint-disable-next-line no-unused-vars
const responsiveImageArgs = [
  'srcSet',
  'webpSrcSet',
  'src',
  'width',
  'height',
  'alt',
  'base64'
];

const dateOptions = {
  // weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const formatter = new Intl.DateTimeFormat('ru', {
  ...dateOptions,
  ...timeOptions,
});

class Card extends EventEmitter {
  constructor(
    el,
    title,
    excerpt,
    date,
    slug,
    ...responsiveImageArgs
  ) {
    super();
    this._initializeDOM(el);

    this._createResponsiveImage(...responsiveImageArgs, {LQIP: false});
    this._displayContent(title, excerpt, date, slug);

    this.config = { isCompactView: true };

    this._createTimeline();
    this._initializeEvents();
    this._listen();
  }

  _initializeDOM(el) {
    this.DOM = { card: el };
    this.DOM.content = this.DOM.card.querySelector('.card__container');
    this.DOM.imageWrapper = this.DOM.card.querySelector('.card__image-wrapper');
    appendNode(
      this.DOM.imageWrapper,
      createNodeWithClass('picture', 'card__image')
    );
    this.DOM.image = this.DOM.card.querySelector('.card__image');
    this.DOM.textWrapper = this.DOM.card.querySelector('.card__text-wrapper');
    this.DOM.title = this.DOM.card.querySelector('.card__headline');
    this.DOM.body = this.DOM.card.querySelector('.card__body');
    this.DOM.date = this.DOM.card.querySelector('.card__date');
    this.DOM.cta = this.DOM.card.querySelector('.card__cta');
    this.DOM.id = this.DOM.card.parentNode.getAttribute('id') || undefined;
  }

  async _displayContent(title, excerpt, date, slug) {
    this.DOM.title.textContent = title;
    this.DOM.body.textContent = excerpt;
    this.DOM.cta.href = `https://blog.hochutort.com/posts/${slug}`;
    this.DOM.cta.target = '_blank';
    this.DOM.cta.rel = 'noopener';

    let dateObj = new Date(date);
    let dateStr = dateObj.toLocaleDateString('ru', dateOptions);

    this.DOM.date.dateTime = formatter.format(dateObj);
    this.DOM.date.textContent = dateStr;
  }

  async _createResponsiveImage(
    srcSet,
    webpSrcSet,
    src,
    width,
    height,
    alt,
    base64,
    vars = {}
  ) {
    let source1 = createNode('source');
    source1.srcset = webpSrcSet;
    source1.type = 'image/webp';

    let source2 = createNode('source');
    source2.srcset = srcSet;
    source2.type = 'image/jpeg';

    let img = new Image();
    img.alt = alt || '...';
    img.src = `url('${src}')`;
    img.width = width;
    img.height = height;
    img.loading = 'lazy';
    img.decoding = 'async';

    if ('loading' in HTMLImageElement.prototype) {
      img.onload = () => this._revealImage();
    } else {
      // https://caniuse.com/loading-lazy-attr
      vars.LQIP = true;
    }

    if (vars.LQIP) {
      this.DOM.imageWrapper.style.backgroundImage = `url('${base64}')`;
      img.onload = () => {
        img.animate({ opacity: [0, 1] }, {
          fill: 'forwards',
          duration: 700,
          easing: 'ease-out',
        });
      }
    }

    appendNode(this.DOM.image, source1);
    appendNode(this.DOM.image, source2);
    appendNode(this.DOM.image, img);
  }

  _revealImage() {
    let tl = gsap.timeline({ defaults: {ease: 'power2.out'} });
    tl
      .from(this.DOM.imageWrapper, {
        xPercent: -100,
        autoAlpha: 0,
      })
      .from(this.DOM.image, {
        xPercent: 100,
        scale: 1.3,
      }, '<');
    return tl;
  }

  _createTimeline() {
    this.tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'expo.out', duration: 0.7 },
    });
    this.tl
      .from(this.DOM.textWrapper, { yPercent: 100 })
      .from(this.DOM.title, { yPercent: -100 }, '<')
      .to(this.DOM.body, {
        opacity: 1,
        duration: 0.1,
      }, '>-0.7');
  }

  _initializeEvents() {
    this._onMouseEnterEv = () => this._onMouseEnter();
    this._onMouseLeaveEv = () => this._onMouseLeave();
    this._onTouchEndEv = () => {
      this._onMouseEnter();
      this._onTouchEnd();
    };

    this.DOM.card.addEventListener('mouseenter', this._onMouseEnterEv, false);
    this.DOM.card.addEventListener('mouseleave', this._onMouseLeaveEv, false);
    this.DOM.card.addEventListener('touchend', this._onTouchEndEv, false);
  }

  _onMouseEnter() {
    this.emit('enter');
  }

  _onMouseLeave() {
    this.emit('leave');
  }

  async _onTouchEnd() {
    let mql = window.matchMedia('(max-width: 1024px)');
    if (mql.matches) {
      await delay(2000);
      this.tl.reverse();
    }
  }

  _listen() {
    this.on('enter', () => this.config.isCompactView
      ? this.tl.play()
      : this.tl.pause(1)
    );
    this.on('leave', () => this.config.isCompactView
      ? this.tl.reverse()
      : this.tl.pause(1)
    );
  }
}

// ? https://w3c.github.io/aria-practices/#feed
export default class CardFeed {
  constructor(el) {
    this.DOM = { el: el };
    this.cards = [];
    this.items = selectAll('.card--compact');

    this._runAsyncFetch().then((v) => {
      v.map(async (post, i) => {
        const {
          title,
          excerpt,
          date,
          slug,
          coverImage: {
            responsiveImage: {
              srcSet,
              webpSrcSet,
              src,
              width,
              height,
              alt,
              base64,
            }
          }
        } = post;
        this.cards.push(new Card(
          this.items[i],
          title,
          excerpt,
          date,
          slug,
          srcSet,
          webpSrcSet,
          src,
          width,
          height,
          alt,
          base64,
        ));
      });
    }).catch(error => error.message);
  }

  async _runAsyncFetch() {
    // const allPosts = await Promise.map(getAllPostsForHome(), async (v));
    const allPosts = await getAllPostsForHome();
    return allPosts;
  }
}

// eslint-disable-next-line no-unused-vars
const feed = new CardFeed(document.getElementById('post1').parentNode);
