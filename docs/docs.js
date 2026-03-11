/* ===== DOCS.JS ===== */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileSidebar();
  initScrollSpy();
  initCodeTabs();
  initCopyButtons();
  initPlaygrounds();
  initDemoModal();
  initColorMenu();
  lucide.createIcons();
});

/* ===== DARK MODE ===== */
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  if (localStorage.getItem('nbtl-dark-mode') === 'true') {
    document.documentElement.classList.add('dark-mode');
  }
  updateDarkModeIcon();
  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('nbtl-dark-mode', document.documentElement.classList.contains('dark-mode'));
    updateDarkModeIcon();
  });
}

function updateDarkModeIcon() {
  const toggle = document.getElementById('dark-mode-toggle');
  const isDark = document.documentElement.classList.contains('dark-mode');
  toggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  lucide.createIcons({ nodes: [toggle] });
}

/* ===== MOBILE SIDEBAR ===== */
function initMobileSidebar() {
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });
  document.querySelector('.docs-overlay').addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });
  document.querySelectorAll('.docs-sidebar .nav-item').forEach(link => {
    link.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
  });
}

/* ===== SCROLL SPY ===== */
function initScrollSpy() {
  const sections = document.querySelectorAll('.docs-section');
  const navItems = document.querySelectorAll('.docs-sidebar .nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(item.getAttribute('href').substring(1));
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        history.replaceState(null, null, item.getAttribute('href'));
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  if (window.location.hash) {
    const t = document.querySelector(window.location.hash);
    if (t) setTimeout(() => window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }), 100);
  }
}

/* ===== CODE TABS ===== */
function initCodeTabs() {
  document.querySelectorAll('.code-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const group = e.currentTarget.closest('.code-tabs');
      const target = e.currentTarget.getAttribute('data-tab');
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelector('#' + target).classList.add('active');
      e.currentTarget.classList.add('active');
    });
  });
}

/* ===== COPY ===== */
function initCopyButtons() {
  document.querySelectorAll('.code-box .copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-box').querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Copied';
        lucide.createIcons({ nodes: [btn] });
        setTimeout(() => { btn.innerHTML = orig; lucide.createIcons({ nodes: [btn] }); }, 1500);
      });
    });
  });
}

/* ===== DEMO MODAL ===== */
function initDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.removeAttribute('open');
  });
}

/* ===== COLOR MENU ===== */
function initColorMenu() {
  const toggle = document.querySelector('.color-toggle');
  const panel = document.querySelector('.color-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => panel.classList.toggle('open'));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.docs-color-menu')) panel.classList.remove('open');
  });

  // Color inputs
  panel.querySelectorAll('input[type="color"]').forEach(input => {
    input.addEventListener('input', () => {
      document.documentElement.style.setProperty(input.getAttribute('data-var'), input.value);
    });
  });

  // Presets
  panel.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = colorPresets[btn.getAttribute('data-preset')];
      if (!preset) return;
      Object.entries(preset).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v);
        const input = panel.querySelector(`input[data-var="${k}"]`);
        if (input) input.value = v;
      });
    });
  });
}

const colorPresets = {
  default: {
    '--primary-color': '#FFD93D',
    '--secondary-color': '#FFB200',
    '--background-color': '#FFF8E3',
    '--border-color': '#4C3D3D',
    '--font-color': '#4C3D3D',
    '--none-color': '#E6DDC4',
  },
  ocean: {
    '--primary-color': '#74C0FC',
    '--secondary-color': '#339AF0',
    '--background-color': '#E7F5FF',
    '--border-color': '#1C3A5A',
    '--font-color': '#1C3A5A',
    '--none-color': '#C5E4F9',
  },
  forest: {
    '--primary-color': '#8CE99A',
    '--secondary-color': '#51CF66',
    '--background-color': '#EBFBEE',
    '--border-color': '#2B4C33',
    '--font-color': '#2B4C33',
    '--none-color': '#C3E6C9',
  },
  rose: {
    '--primary-color': '#FFA8C5',
    '--secondary-color': '#F06595',
    '--background-color': '#FFF0F6',
    '--border-color': '#5C2038',
    '--font-color': '#5C2038',
    '--none-color': '#F2D0DE',
  },
  lavender: {
    '--primary-color': '#D0BFFF',
    '--secondary-color': '#9775FA',
    '--background-color': '#F3F0FF',
    '--border-color': '#3B2D66',
    '--font-color': '#3B2D66',
    '--none-color': '#D8D0ED',
  },
  sunset: {
    '--primary-color': '#FFA94D',
    '--secondary-color': '#FF6B6B',
    '--background-color': '#FFF4E6',
    '--border-color': '#5C2D0E',
    '--font-color': '#5C2D0E',
    '--none-color': '#F0DCC9',
  },
};

