import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {

    this.modal = document.createElement('div');
    this.modal.classList.add('modal');

    this.modal.innerHTML = `
      <div class="modal__overlay">
        <div class="modal__window">
          <div class="modal__header">
            <span class="modal__title">Заголовок</span>
            <button class="modal__close">&times;</button>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `;


    this.titleElement = this.modal.querySelector('.modal__title');
    this.bodyElement = this.modal.querySelector('.modal__body');
    this.closeButton = this.modal.querySelector('.modal__close');


    this.closeButton.addEventListener('click', () => this.close());
  }

  open() {
    if (document.body.contains(this.modal)) return; 

    document.body.appendChild(this.modal);
    document.body.classList.add('is-modal-open');


    this.keydownHandler = (event) => {
      if (event.code === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  close() {
    if (!document.body.contains(this.modal)) return; 

    document.body.removeChild(this.modal);
    document.body.classList.remove('is-modal-open');


    document.removeEventListener('keydown', this.keydownHandler);
  }

  setTitle(title) {
    this.titleElement.textContent = title;
  }


  setBody(node) {
    this.bodyElement.innerHTML = ''; 
    this.bodyElement.appendChild(node);
  }
}