import gsap from 'gsap';

import Title from '../animations/Title';
import Paragraph from '../animations/Paragraph';
import Label from '../animations/Label';
import Highlight from '../animations/Highlight';

import AsyncLoad from './AsyncLoad';

import { ColorsManager } from './Colors';

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
      animationsHighlights: '[data-animation="highlight"]',

      preloaders: '[data-src]',
    };

    this.id = id;
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    Object.entries(this.selectorChildren).forEach(([key, entry]) => {
      if (
        entry instanceof window.HTMLElement
        || entry instanceof window.NodeList
        || Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
    this.createPreloader();
  }

  createAnimations() {
    this.animations = [];

    this.animationsTitles = Array.from(
      this.elements.animationsTitles || [],
    ).map((element) => new Title({ element }));

    this.animations.push(...this.animationsTitles);

    this.animationsParagraphs = Array.from(
      this.elements.animationsParagraphs || [],
    ).map((element) => new Paragraph({ element }));

    this.animations.push(...this.animationsParagraphs);

    this.animationsLabels = Array.from(
      this.elements.animationsLabels || [],
    ).map((element) => new Label({ element }));

    this.animations.push(...this.animationsLabels);

    this.animationsHighlights = Array.from(
      this.elements.animationsHighlights || [],
    ).map((element) => new Highlight({ element }));

    this.animations.push(...this.animationsHighlights);
  }

  createPreloader() {
    this.preloaders = Array.from(
      this.elements.preloaders || [],
    ).map((element) => new AsyncLoad({ element }));
  }

  show(animation) {
    return new Promise((resolve) => {
      ColorsManager.change({
        backgroundColor: this.element.dataset.background,
        color: this.element.dataset.color,
      });

      if (animation) {
        this.animationIn = animation;
      } else {
        this.animationIn = gsap.timeline();

        this.animationIn.fromTo(
          this.element,
          { autoAlpha: 0 },
          { autoAlpha: 1 },
        );
      }

      this.animationIn.call(() => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();

      this.animationOut = gsap.timeline();

      this.animationOut.to(this.element, { autoAlpha: 0, onComplete: resolve });
    });
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
    }

    this.animations.forEach((animation) => animation.onResize());
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  update() {
    this.scroll.target = gsap.utils.clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, 0.1);

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style.transform = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {

  }

  removeEventListeners() {

  }

  destroy() {
    this.removeEventListeners();
  }
}
