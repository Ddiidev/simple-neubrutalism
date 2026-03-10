(function () {
  if (customElements.get('nb-datetime')) {
    return;
  }

  var WEEKDAY_BASE_DATE = new Date(2024, 5, 2, 12, 0, 0, 0);

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function cloneDate(value) {
    return new Date(value.getTime());
  }

  function startOfMonth(value) {
    return new Date(value.getFullYear(), value.getMonth(), 1, 12, 0, 0, 0);
  }

  function startOfDay(value) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0, 0);
  }

  function sameDay(left, right) {
    return left &&
      right &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate();
  }

  function toDateOnlyValue(value) {
    return [
      value.getFullYear(),
      pad(value.getMonth() + 1),
      pad(value.getDate())
    ].join('-');
  }

  function parseValue(value, mode) {
    if (!value || typeof value !== 'string') {
      return null;
    }

    var match = mode === 'date'
      ? value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
      : value.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

    if (!match) {
      return null;
    }

    var year = parseInt(match[1], 10);
    var month = parseInt(match[2], 10) - 1;
    var day = parseInt(match[3], 10);
    var hour = mode === 'date' ? 12 : parseInt(match[4], 10);
    var minute = mode === 'date' ? 0 : parseInt(match[5], 10);

    var parsed = new Date(year, month, day, hour, minute, 0, 0);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    return parsed;
  }

  function formatForInput(value, mode) {
    if (!value) {
      return '';
    }

    if (mode === 'date') {
      return toDateOnlyValue(value);
    }

    return toDateOnlyValue(value) + 'T' + pad(value.getHours()) + ':' + pad(value.getMinutes());
  }

  function formatForDisplay(value, mode, locale) {
    if (!value) {
      return '';
    }

    var dateText = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(value);

    if (mode === 'date') {
      return dateText;
    }

    var timeText = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(value);

    return dateText + ' ' + timeText;
  }

  function formatMonthLabel(value, locale) {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(value);
  }

  function buildWeekdayLabels(locale) {
    var labels = [];

    for (var index = 0; index < 7; index += 1) {
      var day = new Date(WEEKDAY_BASE_DATE);
      day.setDate(WEEKDAY_BASE_DATE.getDate() + index);
      labels.push(new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(day));
    }

    return labels;
  }

  function clampDate(value, minValue, maxValue) {
    if (!value) {
      return null;
    }

    if (minValue && value.getTime() < minValue.getTime()) {
      return cloneDate(minValue);
    }

    if (maxValue && value.getTime() > maxValue.getTime()) {
      return cloneDate(maxValue);
    }

    return value;
  }

  class NbDatetime extends HTMLElement {
    static get observedAttributes() {
      return ['value', 'mode', 'placeholder', 'name', 'min', 'max', 'required', 'disabled', 'locale', 'step'];
    }

    constructor() {
      super();
      this.state = {
        selected: null,
        view: startOfMonth(new Date())
      };
      this.boundDocumentClick = this.handleDocumentClick.bind(this);
      this.boundDocumentKeydown = this.handleDocumentKeydown.bind(this);
      this.isRendered = false;
      this.documentListenersAttached = false;
    }

    connectedCallback() {
      if (!this.isRendered) {
        this.render();
        this.attachEvents();
        this.isRendered = true;
      }

      if (!this.documentListenersAttached) {
        document.addEventListener('click', this.boundDocumentClick);
        document.addEventListener('keydown', this.boundDocumentKeydown);
        this.documentListenersAttached = true;
      }

      this.syncFromAttributes();
    }

    disconnectedCallback() {
      if (this.documentListenersAttached) {
        document.removeEventListener('click', this.boundDocumentClick);
        document.removeEventListener('keydown', this.boundDocumentKeydown);
        this.documentListenersAttached = false;
      }
    }

    attributeChangedCallback() {
      if (this.isRendered) {
        this.syncFromAttributes();
      }
    }

    get mode() {
      return this.getAttribute('mode') === 'date' ? 'date' : 'datetime';
    }

    get locale() {
      return this.getAttribute('locale') || navigator.language || document.documentElement.lang || 'en-US';
    }

    get labels() {
      var isPt = this.locale.toLowerCase().indexOf('pt') === 0;

      return isPt
        ? {
            clear: 'Limpar',
            today: 'Hoje',
            selectDate: 'Selecione a data',
            selectDateTime: 'Selecione data e hora'
          }
        : {
            clear: 'Clear',
            today: 'Today',
            selectDate: 'Select date',
            selectDateTime: 'Select date and time'
          };
    }

    get minDate() {
      return parseValue(this.getAttribute('min'), this.mode);
    }

    get maxDate() {
      return parseValue(this.getAttribute('max'), this.mode);
    }

    get minuteStep() {
      var raw = parseInt(this.getAttribute('step'), 10);
      if (Number.isNaN(raw)) {
        return 1;
      }

      return Math.max(1, Math.min(30, raw));
    }

    render() {
      this.innerHTML = `
        <div class="nb-datetime-shell">
          <div class="nb-datetime-control">
            <input class="nb-datetime-display" type="text" readonly>
            <button class="nb-datetime-toggle" type="button" aria-label="Toggle calendar"></button>
          </div>
          <input class="nb-datetime-hidden" type="hidden">
          <div class="nb-datetime-popover" role="dialog" aria-modal="false">
            <div class="nb-datetime-header">
              <button class="nb-datetime-nav" type="button" data-nav="-1" aria-label="Previous month"><span aria-hidden="true">&lt;</span></button>
              <div class="nb-datetime-title"></div>
              <button class="nb-datetime-nav" type="button" data-nav="1" aria-label="Next month"><span aria-hidden="true">&gt;</span></button>
            </div>
            <div class="nb-datetime-weekdays"></div>
            <div class="nb-datetime-grid"></div>
            <div class="nb-datetime-time">
              <select class="nb-datetime-hour" aria-label="Hour">${this.renderOptions(24, 1)}</select>
              <span class="nb-datetime-time-divider">:</span>
              <select class="nb-datetime-minute" aria-label="Minute">${this.renderOptions(60, this.minuteStep)}</select>
            </div>
            <div class="nb-datetime-actions">
              <button class="nb-datetime-action" type="button" data-action="clear"></button>
              <button class="nb-datetime-action" type="button" data-action="today"></button>
            </div>
          </div>
        </div>
      `;

      this.displayInput = this.querySelector('.nb-datetime-display');
      this.toggleButton = this.querySelector('.nb-datetime-toggle');
      this.hiddenInput = this.querySelector('.nb-datetime-hidden');
      this.popoverPanel = this.querySelector('.nb-datetime-popover');
      this.titleElement = this.querySelector('.nb-datetime-title');
      this.weekdayRow = this.querySelector('.nb-datetime-weekdays');
      this.dayGrid = this.querySelector('.nb-datetime-grid');
      this.timePanel = this.querySelector('.nb-datetime-time');
      this.hourSelect = this.querySelector('.nb-datetime-hour');
      this.minuteSelect = this.querySelector('.nb-datetime-minute');
      this.clearButton = this.querySelector('[data-action="clear"]');
      this.todayButton = this.querySelector('[data-action="today"]');
      this.displayInput.setAttribute('aria-haspopup', 'dialog');
    }

    attachEvents() {
      this.displayInput.addEventListener('click', () => this.open());
      this.displayInput.addEventListener('focus', () => this.open());
      this.toggleButton.addEventListener('click', () => this.toggleOpen());

      this.querySelectorAll('[data-nav]').forEach((button) => {
        button.addEventListener('click', () => {
          var delta = parseInt(button.getAttribute('data-nav'), 10);
          this.state.view = new Date(this.state.view.getFullYear(), this.state.view.getMonth() + delta, 1, 12, 0, 0, 0);
          this.renderCalendar();
        });
      });

      this.dayGrid.addEventListener('click', (event) => {
        var button = event.target.closest('.nb-datetime-day');
        if (!button || button.disabled) {
          return;
        }

        var nextDate = parseValue(button.getAttribute('data-day'), 'date');
        if (!nextDate) {
          return;
        }

        this.applySelectedDay(nextDate);
      });

      this.hourSelect.addEventListener('change', () => this.applySelectedTime());
      this.minuteSelect.addEventListener('change', () => this.applySelectedTime());
      this.clearButton.addEventListener('click', () => this.clearValue());
      this.todayButton.addEventListener('click', () => this.selectToday());
    }

    renderOptions(total, step) {
      var output = '';

      for (var value = 0; value < total; value += step) {
        output += '<option value="' + pad(value) + '">' + pad(value) + '</option>';
      }

      return output;
    }

    syncFromAttributes() {
      var parsed = parseValue(this.getAttribute('value'), this.mode);
      this.state.selected = parsed ? clampDate(parsed, this.minDate, this.maxDate) : null;
      this.state.view = startOfMonth(this.state.selected || this.state.view || new Date());

      this.displayInput.placeholder = this.getAttribute('placeholder') || (
        this.mode === 'date' ? this.labels.selectDate : this.labels.selectDateTime
      );
      this.displayInput.value = formatForDisplay(this.state.selected, this.mode, this.locale);
      this.displayInput.required = this.hasAttribute('required');
      this.displayInput.disabled = this.hasAttribute('disabled');
      this.displayInput.setAttribute('aria-expanded', this.hasAttribute('open') ? 'true' : 'false');

      if (this.hasAttribute('name')) {
        this.hiddenInput.setAttribute('name', this.getAttribute('name'));
      } else {
        this.hiddenInput.removeAttribute('name');
      }

      this.hiddenInput.value = formatForInput(this.state.selected, this.mode);

      var disabled = this.hasAttribute('disabled');
      this.toggleButton.disabled = disabled;
      this.hourSelect.disabled = disabled;
      this.minuteSelect.disabled = disabled;
      this.clearButton.disabled = disabled;
      this.todayButton.disabled = disabled;

      if (this.mode === 'date') {
        this.timePanel.classList.add('nb-datetime-hidden');
      } else {
        this.timePanel.classList.remove('nb-datetime-hidden');
      }

      if (this.minuteSelect.children.length !== Math.ceil(60 / this.minuteStep)) {
        this.minuteSelect.innerHTML = this.renderOptions(60, this.minuteStep);
      }

      this.clearButton.textContent = this.labels.clear;
      this.todayButton.textContent = this.labels.today;
      this.syncTimeControls();
      this.renderWeekdays();
      this.renderCalendar();
    }

    renderWeekdays() {
      var labels = buildWeekdayLabels(this.locale);
      this.weekdayRow.innerHTML = labels
        .map((label) => '<span class="nb-datetime-weekday">' + label + '</span>')
        .join('');
    }

    renderCalendar() {
      this.titleElement.textContent = formatMonthLabel(this.state.view, this.locale);

      var firstDay = startOfMonth(this.state.view);
      var gridStart = cloneDate(firstDay);
      gridStart.setDate(firstDay.getDate() - firstDay.getDay());

      var selectedDate = this.state.selected ? startOfDay(this.state.selected) : null;
      var today = startOfDay(new Date());
      var minDate = this.minDate ? startOfDay(this.minDate) : null;
      var maxDate = this.maxDate ? startOfDay(this.maxDate) : null;
      var output = '';

      for (var index = 0; index < 42; index += 1) {
        var current = cloneDate(gridStart);
        current.setDate(gridStart.getDate() + index);

        var classes = ['nb-datetime-day'];
        if (current.getMonth() !== this.state.view.getMonth()) {
          classes.push('is-outside');
        }
        if (sameDay(current, today)) {
          classes.push('is-today');
        }
        if (selectedDate && sameDay(current, selectedDate)) {
          classes.push('is-selected');
        }

        var isDisabled = (
          (minDate && current.getTime() < minDate.getTime()) ||
          (maxDate && current.getTime() > maxDate.getTime()) ||
          this.hasAttribute('disabled')
        );

        output += '<button class="' + classes.join(' ') + '" type="button" data-day="' + toDateOnlyValue(current) + '"' +
          (isDisabled ? ' disabled' : '') + '>' + current.getDate() + '</button>';
      }

      this.dayGrid.innerHTML = output;
    }

    syncTimeControls() {
      var base = this.state.selected || new Date();
      var hourValue = pad(base.getHours());
      var minuteValue = pad(base.getMinutes());

      if (!this.minuteSelect.querySelector('option[value="' + minuteValue + '"]')) {
        this.minuteSelect.innerHTML += '<option value="' + minuteValue + '">' + minuteValue + '</option>';
      }

      this.hourSelect.value = hourValue;
      this.minuteSelect.value = minuteValue;
    }

    applySelectedDay(nextDate) {
      var base = this.state.selected ? cloneDate(this.state.selected) : new Date();
      base.setFullYear(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());

      if (this.mode === 'date') {
        base.setHours(12, 0, 0, 0);
      } else {
        base.setHours(parseInt(this.hourSelect.value, 10), parseInt(this.minuteSelect.value, 10), 0, 0);
      }

      this.commitValue(clampDate(base, this.minDate, this.maxDate), true);

      if (this.mode === 'date') {
        this.close();
      }
    }

    applySelectedTime() {
      if (this.mode === 'date') {
        return;
      }

      var base = this.state.selected ? cloneDate(this.state.selected) : new Date();
      base.setHours(parseInt(this.hourSelect.value, 10), parseInt(this.minuteSelect.value, 10), 0, 0);
      this.commitValue(clampDate(base, this.minDate, this.maxDate), true);
    }

    clearValue() {
      this.commitValue(null, true);
      this.close();
    }

    selectToday() {
      var now = new Date();
      var nextValue = this.mode === 'date'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0)
        : new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);

      this.commitValue(clampDate(nextValue, this.minDate, this.maxDate), true);

      if (this.mode === 'date') {
        this.close();
      }
    }

    commitValue(nextValue, emitEvents) {
      this.state.selected = nextValue;
      this.state.view = startOfMonth(nextValue || new Date());

      var serialised = formatForInput(nextValue, this.mode);
      if (serialised) {
        this.setAttribute('value', serialised);
      } else {
        this.removeAttribute('value');
      }

      this.hiddenInput.value = serialised;
      this.displayInput.value = formatForDisplay(nextValue, this.mode, this.locale);
      this.syncTimeControls();
      this.renderCalendar();

      if (emitEvents) {
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    toggleOpen() {
      if (this.hasAttribute('disabled')) {
        return;
      }

      if (this.hasAttribute('open')) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.setAttribute('open', '');
      this.displayInput.setAttribute('aria-expanded', 'true');
      this.state.view = startOfMonth(this.state.selected || new Date());
      this.renderCalendar();
    }

    close() {
      this.removeAttribute('open');
      this.displayInput.setAttribute('aria-expanded', 'false');
    }

    handleDocumentClick(event) {
      if (!this.contains(event.target)) {
        this.close();
      }
    }

    handleDocumentKeydown(event) {
      if (event.key === 'Escape' && this.hasAttribute('open')) {
        this.close();
      }
    }
  }

  customElements.define('nb-datetime', NbDatetime);
})();
