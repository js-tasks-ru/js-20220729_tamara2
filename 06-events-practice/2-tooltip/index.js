class Tooltip {
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip"></div>`;
    this.element = wrapper.firstElementChild;
  }

  initialize () {
    document.body.append(this.element);
    this.addEventListeners();
  }

  addEventListeners () {
    document.body.addEventListener('pointerover', this.onPointerOver);
    document.body.addEventListener('pointerout', this.onPointerOut);
  }

  removeEventListeners() {
    document.body.removeEventListener('pointerover', this.onPointerOver);
    document.body.removeEventListener('pointerout', this.onPointerOut);
  }

  onPointerOver = (event) => {
    const tooltip = event.target.dataset.tooltip;
    if (tooltip) {
      this.element.textContent = `${tooltip}`;
      this.initialize();
    }
  }

  onPointerOut = () => {
    if (this.element) {
      this.remove();
    }
  }

  render (tooltip) {
    this.element.textContent = `${tooltip}`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}

export default Tooltip;