/* ===== PLAYGROUND ENGINE ===== */
function initPlaygrounds() {
  document.querySelectorAll('[data-playground]').forEach(pg => {
    const id = pg.getAttribute('data-playground');
    const config = playgroundConfigs[id];
    if (!config) return;

    const controls = pg.querySelector('.pg-controls');
    const result = pg.querySelector('.pg-result');
    const codeEl = pg.querySelector('.pg-code code');
    if (!controls || !result) return;

    config.controls.forEach(ctrl => {
      const div = document.createElement('div');
      if (ctrl.type === 'checkbox') {
        div.className = 'ctrl ctrl-check';
        div.innerHTML = `<input type="checkbox" id="c-${id}-${ctrl.name}" data-ctrl="${ctrl.name}" ${ctrl.default ? 'checked' : ''}>
          <label for="c-${id}-${ctrl.name}">${ctrl.label}</label>`;
      } else if (ctrl.type === 'select') {
        div.className = 'ctrl';
        const opts = ctrl.options.map(o => `<option value="${o.value}" ${o.value === (ctrl.default || '') ? 'selected' : ''}>${o.label}</option>`).join('');
        div.innerHTML = `<span class="ctrl-label">${ctrl.label}</span><select data-ctrl="${ctrl.name}">${opts}</select>`;
      } else {
        div.className = 'ctrl';
        div.innerHTML = `<span class="ctrl-label">${ctrl.label}</span><input type="${ctrl.type}" value="${ctrl.default || ''}" data-ctrl="${ctrl.name}">`;
      }
      controls.appendChild(div);
    });

    const update = () => {
      const vals = {};
      controls.querySelectorAll('[data-ctrl]').forEach(el => {
        vals[el.getAttribute('data-ctrl')] = el.type === 'checkbox' ? el.checked : el.value;
      });
      const out = config.render(vals);
      result.innerHTML = out.html;
      if (codeEl) {
        codeEl.textContent = out.code;
        highlightCode(codeEl);
      }
    };

    controls.addEventListener('input', update);
    controls.addEventListener('change', update);
    update();
  });
}

/* ===== SYNTAX HIGHLIGHT (simple) ===== */
function highlightCode(el) {
  const lang = el.className.includes('lang-js') ? 'js' : 'html';
  const raw = el.textContent;
  el.innerHTML = lang === 'js' ? highlightJS(raw) : highlightHTML(raw);
}

function highlightHTML(code) {
  code = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  code = code.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>');
  code = code.replace(/(&lt;\/?)([\w-]+)([\s\S]*?)(&gt;)/g, function(m, open, tag, attrs, close) {
    var result = open + '<span class="hl-tag">' + tag + '</span>';
    if (attrs) {
      result += attrs.replace(/([\w-]+)="([^"]*)"/g,
        '<span class="hl-attr">$1</span>=<span class="hl-str">"$2"</span>');
    }
    return result + close;
  });
  return code;
}

