export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.render();
    const {id, order} = this.sorted;
    if (id && order) {
      this.sort(this.sorted.id, this.sorted.order);
    }
  }

  getHeaderCell({id, title, sortable, order = 'asc'}) {
    return `
    <div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${order}>
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
        ${this.headersConfig.map((item) => this.getHeaderCell(item)).join('')}
      </div>
    `;
  }

  getTableCell(value) {
    return `<div class="sortable-table__cell">${value}</div>`;
  }

  getRow(item) {
    const cells = this.headersConfig.map(({id, template}) => ({id, template}));
    return `
     <a href="/products/${item.id}" class="sortable-table__row">
       ${cells.map(({id, template}) => template ? template(item[id]) : this.getTableCell(item[id])).join('')}
    </a>
    `;
  }

  getRows(data = []) {
    return data.map(item => this.getRow(item)).join('');
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

  getSortOrder(order) {
    switch (order) {
    case 'asc':
      return 'desc';
    case 'desc':
      return 'asc';
    }
  }

  addEventListener = (event) => {
    const cell = event.target.closest('.sortable-table__cell');
    const order = cell.dataset.order ? this.getSortOrder(cell.dataset.order) : 'asc';
    this.sort(cell.dataset.id, order);
  }

  getHeaderCells() {
    if (this.subElements.header) {
      return this.subElements.header.querySelectorAll('.sortable-table__cell[data-sortable="true"]')
    }
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();

    const elements = this.getHeaderCells();
    elements.forEach(item => item.addEventListener('pointerdown', this.addEventListener));
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
    const column = this.headersConfig.find(item => item.id === field);
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
    const elements = this.getHeaderCells();
    if (elements) {
      elements.forEach(item => item.removeEventListener('pointerdown', this.addEventListener));
    }
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
