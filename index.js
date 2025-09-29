(() => {
  const prevEl = document.getElementById('prev');
  const currEl = document.getElementById('curr');
  const keys = document.querySelector('.pad');
  const themeToggle = document.getElementById('themeToggle');

  let current = '';
  let previous = '';
  let operator = null;
  let justComputed = false;

  const formatDisplay = (str) => {
    if (str === '' || str === 'Error') return str;
    if (!isFinite(Number(str))) return str;
    const [intPart, decPart] = String(str).split('.');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart ? `${grouped}.${decPart}` : grouped;
  };

  function update() {
    currEl.textContent = formatDisplay(current) || '0';
    prevEl.textContent = previous && operator ? `${formatDisplay(previous)} ${operator}` : '';
  }

  function appendNumber(n) {
    if (justComputed) { current = ''; justComputed = false; }
    if (n === '.' && current.includes('.')) return;
    if (current === '0' && n !== '.') current = n;
    else current = current + n;
    update();
  }

  function chooseOperator(op) {
    if (current === '' && previous === '') return;
    if (previous !== '' && current !== '') compute();
    operator = op;
    if (current !== '') { previous = current; current = ''; }
    update();
  }

  function compute() {
    if (!operator || previous === '') return;
    const a = parseFloat(previous);
    const b = current === '' ? a : parseFloat(current);
    let res;
    switch (operator) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b === 0 ? 'Error' : a / b; break;
      case '%': res = a % b; break;
      default: return;
    }
    current = (res === 'Error') ? 'Error' : String(Number(res.toPrecision(12))).replace(/(?:\.0+$)|(?:(?<=\.[0-9]*?)0+$)/, '');
    previous = '';
    operator = null;
    justComputed = true;
    update();
  }

  function clearAll() { current = ''; previous = ''; operator = null; justComputed = false; update(); }
  function backspace() { if (current.length) current = current.slice(0, -1); update(); }

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    const val = btn.dataset.value; const action = btn.dataset.action;
    // small press animation
    btn.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }], { duration: 110, easing: 'ease-out' });

    if (action === 'clear') return clearAll();
    if (action === 'back') return backspace();
    if (action === 'equals') return compute();
    if (val && ['+', '-', '*', '/', '%'].includes(val)) return chooseOperator(val);
    if (val) return appendNumber(val);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (['+', '-', '*', '/', '%'].includes(e.key)) chooseOperator(e.key);
    if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
    if (e.key === 'Backspace') backspace();
    if (e.key === 'Escape') clearAll();
  });

  themeToggle.addEventListener('click', () => document.body.classList.toggle('light'));

  // init
  clearAll();
})();
