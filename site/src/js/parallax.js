import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { selectAll } from './utils';

gsap.registerPlugin(ScrollTrigger);

export const parallaxImages = (images) => {
  images.forEach((image) => {
    let imageWrap = image.parentNode;
    let effectWrap = imageWrap.parentNode;

    const revealImage = () => {
      let tl = gsap.timeline({
        // scrollTrigger: {
        //   trigger: imageWrap,
        //   start: 'top 50%',
        //   once: true,
        // },
        paused: true,
        defaults: {ease: 'power2.out'}
      })
        .from(imageWrap, {
          xPercent: -100,
          autoAlpha: 0,
        })
        .from(image, {
          xPercent: 100,
          scale: 1.3,
        }, '<');
      return tl;
    }

    // https://greensock.com/forums/topic/25270-can-we-use-matchmedia-for-timelines-outside-the-scrolltrigger/
    const mql = window.matchMedia('(min-width: 768px)');

    function handleMatches(matches) {
      if(parallaxImageTween) {
        // parallaxImageTween.kill();
        // gsap.set(imageWrap, {clearProps: true});
        // parallaxImageTween.progress(0).kill();
      }
      if (matches) {
        parallaxImageTween = gsap.fromTo(imageWrap,
          { y: '-20vh' },
          { y: '20vh' }
        );
        st = ScrollTrigger.create({
          trigger: effectWrap,
          start: 'top bottom',
          animation: parallaxImageTween,
          scrub: true,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 0.5,
            duration: 1,
            ease: 'power4.inOut',
          },
          ease: 'none'
        });
      } else {
        parallaxImageTween = gsap.fromTo(imageWrap,
          { y: '-20vh' },
          { y: '20vh' }
        );
        st = ScrollTrigger.create({
          trigger: effectWrap,
          start: 'top bottom',
          animation: parallaxImageTween,
          scrub: true,
          ease: 'none'
        });
      }
    }

    let st;
    let parallaxImageTween;
    mql.addListener((e) => handleMatches(e.matches));
    handleMatches(mql.matches);

    if ('loading' in HTMLImageElement.prototype) {
      image.onload = () => revealImage().play().delay(0.7);
    } else {
      //
    }
  });
}

/* eslint-disable-next-line no-unused-vars */
const parallax = parallaxImages(selectAll('.parallax-image'));
