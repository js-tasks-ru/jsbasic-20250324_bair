import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.cartItems = [];
    this.modal = null;
    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) return;

    let cartItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (cartItem) {
      cartItem.count++;
    } else {
      cartItem = {
        product,
        count: 1
      };
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(item => item.product.id === productId);
    if (!cartItem) return;

    cartItem.count += amount;

    if (cartItem.count <= 0) {
      this.cartItems = this.cartItems.filter(item => item !== cartItem);
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.count,
      0
    );
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle("Your order");

    const cartItems = document.createElement('div');

    this.cartItems.forEach(({product, count}) => {
      cartItems.append(this.renderProduct(product, count));
    });

    cartItems.append(this.renderOrderForm());

    this.modal.setBody(cartItems);

    cartItems.addEventListener('click', (event) => {
      let button = event.target.closest('.cart-counter__button');
      if (!button) return;

      let productId = button.closest('[data-product-id]').dataset.productId;
      
      if (button.classList.contains('cart-counter__button_plus')) {
        this.updateProductCount(productId, 1);
      } else if (button.classList.contains('cart-counter__button_minus')) {
        this.updateProductCount(productId, -1);
      }
    });

    const form = cartItems.querySelector('.cart-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onSubmit(event);
    });

    this.modal.open();
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!document.body.classList.contains('is-modal-open')) {
      return;
    }

    if (this.isEmpty()) {
      this.modal.close();
      return;
    }

    const productId = cartItem.product.id;
    
    if (cartItem.count === 0) {
      const productElement = document.querySelector(`[data-product-id="${productId}"]`);
      if (productElement) {
        productElement.remove();
      }
      
      if (this.isEmpty()) {
        this.modal.close();
      }
      
      return;
    }

    const productCount = document.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    const productPrice = document.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    
    if (productCount) {
      productCount.textContent = cartItem.count;
    }
    
    if (productPrice) {
      productPrice.textContent = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
    }
    
    const infoPrice = document.querySelector(`.cart-buttons__info-price`);
    if (infoPrice) {
      infoPrice.textContent = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }

  async onSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('[type="submit"]');
    submitButton.classList.add('is-loading');

    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: new FormData(event.target)
      });

      if (response.ok) {
        this.modal.setTitle('Success!');
        this.cartItems = [];
        this.cartIcon.update(this);

        this.modal.setBody(createElement(`
          <div class="modal__inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We'll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
        `));
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      submitButton.classList.remove('is-loading');
    }
  }

 
  renderProduct(product, count) {
    return createElement(`
      <div class="cart-product" data-product-id="${product.id}">
        <div class="cart-product__img">
          <img src="/assets/images/products/${product.image}" alt="product">
        </div>
        <div class="cart-product__info">
          <div class="cart-product__title">${escapeHtml(product.name)}</div>
          <div class="cart-product__price-wrap">
            <div class="cart-counter">
              <button type="button" class="cart-counter__button cart-counter__button_minus">
                <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
              </button>
              <span class="cart-counter__count">${count}</span>
              <button type="button" class="cart-counter__button cart-counter__button_plus">
                <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
              </button>
            </div>
            <div class="cart-product__price">€${product.price.toFixed(2)}</div>
          </div>
        </div>
      </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}