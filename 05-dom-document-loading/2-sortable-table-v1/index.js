export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  getHeaderCell({id, title, sortable}) {
    return `
    <div class="sortable-table__cell" data-id=${id} data-sortable=${sortable}>
      <span>${title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    </div>
    `;
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map((item) => this.getHeaderCell(item)).join('')}
      </div>
    `;
  }

  getTableCell(value) {
    return `<div class="sortable-table__cell">${value}</div>`;
  }

  getRow(item) {
    const cells = this.headerConfig.map(({id, template}) => ({id, template}));
    return `
     <a href="/products/${item.id}" class="sortable-table__row">
       ${cells.map(({id, template}) => template ? template(item[id]) : this.getTableCell(item[id])).join('')}
    </a>
    `;
  }

  getRows(data = []) {
    return data.map(item => this.getRow(item));
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getRows(this.data)}
      </div>
    `;
  }

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        ${this.getHeader()}
        ${this.getBody()}
      </div>
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    </div>
    `;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);

    const currentColumn = this.element.querySelector(`[data-id=${field}]`);
    const columns = this.element.querySelectorAll('.sortable-table__cell');

    for (const column of columns) {
      column.dataset.order = '';
    }

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getRows(sortedData);
  }

  sortData(field, order) {
    const directions = {
      asc: 1,
      desc: -1
    };
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const direction = directions[order];

    return [...this.data].sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'});
      default:
        return direction * (a[field] - b[field]);
      }
    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

