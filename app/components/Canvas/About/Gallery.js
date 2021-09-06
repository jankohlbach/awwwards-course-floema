/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Transform } from 'ogl';
import gsap from 'gsap';

import Media from './Media';

export default class Gallery {
  constructor({
    element, geometry, index, gl, scene, sizes,
  }) {
    this.element = element;
    this.elementWrapper = element.querySelector('.about__gallery__wrapper');
    this.index = index;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.group = new Transform();

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.createMedias();

    this.onResize({
      sizes: this.sizes,
    });

    this.group.setParent(this.scene);
  }

  createMedias() {
    this.mediasElements = this.element.querySelectorAll('.about__gallery__media');

    this.medias = Array.from(this.mediasElements || [])
      .map((element, index) => new Media({
        element,
        index,
        geometry: this.geometry,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      }));
  }

  show() {
    Array.from(this.medias || [])
      .map((media) => media.show());
  }

  hide() {
    Array.from(this.medias || [])
      .map((media) => media.hide());
  }

  onResize(event) {
    this.bounds = this.elementWrapper.getBoundingClientRect();

    this.sizes = event.sizes;

    this.width = (this.bounds.width / window.innerWidth) * this.sizes.width;

    this.scroll.current = 0;
    this.scroll.target = 0;

    Array.from(this.medias || [])
      .map((media) => media.onResize(event, this.scroll.current));
  }

  onTouchDown() {
    this.scroll.start = this.scroll.current;
  }

  onTouchMove({ x }) {
    const distance = x.start - x.end;

    this.scroll.target = this.scroll.current - distance;
  }

  // eslint-disable-next-line
  onTouchUp({ x, y }) {

  }

  update(scroll) {
    const distance = (scroll.current - scroll.target) * 0.1;
    const y = scroll.current / window.innerHeight;

    if (this.scroll.current < this.scroll.target) {
      this.direction = 'right';
      this.scroll.velocity = -1;
    } else if (this.scroll.current > this.scroll.target) {
      this.direction = 'left';
      this.scroll.velocity = 1;
    }

    this.scroll.target -= this.scroll.velocity;
    this.scroll.target += distance;

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current, this.scroll.target, this.scroll.lerp,
    );

    Array.from(this.medias || [])
      // eslint-disable-next-line array-callback-return
      .map((media) => {
        const scaleX = media.mesh.scale.x / 2 + 0.25;

        if (this.direction === 'left') {
          const x = media.mesh.position.x + scaleX;

          if (x < -this.sizes.width / 2) {
            media.extra += this.width;
          }
        } else if (this.direction === 'right') {
          const x = media.mesh.position.x - scaleX;

          if (x > this.sizes.width / 2) {
            media.extra -= this.width;
          }
        }

        media.update(this.scroll.current);
      });

    this.group.position.y = y * this.sizes.height;
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