function highlightJS(code) {
  var tokens = [];
  function token(cls, text) {
    tokens.push('<span class="hl-' + cls + '">' + text + '</span>');
    return '{{HL' + (tokens.length - 1) + '}}';
  }
  code = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  code = code.replace(/(\/\/.*)/g, function(m) { return token('comment', m); });
  code = code.replace(/('([^']*)'|"([^"]*)")/g, function(m) { return token('str', m); });
  code = code.replace(/\b(const|let|var|function|if|else|return|new|this|true|false|null|undefined|for|of|in|class|import|export|default|async|await)\b/g, function(m) { return token('kw', m); });
  code = code.replace(/\b(\d+)\b/g, function(m) { return token('num', m); });
  code = code.replace(/\b([a-zA-Z_]\w*)\s*\(/g, function(m, name) { return token('func', name) + '('; });
  code = code.replace(/\{\{HL(\d+)\}\}/g, function(m, idx) { return tokens[idx]; });
  return code;
}

function highlightAllCode() {
  document.querySelectorAll('.code-box code').forEach(el => highlightCode(el));
}

// Run highlight after DOM ready
document.addEventListener('DOMContentLoaded', highlightAllCode);

/* ===== PLAYGROUND CONFIGS ===== */
const playgroundConfigs = {
  button: {
    controls: [
      { name: 'text', type: 'text', label: 'Text', default: 'Click me' },
      { name: 'variant', type: 'select', label: 'Variant', options: [
        { value: '', label: 'Default <button>' },
        { value: 'nbtl-button', label: '.nbtl-button' },
        { value: 'clear-button', label: '.clear-button' },
      ]},
      { name: 'noBorder', type: 'checkbox', label: 'No border' },
      { name: 'dots', type: 'checkbox', label: 'Dotted' },
      { name: 'dashed', type: 'checkbox', label: 'Dashed' },
      { name: 'roundedFull', type: 'checkbox', label: 'Rounded full' },
    ],
    render(v) {
      const text = v.text || 'Click me';
      const cls = [v.variant, v.roundedFull ? 'rounded-full' : ''].filter(Boolean);
      const attrs = [v.noBorder ? 'no-border' : '', v.dots ? 'dots' : '', v.dashed ? 'dashed' : ''].filter(Boolean);
      const clsStr = cls.length ? ` class="${cls.join(' ')}"` : '';
      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      if (v.variant === 'nbtl-button') {
        const code = `<div${clsStr}${attrStr}>${text}</div>`;
        return { html: code, code };
      }
      const code = `<button${clsStr}${attrStr}>${text}</button>`;
      return { html: code, code };
    }
  },

  badge: {
    controls: [
      { name: 'text', type: 'text', label: 'Text', default: 'Badge' },
      { name: 'variant', type: 'select', label: 'Variant', default: 'badge', options: [
        { value: 'badge', label: 'Default' },
        { value: 'badge badge-none', label: 'None' },
        { value: 'badge badge-success', label: 'Success' },
        { value: 'badge badge-error', label: 'Error' },
      ]},
      { name: 'roundedFull', type: 'checkbox', label: 'Rounded full' },
    ],
    render(v) {
      let cls = v.variant || 'badge';
      if (v.roundedFull) cls += ' rounded-full';
      const code = `<span class="${cls}">${v.text || 'Badge'}</span>`;
      return { html: code, code };
    }
  },

  input: {
    controls: [
      { name: 'inputType', type: 'select', label: 'Type', options: [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'password', label: 'Password' },
        { value: 'file', label: 'File' },
      ]},
      { name: 'placeholder', type: 'text', label: 'Placeholder', default: 'Type here...' },
      { name: 'dots', type: 'checkbox', label: 'Dotted' },
      { name: 'dashed', type: 'checkbox', label: 'Dashed' },
    ],
    render(v) {
      const attrs = [v.dots ? 'dots' : '', v.dashed ? 'dashed' : ''].filter(Boolean);
      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      const ph = v.placeholder ? ` placeholder="${v.placeholder}"` : '';
      const code = `<input type="${v.inputType || 'text'}"${ph}${attrStr}>`;
      return { html: code, code };
    }
  },

  datetime: {
    controls: [
      { name: 'mode', type: 'select', label: 'Mode', default: 'datetime', options: [
        { value: 'datetime', label: 'Datetime' },
        { value: 'date', label: 'Date only' },
      ]},
      { name: 'name', type: 'text', label: 'Name', default: 'meeting' },
      { name: 'placeholder', type: 'text', label: 'Placeholder', default: 'Select date and time' },
      { name: 'withValue', type: 'checkbox', label: 'Preset value' },
    ],
    render(v) {
      const attrs = [];
      const mode = v.mode === 'date' ? 'date' : 'datetime';
      const placeholder = v.placeholder || (mode === 'date' ? 'Select date' : 'Select date and time');

      if (mode === 'date') attrs.push('mode="date"');
      if (v.name) attrs.push(`name="${v.name}"`);
      if (placeholder) attrs.push(`placeholder="${placeholder}"`);
      if (v.withValue) {
        attrs.push(`value="${mode === 'date' ? '2026-03-10' : '2026-03-10T14:30'}"`);
      }

      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      const code = `<nb-datetime${attrStr}></nb-datetime>`;
      return { html: code, code };
    }
  },

  textarea: {
    controls: [
      { name: 'noResize', type: 'checkbox', label: 'No resize' },
      { name: 'dashed', type: 'checkbox', label: 'Dashed' },
    ],
    render(v) {
      const attrs = [v.noResize ? 'no-resize' : '', v.dashed ? 'dashed' : ''].filter(Boolean);
      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      const code = `<textarea rows="4"${attrStr} placeholder="Type..."></textarea>`;
      return { html: code, code };
    }
  },

  labelcomp: {
    controls: [
      { name: 'text', type: 'text', label: 'Text', default: 'Label' },
      { name: 'dots', type: 'checkbox', label: 'Dotted' },
      { name: 'dashed', type: 'checkbox', label: 'Dashed' },
      { name: 'noBorder', type: 'checkbox', label: 'No border' },
    ],
    render(v) {
      const attrs = [v.dots ? 'dots' : '', v.dashed ? 'dashed' : '', v.noBorder ? 'no-border' : ''].filter(Boolean);
      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      const code = `<label${attrStr}>${v.text || 'Label'}</label>`;
      return { html: code, code };
    }
  },

  link: {
    controls: [
      { name: 'text', type: 'text', label: 'Text', default: 'Click here' },
      { name: 'href', type: 'text', label: 'URL', default: '#' },
    ],
    render(v) {
      const code = `<a href="${v.href || '#'}">${v.text || 'Click here'}</a>`;
      return { html: code, code };
    }
  },

  table: {
    controls: [
      { name: 'cols', type: 'number', label: 'Columns', default: '3' },
      { name: 'rows', type: 'number', label: 'Rows', default: '3' },
    ],
    render(v) {
      const cols = Math.max(1, Math.min(6, parseInt(v.cols) || 3));
      const rows = Math.max(1, Math.min(8, parseInt(v.rows) || 3));
      let code = '<table>\n  <thead>\n    <tr>\n';
      for (let c = 0; c < cols; c++) code += `      <th>Header ${c + 1}</th>\n`;
      code += '    </tr>\n  </thead>\n  <tbody>\n';
      for (let r = 0; r < rows; r++) {
        code += '    <tr>\n';
        for (let c = 0; c < cols; c++) code += `      <td>Cell ${r+1}-${c+1}</td>\n`;
        code += '    </tr>\n';
      }
      code += '  </tbody>\n</table>';
      return { html: code, code };
    }
  },

  dropdown: {
    controls: [
      { name: 'text', type: 'text', label: 'Button Text', default: 'Menu' },
      { name: 'items', type: 'number', label: 'Items', default: '3' },
      { name: 'separator', type: 'select', label: 'Separator', options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ], default: 'none' },
      { name: 'maxItems', type: 'number', label: 'Max Items', default: '' },
    ],
    render(v) {
      const n = Math.max(1, Math.min(12, parseInt(v.items) || 3));
      let items = '';
      for (let i = 0; i < n; i++) items += `    <a href="#">Item ${i+1}</a>\n`;
      const attrs = [];
      if (v.separator && v.separator !== 'none') attrs.push(`separator="${v.separator}"`);
      const maxItems = parseInt(v.maxItems);
      if (maxItems >= 1 && maxItems <= 10) attrs.push(`max-items="${maxItems}"`);
      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      const code = `<div class="dropdown"${attrStr}>\n  <button class="dropdown-button">${v.text || 'Menu'}</button>\n  <div class="dropdown-content">\n${items}  </div>\n</div>`;
      return { html: code, code };
    }
  },

  select: {
    controls: [
      { name: 'items', type: 'number', label: 'Items', default: '4' },
      { name: 'placeholder', type: 'text', label: 'Placeholder', default: 'Choose...' },
      { name: 'separator', type: 'select', label: 'Separator', options: [
        { value: 'dashed', label: 'Dashed' },
        { value: 'solid', label: 'Solid' },
        { value: 'dotted', label: 'Dotted' },
      ], default: 'dashed' },
      { name: 'maxItems', type: 'number', label: 'Max Items', default: '' },
    ],
    render(v) {
      const n = Math.max(1, Math.min(12, parseInt(v.items) || 4));
      let options = '';
      for (let i = 0; i < n; i++) options += `  <option value="${i+1}">Option ${i+1}</option>\n`;
      const attrs = [];
      if (v.placeholder) attrs.push(`placeholder="${v.placeholder}"`);
      if (v.separator && v.separator !== 'dashed') attrs.push(`separator="${v.separator}"`);
      const maxItems = parseInt(v.maxItems);
      if (maxItems >= 1 && maxItems <= 10) attrs.push(`max-items="${maxItems}"`);
      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      const code = `<nb-select${attrStr}>\n${options}</nb-select>`;
      return { html: code, code };
    }
  },

  loading: {
    controls: [
      { name: 'text', type: 'text', label: 'Text', default: 'Loading' },
    ],
    render(v) {
      const code = `<span class="loading-dots">${v.text || 'Loading'}</span>`;
      return { html: code, code };
    }
  },

  image: {
    controls: [
      { name: 'noBorder', type: 'checkbox', label: 'No border' },
      { name: 'roundedFull', type: 'checkbox', label: 'Rounded full' },
    ],
    render(v) {
      const attrs = ['nbtl', v.noBorder ? 'no-border' : '', v.roundedFull ? 'class="rounded-full"' : ''].filter(Boolean);
      const code = `<img ${attrs.join(' ')} src="https://picsum.photos/200/150" alt="Example">`;
      return { html: code, code };
    }
  },

  gridcomp: {
    controls: [
      { name: 'items', type: 'number', label: 'Items', default: '3' },
      { name: 'useFlex', type: 'checkbox', label: 'Use gridflex' },
    ],
    render(v) {
      const n = Math.max(1, Math.min(8, parseInt(v.items) || 3));
      const tag = v.useFlex ? 'gridflex' : 'grid';
      const childTag = 'label';
      let children = '';
      for (let i = 0; i < n; i++) children += `  <${childTag}>Item ${i+1}</${childTag}>\n`;
      const code = `<${tag}>\n${children}</${tag}>`;
      return { html: code, code };
    }
  },

  articlecomp: {
    controls: [
      { name: 'showHeader', type: 'checkbox', label: 'Show header', default: true },
      { name: 'showFooter', type: 'checkbox', label: 'Show footer', default: true },
      { name: 'useWindow', type: 'checkbox', label: 'Window' },
    ],
    render(v) {
      const tag = v.useWindow ? '<article window>' : '<article>';
      let code = tag + '\n';
      if (v.showHeader) code += v.useWindow ? '  <header>Title</header>\n' : '  <header><h3>Title</h3></header>\n';
      code += v.useWindow ? '  <p style="padding:16px;">Article content with neubrutalism styling.</p>\n' : '  <p>Article content with neubrutalism styling.</p>\n';
      if (v.showFooter) code += v.useWindow ? '  <footer style="padding:12px 16px;">Footer</footer>\n' : '  <footer>Footer</footer>\n';
      code += '</article>';
      return { html: code, code };
    }
  },
};
