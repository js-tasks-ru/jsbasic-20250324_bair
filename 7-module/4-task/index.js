export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = document.createElement('div');
    this.elem.className = 'slider';

    let stepsHtml = '';
    for (let i = 0; i < this.steps; i++) {
      stepsHtml += '<span></span>';
    }

    this.elem.innerHTML = `
      <div class="slider__thumb">
        <span class="slider__value">${this.value}</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps">${stepsHtml}</div>
    `;

    this.updateSlider();
  }

  addEventListeners() {
    this.elem.addEventListener('click', this.onClick.bind(this));

    const thumb = this.elem.querySelector('.slider__thumb');
    thumb.ondragstart = () => false;
    thumb.addEventListener('pointerdown', this.onPointerDown.bind(this));
  }

  onClick(event) {
    const left = event.clientX - this.elem.getBoundingClientRect().left;
    const leftRelative = left / this.elem.offsetWidth;
    const segments = this.steps - 1;
    const approximateValue = leftRelative * segments;
    const value = Math.round(approximateValue);

    if (this.value !== value) {
      this.value = value;
      this.updateSlider();
      this.emitChangeEvent();
    }
  }

  onPointerDown(event) {
    event.preventDefault();
    this.elem.classList.add('slider_dragging');

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp.bind(this), { once: true });
  }

  onPointerMove = (event) => {
    event.preventDefault();

    const left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    } else if (leftRelative > 1) {
      leftRelative = 1;
    }

    const leftPercents = leftRelative * 100;
    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');

    thumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;

    const segments = this.steps - 1;
    const approximateValue = leftRelative * segments;
    const value = Math.round(approximateValue);

    if (this.value !== value) {
      this.value = value;
      this.updateValueDisplay();
    }
  };

  onPointerUp() {
    document.removeEventListener('pointermove', this.onPointerMove);
    this.elem.classList.remove('slider_dragging');

    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');

    const segments = this.steps - 1;
    const leftPercents = (this.value / segments) * 100;

    thumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;

    this.emitChangeEvent();
  }

  updateSlider() {
    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');
    const valueDisplay = this.elem.querySelector('.slider__value');
    const steps = this.elem.querySelector('.slider__steps');

    const segments = this.steps - 1;
    const leftPercents = (this.value / segments) * 100;

    thumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;
    valueDisplay.textContent = this.value;

    Array.from(steps.children).forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }

  updateValueDisplay() {
    const valueDisplay = this.elem.querySelector('.slider__value');
    const steps = this.elem.querySelector('.slider__steps');

    valueDisplay.textContent = this.value;
    Array.from(steps.children).forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }

  emitChangeEvent() {
    this.elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true
      })
    );
  }
}