import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.render();
  }

  render() {
    this.elem = document.createElement('div');
    this.elem.className = 'products-grid';
    
    this.gridInner = document.createElement('div');
    this.gridInner.className = 'products-grid__inner';
    this.elem.appendChild(this.gridInner);

    this.renderProducts(this.products);
  }

  renderProducts(products) {
    this.gridInner.innerHTML = '';
    
    for (let product of products) {
      const productCard = new ProductCard(product);
      this.gridInner.appendChild(productCard.elem);
    }
  }

  updateFilter(filters) {

    this.filters = { ...this.filters, ...filters };
    
    const filteredProducts = this.products.filter(product => {

      if (this.filters.noNuts === true) {
        if (product.nuts === true) return false;
      }
      
      if (this.filters.vegeterianOnly === true) {
        if (product.vegeterian !== true) return false;
      }

      if (this.filters.maxSpiciness !== undefined) {
        if (product.spiciness === undefined || product.spiciness > this.filters.maxSpiciness) {
          return false;
        }
      }
      
      if (this.filters.category && this.filters.category !== '') {
        if (product.category !== this.filters.category) return false;
      }
      
      return true;
    });
    
    this.renderProducts(filteredProducts);
  }
}


