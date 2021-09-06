// eslint-disable-next-line import/no-extraneous-dependencies
import { Texture } from 'ogl';
import gsap from 'gsap';

import Component from '../classes/Component';
import { split } from '../utils/text';

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
      },
    });

    this.canvas = canvas;

    window.TEXTURES = {};

    split({
      element: this.elements.title,
      expression: '<br>',
    });

    split({
      element: this.elements.title,
      expression: '<br>',
    });

    this.elements.titleSpans = this.elements.title.querySelectorAll('span span');

    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    window.ASSETS.forEach((image) => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false,
      });

      const media = new window.Image();

      media.crossOrigin = 'anonymous';
      media.src = image;
      media.onload = () => {
        texture.image = media;
        this.onAssetLoaded();
      };

      window.TEXTURES[image] = texture;
    });
  }

  onAssetLoaded() {
    this.length += 1;

    const percent = this.length / window.ASSETS.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise(() => {
      this.emit('completed');

      this.animateOut = gsap.timeline({ delay: 1 });

      this.animateOut
        .to(
          this.elements.titleSpans,
          { y: '100%', duration: 1.5, stagger: 0.1 },
        );

      this.animateOut
        .to(
          this.elements.numberText,
          { y: '100%', duration: 1.5, stagger: 0.1 },
          '-=1.4',
        );

      this.animateOut
        .to(
          this.element,
          { autoAlpha: 0, duration: 1 },
        );

      this.animateOut.call(() => {
        this.destroy();
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
