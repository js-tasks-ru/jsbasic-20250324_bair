export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    let cartItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (!cartItem) {
      cartItem = {
        product,
        count: 1
      };
      this.cartItems.push(cartItem);
    } else {
      cartItem.count++;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(item => item.product.id === productId);
    
    if (cartItem) {
      cartItem.count += amount;
      
      if (cartItem.count <= 0) {
        const index = this.cartItems.indexOf(cartItem);
        this.cartItems.splice(index, 1);
      }
      
      this.onProductUpdate(cartItem);
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.count), 0);
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
    const modalBody = this.modal.elem.querySelector('.modal__body');

    const productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    if (productCount) {
      productCount.textContent = cartItem.count;
    }

    const productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    if (productPrice) {
      productPrice.textContent = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
    }

    const infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);
    if (infoPrice) {
      infoPrice.textContent = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }
}

