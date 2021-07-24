import { randomValue } from '../utils';
import heroImage1 from 'url:../../images/hero/1.jpg';
import heroImage2 from 'url:../../images/hero/2.jpg';
import heroImage3 from 'url:../../images/hero/3.jpg';
import heroImage1_mod from 'url:../../images/hero/1.webp';
import heroImage2_mod from 'url:../../images/hero/2.webp';
import heroImage3_mod from 'url:../../images/hero/3.webp';

const webp = document.documentElement.classList.contains('webp');
const heroEl = hero;
const heroImages = {
  old: [heroImage1, heroImage2, heroImage3],
  mod: [heroImage1_mod, heroImage2_mod, heroImage3_mod]
};

const setRandomImage = () => {
  let randomImage = webp
    ? randomValue(heroImages.mod)
    : randomValue(heroImages.old);

  heroEl.style.backgroundImage = `var(--image-overlay), url(${randomImage})`;
};

setTimeout(() => setRandomImage(), 200);
