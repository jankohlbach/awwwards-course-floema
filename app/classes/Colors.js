import gsap from 'gsap';

class Colors {
  // eslint-disable-next-line class-methods-use-this
  change({ backgroundColor, color }) {
    gsap.to(
      document.documentElement,
      { background: backgroundColor, color, duration: 1.5 },
    );
  }
}

// eslint-disable-next-line import/prefer-default-export
export const ColorsManager = new Colors();
