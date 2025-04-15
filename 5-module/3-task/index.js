function initCarousel() {
  const carouselInner = document.querySelector('.carousel__inner');
  const arrowRight = document.querySelector('.carousel__arrow_right');
  const arrowLeft = document.querySelector('.carousel__arrow_left');
  
  let currentSlide = 0;
  const slidesCount = 4;
  const slideWidth = carouselInner.offsetWidth;
  
  arrowLeft.style.display = 'none';
  
  arrowRight.addEventListener('click', () => {
    currentSlide++;
    carouselInner.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    if (currentSlide === slidesCount - 1) {
      arrowRight.style.display = 'none';
    } else {
      arrowLeft.style.display = '';
    }
  });
  
  arrowLeft.addEventListener('click', () => {
    currentSlide--;
    carouselInner.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    

    if (currentSlide === 0) {
      arrowLeft.style.display = 'none';
    } else {
      arrowRight.style.display = '';
    }
  });
}
