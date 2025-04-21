import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.currentSlideIndex = 0;

    this.render();
    this.initEventListeners();
  }

  render() {
    this.elem = createElement(`
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>

        <div class="carousel__inner">
          ${this.slides.map(slide => this.createSlideHTML(slide)).join('')}
        </div>
      </div>
    `);

    this.carouselInner = this.elem.querySelector('.carousel__inner');
    this.arrowLeft = this.elem.querySelector('.carousel__arrow_left');
    this.arrowRight = this.elem.querySelector('.carousel__arrow_right');

    this.updateArrowVisibility();
  }

  createSlideHTML(slide) {
    const formattedPrice = `€${slide.price.toFixed(2)}`;
    const imagePath = `/assets/images/carousel/${slide.image}`;

    return `
      <div class="carousel__slide" data-id="${slide.id}">
        <img src="${imagePath}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">${formattedPrice}</span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
  }

  initEventListeners() {
    this.arrowRight.addEventListener('click', () => this.nextSlide());
    this.arrowLeft.addEventListener('click', () => this.prevSlide());

    this.elem.addEventListener('click', (event) => {
      const button = event.target.closest('.carousel__button');
      if (button) {
        const slideElement = button.closest('.carousel__slide');
        const slideId = slideElement.dataset.id;
        this.dispatchEvent(slideId);
      }
    });
  }

  nextSlide() {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
      this.updateCarouselPosition();
      this.updateArrowVisibility();
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.updateCarouselPosition();
      this.updateArrowVisibility();
    }
  }

  updateCarouselPosition() {
    const slideWidth = this.carouselInner.querySelector('.carousel__slide').offsetWidth;
    this.carouselInner.style.transform = `translateX(-${this.currentSlideIndex * slideWidth}px)`;
  }

  updateArrowVisibility() {
    this.arrowLeft.style.display = this.currentSlideIndex === 0 ? 'none' : '';
    this.arrowRight.style.display = this.currentSlideIndex === this.slides.length - 1 ? 'none' : '';
  }


  dispatchEvent(slideId) {
    const event = new CustomEvent('product-add', {
      detail: slideId,
      bubbles: true,
    });
    this.elem.dispatchEvent(event);
  }
}