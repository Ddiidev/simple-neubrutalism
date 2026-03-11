(function () {
  if (customElements.get('nb-select')) return;

  class NbSelect extends HTMLElement {
    static get observedAttributes() { return ['value', 'disabled', 'placeholder', 'name']; }

    constructor() {
      super();
      this.boundDocumentClick = this.handleDocumentClick.bind(this);
      this.options = [];
      this.isRendered = false;
    }

    connectedCallback() {
      if (!this.isRendered) {
        this.extractOptions();
        this.render();
        this.attachEvents();
        this.isRendered = true;
      }
      document.addEventListener('click', this.boundDocumentClick);
      this.updateDisplay();
    }

    disconnectedCallback() {
      document.removeEventListener('click', this.boundDocumentClick);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (this.isRendered) {
        if (name === 'name') {
          this.hiddenInput.name = newVal;
        } else {
          this.updateDisplay();
        }
      }
    }

    get value() {
      return this.getAttribute('value') || '';
    }

    set value(val) {
      this.setAttribute('value', val);
    }

    extractOptions() {
      this.options = Array.from(this.querySelectorAll('option')).map(opt => ({
        value: opt.hasAttribute('value') ? opt.getAttribute('value') : opt.textContent,
        label: opt.textContent
      }));
    }

    setOptions(htmlString) {
      var temp = document.createElement('div');
      temp.innerHTML = htmlString;
      this.options = Array.from(temp.querySelectorAll('option')).map(opt => ({
        value: opt.hasAttribute('value') ? opt.getAttribute('value') : opt.textContent,
        label: opt.textContent
      }));
      if (this.isRendered) {
        this.renderList();
        this.updateDisplay();
      }
    }

    render() {
      this.innerHTML = `
        <input type="hidden" class="nb-select-hidden">
        <div class="nb-select-shell">
          <button type="button" class="nb-select-button" aria-haspopup="listbox" aria-expanded="false">
            <span class="nb-select-value"></span>
            <span class="nb-select-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div class="nb-select-popover" role="listbox">
            <div class="nb-select-list"></div>
          </div>
        </div>
      `;
      this.hiddenInput = this.querySelector('.nb-select-hidden');
      if (this.hasAttribute('name')) {
        this.hiddenInput.name = this.getAttribute('name');
      }
      this.button = this.querySelector('.nb-select-button');
      this.valueDisplay = this.querySelector('.nb-select-value');
      this.popover = this.querySelector('.nb-select-popover');
      this.list = this.querySelector('.nb-select-list');
      
      this.renderList();
    }

    renderList() {
      this.list.innerHTML = this.options.map(opt => 
        '<button type="button" class="nb-select-option" data-value="' + opt.value + '" role="option">' + opt.label + '</button>'
      ).join('');
      
      this.list.querySelectorAll('.nb-select-option').forEach(btn => {
        btn.addEventListener('click', () => {
          this.value = btn.getAttribute('data-value');
          this.close();
          this.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    }

    attachEvents() {
      this.button.addEventListener('click', () => {
        if (this.hasAttribute('disabled')) return;
        this.toggle();
      });
    }

    updateDisplay() {
      if (this.hasAttribute('disabled')) {
        this.button.disabled = true;
      } else {
        this.button.disabled = false;
      }

      var val = this.value;
      var selectedOpt = this.options.find(o => o.value === val);
      
      if (selectedOpt) {
        this.valueDisplay.textContent = selectedOpt.label;
        this.hiddenInput.value = selectedOpt.value;
      } else if (this.hasAttribute('placeholder')) {
        this.valueDisplay.textContent = this.getAttribute('placeholder');
        this.hiddenInput.value = '';
      } else if (this.options.length > 0) {
        this.valueDisplay.textContent = this.options[0].label;
        if (!this.hasAttribute('value')) {
          this.value = this.options[0].value;
          this.setAttribute('value', this.options[0].value);
        }
        this.hiddenInput.value = this.options[0].value;
      } else {
        this.valueDisplay.textContent = '';
        this.hiddenInput.value = '';
      }

      this.list.querySelectorAll('.nb-select-option').forEach(btn => {
        if (btn.getAttribute('data-value') === this.value) {
          btn.classList.add('is-selected');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('is-selected');
          btn.setAttribute('aria-selected', 'false');
        }
      });
    }

    toggle() {
      if (this.hasAttribute('open')) this.close();
      else this.open();
    }

    open() {
      this.setAttribute('open', '');
      this.button.setAttribute('aria-expanded', 'true');
      var selected = this.list.querySelector('.is-selected');
      if (selected) {
        setTimeout(() => selected.scrollIntoView({ block: 'nearest' }), 0);
      }
    }

    close() {
      this.removeAttribute('open');
      this.button.setAttribute('aria-expanded', 'false');
    }

    handleDocumentClick(e) {
      if (!this.contains(e.target)) {
        this.close();
      }
    }
  }

  customElements.define('nb-select', NbSelect);
})();
