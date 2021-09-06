/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Plane, Transform } from 'ogl';

import Gallery from './Gallery';

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;

    this.group = new Transform();

    this.createGeometry();
    this.createGalleries();

    this.onResize({
      sizes: this.sizes,
    });

    this.group.setParent(scene);

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGalleries() {
    this.galleriesElements = document.querySelectorAll('.about__gallery');

    this.galleries = Array.from(this.galleriesElements || [])
      .map((element, index) => new Gallery({
        element,
        index,
        geometry: this.geometry,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      }));
  }

  show() {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.show());
  }

  hide() {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.hide());
  }

  onResize(event) {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.onResize(event));
  }

  onTouchDown(event) {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.onTouchDown(event));
  }

  onTouchMove(event) {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.onTouchMove(event));
  }

  onTouchUp(event) {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.onTouchUp(event));
  }

  // eslint-disable-next-line
  onWheel({ pixelX, pixelY }) {

  }

  update(scroll) {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.update(scroll));
  }

  destroy() {
    Array.from(this.galleries || [])
      .map((gallery) => gallery.destroy());
  }
}
