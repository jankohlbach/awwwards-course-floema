/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Plane, Transform } from 'ogl';
import gsap from 'gsap';

import Media from './Media';

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.group = new Transform();

    this.galleryElement = document.querySelector('.home__gallery');
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image');

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.createGeometry();
    this.createGallery();

    this.onResize({
      sizes: this.sizes,
    });

    this.group.setParent(scene);

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      widthSegments: 20,
      heightSegments: 20,
    });
  }

  createGallery() {
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
    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.sizes = event.sizes;

    this.gallerySizes = {
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
      height: (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
    };

    this.scroll.x = 0;
    this.x.target = 0;
    this.scroll.y = 0;
    this.y.target = 0;

    Array.from(this.medias || [])
      .map((media) => media.onResize(event, this.scroll));
  }

  onTouchDown() {
    this.speed.target = 1;

    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;

    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp() {
    this.speed.target = 0;
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  update() {
    // const a = this.x.target - this.x.current;
    // const b = this.y.target - this.y.current;

    // this.speed.target = Math.sqrt(a * a + b * b) * 0.01;

    this.speed.current = gsap.utils
      .interpolate(this.speed.current, this.speed.target, this.speed.lerp);

    this.x.current = gsap.utils.interpolate(this.x.current, this.x.target, this.x.lerp);
    this.y.current = gsap.utils.interpolate(this.y.current, this.y.target, this.y.lerp);

    if (this.scroll.x < this.x.current) {
      this.x.direction = 'right';
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'left';
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top';
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom';
    }

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    Array.from(this.medias || [])
      // eslint-disable-next-line array-callback-return
      .map((media) => {
        const scaleX = media.mesh.scale.x / 2;
        const offsetX = this.sizes.width * 0.6;

        if (this.x.direction === 'left') {
          const x = media.mesh.position.x + scaleX;

          if (x < -offsetX) {
            media.extra.x += this.gallerySizes.width;
            media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
          }
        } else if (this.x.direction === 'right') {
          const x = media.mesh.position.x - scaleX;

          if (x > offsetX) {
            media.extra.x -= this.gallerySizes.width;
            media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
          }
        }

        const scaleY = media.mesh.scale.y / 2;
        const offsetY = this.sizes.height * 0.6;

        if (this.y.direction === 'top') {
          const y = media.mesh.position.y + scaleY;

          if (y < -offsetY) {
            media.extra.y += this.gallerySizes.height;
            media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
          }
        } else if (this.y.direction === 'bottom') {
          const y = media.mesh.position.y - scaleY;

          if (y > offsetY) {
            media.extra.y -= this.gallerySizes.height;
            media.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
          }
        }

        media.update(this.scroll, this.speed.current);
      });
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
