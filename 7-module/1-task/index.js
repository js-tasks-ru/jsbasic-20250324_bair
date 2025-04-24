import createElement from '../../assets/lib/create-element.js';


export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = document.createElement('div');
    this.elem.classList.add('ribbon');

  
    const leftArrow = document.createElement('button');
    leftArrow.classList.add('ribbon__arrow', 'ribbon__arrow_left');
    this.elem.append(leftArrow);


    const ribbonInner = document.createElement('nav');
    ribbonInner.classList.add('ribbon__inner');
    this.categories.forEach(category => {
      const categoryLink = document.createElement('a');
      categoryLink.href = '#';
      categoryLink.classList.add('ribbon__item');
      categoryLink.dataset.id = category.id;
      categoryLink.textContent = category.name;


      if (category.id === '') {
        categoryLink.classList.add('ribbon__item_active');
      }

      ribbonInner.append(categoryLink);
    });
    this.elem.append(ribbonInner);


    const rightArrow = document.createElement('button');
    rightArrow.classList.add('ribbon__arrow', 'ribbon__arrow_right', 'ribbon__arrow_visible');
    this.elem.append(rightArrow);


    this.leftArrow = leftArrow;
    this.rightArrow = rightArrow;
    this.ribbonInner = ribbonInner;
  }

  addEventListeners() {

    this.leftArrow.addEventListener('click', () => {
      this.ribbonInner.scrollBy(-350, 0);
    });


    this.rightArrow.addEventListener('click', () => {
      this.ribbonInner.scrollBy(350, 0);
    });

    this.ribbonInner.addEventListener('scroll', () => {
      const scrollLeft = this.ribbonInner.scrollLeft;
      const scrollWidth = this.ribbonInner.scrollWidth;
      const clientWidth = this.ribbonInner.clientWidth;
      const scrollRight = scrollWidth - scrollLeft - clientWidth;


      this.leftArrow.classList.toggle('ribbon__arrow_visible', scrollLeft > 0);


      this.rightArrow.classList.toggle('ribbon__arrow_visible', scrollRight > 1);
    });


    this.ribbonInner.addEventListener('click', event => {
      const target = event.target.closest('.ribbon__item');
      if (!target) return;

      event.preventDefault();

      const activeItem = this.ribbonInner.querySelector('.ribbon__item_active');
      if (activeItem) {
        activeItem.classList.remove('ribbon__item_active');
      }

      target.classList.add('ribbon__item_active');

      const categoryId = target.dataset.id;
      this.elem.dispatchEvent(
        new CustomEvent('ribbon-select', {
          detail: categoryId,
          bubbles: true
        })
      );
    });
  }
}