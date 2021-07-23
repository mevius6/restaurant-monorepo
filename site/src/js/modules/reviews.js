import { getLatestReviews } from './fetch-reviews';
import {
  appendNode,
  asyncFetchJSON,
  select,
  selectAll
} from '../utils';

const regex = /\s+(\.|,|!|\?)/g;
const subst = `$1`;
const rmSpaceBeforePunctMarks = (str) => str.replace(regex, subst);

// ? https://dmitripavlutin.com/javascript-modules-best-practices/#2-no-work-during-import
export class Review {
  constructor(el, date, rating, title, text, url, username, avatar) {
    this._initializeDOM(el);

    this._displayContent(date, rating, title, text, url, username, avatar);
    // .then(() => this._setRating());
  }

  _initializeDOM(el) {
    this.DOM = { review: el };
    this.DOM.url = this.DOM.review.querySelector('[itemprop="url"]');
    this.DOM.date = this.DOM.review.querySelector('[itemprop="datePublished"]');
    this.DOM.rating = this.DOM.review.querySelector('[itemprop="ratingValue"]');
    this.DOM.stars = selectAll('.rating input', this.DOM.review);
    this.DOM.title = this.DOM.review.querySelector(
      'blockquote > [itemprop="name"]'
    );
    this.DOM.body = this.DOM.review.querySelector('[itemprop="reviewBody"]');
    this.DOM.link = this.DOM.review.querySelector(
      '[itemprop="publisher"] > a'
    );
    this.DOM.username = this.DOM.review.querySelector(
      '[itemprop="author"] > [itemprop="name"]'
    );
    this.DOM.avatar = this.DOM.review.querySelector('.review__author-avatar');
  }

  async _displayContent(date, rating, title, text, url, username, avatar) {
    this.DOM.rating.textContent = rating;
    this.DOM.title.textContent = rmSpaceBeforePunctMarks(title);
    this.DOM.body.textContent = rmSpaceBeforePunctMarks(text);
    this.DOM.link.href = url;
    this.DOM.url.href = url;
    this.DOM.date.content = date.slice(0, date.lastIndexOf('T'));
    this.DOM.username.textContent = username;

    this._spellCheck(this.DOM.title, title);
    this._spellCheck(this.DOM.body, text);

    this._setRating(rating);
    this._createImage(avatar, {w: 150, h: 150});
  }

  // ? https://rapidapi.com/ru/collection/grammar-spellcheck-api
  // https://yandex.ru/dev/speller/doc/dg/reference/checkText.html
  async _spellCheck(el, str) {
    let url = null;
    let lines = str.replace(/\r\n|\n\r|\n|\r/g, '\n').split('\n');
    lines.forEach(async (line) => {
      if (line.length) {
        url = `https://speller.yandex.net/services/spellservice.json/checkText?text=${line}`;
      }
      await asyncFetchJSON(url).then((v) => {
        v.map(async (elem) => {
          el.textContent = str.replace(
            elem['word'],
            elem['s'][0] || elem['word']
          );
        });
      }).catch(error => error.message);
    });
  }

  async _createImage(src, ar = {}) {
    let img = new Image();
    img.alt = '...';
    img.src = src;
    img.width = ar.w;
    img.height = ar.h;
    img.loading = 'lazy';
    img.decoding = 'async';

    appendNode(this.DOM.avatar, img);
  }

  async _setRating(rating) {
    this.DOM.stars.forEach(input => {
      // input.value = `review${id}-${i}`
      // input.id = input.value
      // input.nextElementSibling.for = input.id
      let num = input.value.split('-')[1];
      if (rating === num) input.checked = true;
    });
  }
}

export default class Reviews {
  constructor(el) {
    this.DOM = { el: el };
    this.reviews = [];
    this.items = selectAll('.review', this.DOM.el);
    this.count = select('[itemprop="reviewCount"]');

    this._runAsyncFetch().then((v) => {
      this.count.textContent = v.paging.total_results;
      v.data.map(async (review, i) => {
        const {
          rating,
          title,
          published_date,
          text,
          url,
          user = {},
        } = review;
        this.reviews.push(new Review(
          this.items[i],
          published_date,
          rating,
          title,
          text,
          url,
          user.username,
          user.avatar.large.url,
        ));
      });
    }).catch(error => error.message);
  }

  async _runAsyncFetch() {
    const latestReviews = await getLatestReviews();
    return latestReviews;
  }
}

// /* eslint-disable-next-line no-undef */
// const firstEl = review1; // document.getElementById('review1');
// /* eslint-disable-next-line no-unused-vars */
// const reviews = new Reviews(firstEl.parentNode);
