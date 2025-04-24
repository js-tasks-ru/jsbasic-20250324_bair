export default class StepSlider {
  constructor(config) {
    this.config = config;
    this.steps = config.steps;
    this.value = config.value || 0;


    this.elem = document.createElement('div');
    this.elem.classList.add('slider');


    this.render();
    this.update();


    this.elem.addEventListener('click', this.onClick.bind(this));
  }

  render() {

    this.elem.innerHTML = `
      <div class="slider__thumb">
        <span class="slider__value">0</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps"></div>
    `;

    const stepsContainer = this.elem.querySelector('.slider__steps');
    for (let i = 0; i < this.steps; i++) {
      const step = document.createElement('span');
      stepsContainer.appendChild(step);
    }
  }

  update() {
    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');
    const valueElement = this.elem.querySelector('.slider__value');
    const stepsContainer = this.elem.querySelector('.slider__steps');
    const segments = this.steps - 1;

    valueElement.textContent = this.value;


    const valuePercents = (this.value / segments) * 100;

    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;


    Array.from(stepsContainer.children).forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }

  onClick(event) {
    const sliderRect = this.elem.getBoundingClientRect();
    const left = event.clientX - sliderRect.left;
    const leftRelative = left / this.elem.offsetWidth;

    const segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    this.value = Math.round(approximateValue);

    this.update();


    this.elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true,
      })
    );
  }
}