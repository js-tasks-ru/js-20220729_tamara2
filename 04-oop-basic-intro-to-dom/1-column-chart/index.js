export default class ColumnChart {

  constructor({data, label, value, link, formatHeading} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
    this.render();
  }

  get isDataEmpty() {
    return !this.data || !this.data.length;
  }

  get columnProps() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  renderChartValue(value, percent) {
    return `
      <div style="--value: ${value}" data-tooltip="${percent}"></div>
    `;
  }

  destroy() {
    this.element = null;
  }

  renderSkeleton() {
    return `<img alt='skeleton' src="./charts-skeleton.svg"/>`;
  }

  renderLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add("column-chart");
    if (this.isDataEmpty) {
      wrapper.classList.add("column-chart_loading");
    }
    wrapper.style['--chart-height'] = this.chartHeight;
    wrapper.innerHTML = `
          <div class="column-chart__title">
            ${this.label || ''}
            ${this.renderLink()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
              ${this.formatHeading ? this.formatHeading(this.value) : this.value}
            </div>
            <div data-element="body" class="column-chart__chart">
              ${this.isDataEmpty ? this.renderSkeleton() : this.columnProps.map(({value, percent}) => this.renderChartValue(value, percent)).join('')}
            </div>
          </div>
    `;

    this.element = wrapper;
  }

  update(data) {
    this.data = data;
  }

  remove() {
    this.element.remove();
  }
}
