/* ============================================
   Finavox — Apple-Style Finance App
   Application Logic
   ============================================ */

// ---- STATE ----
const state = {
  user: { name: 'Gladys', initial: 'G' },
  balance: 1957.43,
  savings: 842.50,
  currentView: 'home',
  selectedDate: new Date(),
  addSheetOpen: false,
  debtSheetOpen: false,
  goalSheetOpen: false,
  addType: 'expense',
  amountStr: '',
  selectedCategory: null,
  debtType: 'owe',
  debtViewTab: 'owe',
  editingDebtId: null,
  transactionFilter: 'all',
  searchQuery: '',
  transactions: [],
  savingsGoals: [],
  debts: [],
};

// ---- SAMPLE DATA ----
function initSampleData() {
  const saved = localStorage.getItem('finavox_data');
  if (saved) {
    try {
      const d = JSON.parse(saved);
      Object.assign(state, d);
      return;
    } catch (e) { /* use defaults */ }
  }

  state.transactions = [
    { id: 1, name: 'Campus Coffee', category: 'coffee', type: 'expense', amount: 4.50, date: daysAgo(0), note: 'Morning latte' },
    { id: 2, name: 'Textbook Store', category: 'books', type: 'expense', amount: 67.99, date: daysAgo(0), note: 'Calc II textbook' },
    { id: 3, name: 'Part-time Job', category: 'job', type: 'income', amount: 485.00, date: daysAgo(1), note: 'Weekly pay' },
    { id: 4, name: 'Uber Ride', category: 'transport', type: 'expense', amount: 12.40, date: daysAgo(1), note: 'To downtown' },
    { id: 5, name: 'Chipotle', category: 'food', type: 'expense', amount: 11.25, date: daysAgo(1), note: 'Lunch' },
    { id: 6, name: 'Spotify', category: 'subscriptions', type: 'expense', amount: 5.99, date: daysAgo(2), note: 'Student plan' },
    { id: 7, name: 'Mom Transfer', category: 'family', type: 'income', amount: 200.00, date: daysAgo(2), note: 'Monthly support' },
    { id: 8, name: 'Grocery Store', category: 'food', type: 'expense', amount: 34.80, date: daysAgo(3), note: 'Weekly groceries' },
    { id: 9, name: 'Netflix', category: 'subscriptions', type: 'expense', amount: 6.99, date: daysAgo(3), note: 'Shared plan' },
    { id: 10, name: 'Freelance Design', category: 'freelance', type: 'income', amount: 150.00, date: daysAgo(4), note: 'Logo project' },
    { id: 11, name: 'Gym Membership', category: 'health', type: 'expense', amount: 29.99, date: daysAgo(5), note: 'Monthly' },
    { id: 12, name: 'New Hoodie', category: 'shopping', type: 'expense', amount: 45.00, date: daysAgo(5), note: 'Campus store' },
    { id: 13, name: 'Movie Tickets', category: 'entertainment', type: 'expense', amount: 15.00, date: daysAgo(6), note: 'With friends' },
    { id: 14, name: 'Scholarship', category: 'scholarship', type: 'income', amount: 500.00, date: daysAgo(7), note: 'Spring semester' },
    { id: 15, name: 'Electric Bill', category: 'utilities', type: 'expense', amount: 42.00, date: daysAgo(8), note: 'Apartment share' },
  ];

  state.savingsGoals = [
    { id: 1, name: 'MacBook Pro', icon: 'fa-solid fa-laptop', target: 1999, current: 842.50, color: 'blue' },
    { id: 2, name: 'Summer Trip', icon: 'fa-solid fa-plane', target: 800, current: 340, color: 'orange' },
    { id: 3, name: 'Emergency Fund', icon: 'fa-solid fa-life-ring', target: 500, current: 275, color: 'green' },
  ];

  state.debts = [
    { id: 1, name: 'Alex Chen', initial: 'A', type: 'owe', amount: 25.00, reason: 'Concert tickets', date: daysAgo(3), color: '#FF9500' },
    { id: 2, name: 'Sarah Kim', initial: 'S', type: 'lent', amount: 40.00, reason: 'Dinner split', date: daysAgo(5), color: '#AF52DE' },
    { id: 3, name: 'Jake Miller', initial: 'J', type: 'owe', amount: 15.00, reason: 'Pizza night', date: daysAgo(1), color: '#5AC8FA' },
    { id: 4, name: 'Maya Patel', initial: 'M', type: 'lent', amount: 60.00, reason: 'Textbook loan', date: daysAgo(7), color: '#FF2D55' },
    { id: 5, name: 'Ryan Brooks', initial: 'R', type: 'lent', amount: 20.00, reason: 'Gas money', date: daysAgo(2), color: '#30D158' },
  ];

  saveData();
}

// ---- HELPERS ----
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
  return d.toISOString();
}

function formatCurrency(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDaysToDate(date, days) {
  const d = startOfDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function toDayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromDayKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function saveData() {
  const d = {
    balance: state.balance,
    savings: state.savings,
    transactions: state.transactions,
    savingsGoals: state.savingsGoals,
    debts: state.debts,
  };
  localStorage.setItem('finavox_data', JSON.stringify(d));
}

function nextId(arr) {
  return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

// ---- CATEGORIES ----
const categories = {
  expense: [
    { id: 'food', name: 'Food', icon: 'fa-solid fa-burger', bg: '#FFF3E0' },
    { id: 'coffee', name: 'Coffee', icon: 'fa-solid fa-mug-hot', bg: '#EFEBE9' },
    { id: 'transport', name: 'Transit', icon: 'fa-solid fa-bus', bg: '#E3F2FD' },
    { id: 'books', name: 'Books', icon: 'fa-solid fa-book', bg: '#FCE4EC' },
    { id: 'entertainment', name: 'Fun', icon: 'fa-solid fa-gamepad', bg: '#F3E5F5' },
    { id: 'shopping', name: 'Shopping', icon: 'fa-solid fa-shirt', bg: '#E8F5E9' },
    { id: 'subscriptions', name: 'Subs', icon: 'fa-solid fa-mobile-screen-button', bg: '#E0F7FA' },
    { id: 'health', name: 'Health', icon: 'fa-solid fa-capsules', bg: '#FFF8E1' },
    { id: 'utilities', name: 'Utilities', icon: 'fa-solid fa-lightbulb', bg: '#FFFDE7' },
    { id: 'rent', name: 'Rent', icon: 'fa-solid fa-house', bg: '#F1F8E9' },
    { id: 'other_expense', name: 'Other', icon: 'fa-solid fa-thumbtack', bg: '#ECEFF1' },
  ],
  income: [
    { id: 'job', name: 'Job', icon: 'fa-solid fa-briefcase', bg: '#E8F5E9' },
    { id: 'scholarship', name: 'Scholar', icon: 'fa-solid fa-graduation-cap', bg: '#FFF8E1' },
    { id: 'family', name: 'Family', icon: 'fa-solid fa-people-group', bg: '#FCE4EC' },
    { id: 'freelance', name: 'Freelance', icon: 'fa-solid fa-sack-dollar', bg: '#F3E5F5' },
    { id: 'aid', name: 'Fin. Aid', icon: 'fa-solid fa-building-columns', bg: '#E3F2FD' },
    { id: 'gift', name: 'Gift', icon: 'fa-solid fa-gift', bg: '#FFF3E0' },
    { id: 'refund', name: 'Refund', icon: 'fa-solid fa-rotate-left', bg: '#E0F7FA' },
    { id: 'other_income', name: 'Other', icon: 'fa-solid fa-thumbtack', bg: '#ECEFF1' },
  ],
};

function getCategoryInfo(id) {
  const all = [...categories.expense, ...categories.income];
  return all.find(c => c.id === id) || { icon: 'fa-solid fa-thumbtack', name: 'Other', bg: '#ECEFF1' };
}

function sanitizeFaClass(iconClass, fallback = 'fa-solid fa-circle') {
  if (typeof iconClass !== 'string') return fallback;
  const trimmed = iconClass.trim();
  if (!trimmed) return fallback;
  if (!/^fa[a-z-]*\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*$/i.test(trimmed)) return fallback;
  return trimmed;
}

function renderFaIcon(iconClass, fallback, extraClass = '') {
  const safe = sanitizeFaClass(iconClass, fallback);
  const cls = extraClass ? `${safe} ${extraClass}` : safe;
  return `<i class="${cls}" aria-hidden="true"></i>`;
}

// ---- SVG ICONS ----
const icons = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  piggy: '<svg viewBox="0 0 24 24"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-3.5c1.3-1.2 2-2.7 2-4.5 0-2-1-3-1-3s1-1.5 1-3.5c0-.6-.5-1.5-1-1.5z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="10" r="0.5" fill="currentColor" stroke="none"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" stroke-linecap="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  creditCard: '<svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg>',
  x: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  delete: '<svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke-linecap="round" stroke-linejoin="round"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wallet: '<svg viewBox="0 0 24 24"><path d="M21 12V7H5a2 2 0 010-4h14v4" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 5v14a2 2 0 002 2h16v-5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 12a2 2 0 100 4h4v-4h-4z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// ---- TIME ----
function updateTime() {
  const now = new Date();
  const el = document.getElementById('status-time');
  if (el) el.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
}

// ---- NAVIGATION ----
function switchView(viewId) {
  if (viewId === state.currentView) return;
  const oldView = document.querySelector('.view.active');
  const newView = document.getElementById(viewId);
  if (!oldView || !newView) return;

  const tabs = ['home', 'transactions', 'add', 'savings', 'debts'];
  const oldIdx = tabs.indexOf(state.currentView);
  const newIdx = tabs.indexOf(viewId);

  if (viewId === 'add') {
    openAddSheet();
    return;
  }

  oldView.classList.remove('active');
  if (newIdx > oldIdx) oldView.classList.add('exit-left');

  setTimeout(() => {
    oldView.classList.remove('exit-left');
    oldView.style.transform = '';
  }, 300);

  newView.classList.add('active');
  state.currentView = viewId;

  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const tabEl = document.querySelector(`[data-tab="${viewId}"]`);
  if (tabEl) tabEl.classList.add('active');

  renderView(viewId);
}

function renderView(viewId) {
  switch (viewId) {
    case 'home': renderHome(); break;
    case 'transactions': renderTransactions(); break;
    case 'savings': renderSavings(); break;
    case 'debts': renderDebts(); break;
  }
}

// ---- HOME VIEW ----
function renderHome() {
  updateTime();
  renderGreeting();
  renderWeekCalendar();
  renderPeopleRow();
  renderBalanceCard();
  renderFlowCard();
  renderQuickActions();
  renderStats();
  renderRecentTransactions();
}

function renderGreeting() {
  const now = new Date();
  const h = now.getHours();
  let greeting = 'Good morning';
  if (h >= 12 && h < 17) greeting = 'Good afternoon';
  if (h >= 17) greeting = 'Good evening';

  const el = document.getElementById('greeting-text');
  if (el) el.textContent = `Hi, ${state.user.name}!`;

  const dateEl = document.getElementById('date-label');
  if (dateEl) {
    const selected = new Date(state.selectedDate);
    dateEl.innerHTML = selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }) + ` ${icons.chevDown}`;
  }
}

function renderWeekCalendar() {
  const container = document.getElementById('week-days');
  if (!container) return;

  const today = startOfDay(new Date());
  const selected = startOfDay(new Date(state.selectedDate));
  const dayRangeBefore = 90;
  const dayRangeAfter = 90;
  const start = addDaysToDate(today, -dayRangeBefore);
  let html = '';

  for (let i = 0; i <= dayRangeBefore + dayRangeAfter; i++) {
    const d = addDaysToDate(start, i);
    const isToday = sameDay(d, today);
    const isSelected = sameDay(d, selected);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });

    html += `
      <div class="week-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" data-date-key="${toDayKey(d)}">
        <span class="day-name">${dayName}</span>
        <span class="day-num">${d.getDate()}</span>
      </div>`;
  }

  container.innerHTML = html;

  const centerSelected = (behavior = 'auto') => {
    const active = container.querySelector('.week-day.selected') || container.querySelector('.week-day.today');
    if (!active) return;

    const left = active.offsetLeft - ((container.clientWidth - active.offsetWidth) / 2);
    container.scrollTo({ left: Math.max(0, left), behavior });
  };

  container.querySelectorAll('.week-day').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.dateKey;
      if (!key) return;
      state.selectedDate = fromDayKey(key);
      renderWeekCalendar();
      renderGreeting();
      centerSelected('smooth');
    });
  });

  requestAnimationFrame(() => centerSelected('auto'));
}

function renderPeopleRow() {
  const container = document.getElementById('people-scroll');
  if (!container) return;

  const people = state.debts.slice(0, 3);
  let html = '';

  people.forEach(p => {
    html += `
      <div class="person-chip" data-id="${p.id}">
        <div class="avatar" style="background: ${p.color}">${p.initial}</div>
        <span>${p.name.split(' ')[0]}</span>
      </div>`;
  });

  if (state.debts.length > 3) {
    html += `
      <div class="people-more" onclick="switchView('debts')">
        <span>+${state.debts.length - 3}</span>
        <div class="avatar-stack">
          ${state.debts.slice(3, 6).map(p => `<div class="avatar" style="background:${p.color}">${p.initial}</div>`).join('')}
        </div>
      </div>`;
  }

  container.innerHTML = html;
}

let _prevBalance = null;

function renderBalanceCard() {
  const amountEl = document.getElementById('balance-amount');
  if (amountEl) {
    // Animate on change
    if (_prevBalance !== null && _prevBalance !== state.balance) {
      amountEl.classList.remove('balance-animating');
      void amountEl.offsetWidth; // force reflow
      amountEl.classList.add('balance-animating');
      amountEl.addEventListener('animationend', () => amountEl.classList.remove('balance-animating'), { once: true });
    }
    amountEl.textContent = formatCurrency(state.balance);
    _prevBalance = state.balance;
  }

  // Mini income / expense stats
  const { income, expenses } = getMonthTotals();
  const incomeEl = document.getElementById('balance-income');
  const expenseEl = document.getElementById('balance-expense');
  if (incomeEl) incomeEl.textContent = `+$${formatCurrency(income)}`;
  if (expenseEl) expenseEl.textContent = `-$${formatCurrency(expenses)}`;
}

function getMonthTotals() {
  const now = new Date();
  const monthTx = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const income   = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses };
}

function renderFlowCard() {
  const { income, expenses } = getMonthTotals();
  const net   = income - expenses;
  const total = income + expenses;
  const incomePct  = total > 0 ? (income  / total) * 100 : 0;
  const expensePct = total > 0 ? (expenses / total) * 100 : 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('flow-income-amount',  `+$${formatCurrency(income)}`);
  set('flow-expense-amount', `-$${formatCurrency(expenses)}`);
  set('flow-period', new Date().toLocaleDateString('en-US', { month: 'long' }));

  const netEl = document.getElementById('flow-net-value');
  if (netEl) {
    netEl.textContent  = `${net >= 0 ? '+' : '-'}$${formatCurrency(Math.abs(net))}`;
    netEl.className    = `flow-net-value ${net >= 0 ? 'positive' : 'negative'}`;
  }

  // Bars animate in after paint
  requestAnimationFrame(() => {
    const ib = document.getElementById('flow-income-bar');
    const eb = document.getElementById('flow-expense-bar');
    if (ib) ib.style.width = `${incomePct}%`;
    if (eb) eb.style.width = `${expensePct}%`;
  });
}

function renderQuickActions() {
  // Static — already in HTML
}

function renderStats() {
  const now = new Date();
  const monthTx = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = income - expenses;
  const savingsRate = income > 0 ? ((state.savings / income) * 100) : 0;

  const el = document.getElementById('stat-earnings');
  if (el) el.textContent = `+${((income / (income || 1)) * 23.78).toFixed(2)}%`;

  const savEl = document.getElementById('stat-savings');
  if (savEl) savEl.textContent = `+${savingsRate.toFixed(2)}%`;

  const invEl = document.getElementById('stat-investment');
  if (invEl) invEl.textContent = `+${(net > 0 ? (net / income * 100) : 0).toFixed(2)}%`;

  renderMiniChart();
}

function renderMiniChart() {
  const container = document.getElementById('mini-chart');
  if (!container) return;

  const now = new Date();
  let html = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayTx = state.transactions.filter(t => new Date(t.date).toDateString() === d.toDateString());
    const total = dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const h = Math.max(8, Math.min(100, (total / 80) * 100));
    html += `<div class="bar ${i === 0 ? 'accent' : ''}" style="height:${h}%;animation-delay:${(6 - i) * 50}ms"></div>`;
  }
  container.innerHTML = html;
}

function renderRecentTransactions() {
  const container = document.getElementById('recent-transactions');
  if (!container) return;

  const recent = state.transactions.slice(0, 4);
  container.innerHTML = recent.map(t => transactionItemHTML(t)).join('');
}

function transactionItemHTML(t) {
  const cat      = getCategoryInfo(t.category);
  const isExpense = t.type === 'expense';
  const sign      = isExpense ? '-' : '+';
  const cls       = isExpense ? 'expense' : 'income';

  return `
    <div class="transaction-item" data-id="${t.id}" onclick="toggleTransactionDetail(${t.id})">

      <!-- ── Main row ── -->
      <div class="transaction-main">
        <div class="transaction-icon" style="background:${cat.bg}">${renderFaIcon(cat.icon, 'fa-solid fa-tag')}</div>
        <div class="transaction-info">
          <div class="name">${t.name}</div>
          <div class="category">${cat.name} · ${formatDate(t.date)}</div>
        </div>
        <div class="transaction-amount">
          <div class="amount ${cls}">${sign}$${formatCurrency(t.amount)}</div>
          <div class="time">${formatTime(t.date)}</div>
        </div>
        <div class="transaction-chevron">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- ── Inline detail panel ── -->
      <div class="transaction-detail-panel">
        <div class="panel-inner">
          <div class="panel-body">
            <div class="detail-field">
              <span class="detail-key">Amount</span>
              <span class="detail-val ${cls}">${sign}$${formatCurrency(t.amount)}</span>
            </div>
            <div class="detail-field">
              <span class="detail-key">Date &amp; Time</span>
              <span class="detail-val">${formatDate(t.date)} · ${formatTime(t.date)}</span>
            </div>
            <div class="detail-field">
              <span class="detail-key">Category</span>
              <span class="detail-val">${renderFaIcon(cat.icon, 'fa-solid fa-tag', 'category-inline-icon')} ${cat.name}</span>
            </div>
            <div class="detail-field">
              <span class="detail-key">Type</span>
              <span class="detail-val">${isExpense ? 'Expense' : 'Income'}</span>
            </div>
            ${t.note ? `<div class="detail-field">
              <span class="detail-key">Note</span>
              <span class="detail-val">${t.note}</span>
            </div>` : ''}
            <div class="panel-actions">
              <button class="panel-delete-btn"
                onclick="event.stopPropagation(); deleteTransaction(${t.id})">
                <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>`;
}

function toggleTransactionDetail(id) {
  document.querySelectorAll('.transaction-item').forEach(el => {
    if (parseInt(el.dataset.id) === id) {
      el.classList.toggle('expanded');
    } else {
      el.classList.remove('expanded');
    }
  });
}

// ---- TRANSACTIONS VIEW ----
function renderTransactions() {
  renderTransactionFilters();
  renderTransactionList();
  renderMonthlySummary();
}

function renderTransactionFilters() {
  const container = document.getElementById('filter-chips');
  if (!container) return;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expenses' },
    { id: 'food', label: `${renderFaIcon('fa-solid fa-burger', 'fa-solid fa-burger', 'chip-icon')} Food` },
    { id: 'transport', label: `${renderFaIcon('fa-solid fa-bus', 'fa-solid fa-bus', 'chip-icon')} Transit` },
    { id: 'entertainment', label: `${renderFaIcon('fa-solid fa-gamepad', 'fa-solid fa-gamepad', 'chip-icon')} Fun` },
    { id: 'shopping', label: `${renderFaIcon('fa-solid fa-shirt', 'fa-solid fa-shirt', 'chip-icon')} Shopping` },
  ];

  container.innerHTML = filters.map(f =>
    `<div class="chip ${state.transactionFilter === f.id ? 'active' : ''}" data-filter="${f.id}">${f.label}</div>`
  ).join('');

  container.querySelectorAll('.chip').forEach(el => {
    el.addEventListener('click', () => {
      state.transactionFilter = el.dataset.filter;
      renderTransactions();
    });
  });
}

function renderTransactionList() {
  const container = document.getElementById('transaction-list');
  if (!container) return;

  let filtered = [...state.transactions];

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.note.toLowerCase().includes(q));
  }

  if (state.transactionFilter === 'income') {
    filtered = filtered.filter(t => t.type === 'income');
  } else if (state.transactionFilter === 'expense') {
    filtered = filtered.filter(t => t.type === 'expense');
  } else if (state.transactionFilter !== 'all') {
    filtered = filtered.filter(t => t.category === state.transactionFilter);
  }

  // Group by date
  const groups = {};
  filtered.forEach(t => {
    const key = formatDate(t.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  if (Object.keys(groups).length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${renderFaIcon('fa-solid fa-magnifying-glass', 'fa-solid fa-magnifying-glass')}</div>
        <h3>No transactions found</h3>
        <p>Try a different filter or add a new transaction</p>
      </div>`;
    return;
  }

  let html = '';
  Object.entries(groups).forEach(([date, txs]) => {
    html += `<div class="date-group">
      <div class="date-group-header">${date}</div>
      <div class="transaction-list-inner">
        ${txs.map(t => transactionItemHTML(t)).join('')}
      </div>
    </div>`;
  });

  container.innerHTML = html;
}

function renderMonthlySummary() {
  const now = new Date();
  const monthTx = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const incomeEl = document.getElementById('summary-income');
  const expenseEl = document.getElementById('summary-expense');
  const netEl = document.getElementById('summary-net');

  if (incomeEl) incomeEl.textContent = `+$${formatCurrency(income)}`;
  if (expenseEl) expenseEl.textContent = `-$${formatCurrency(expenses)}`;
  if (netEl) {
    const net = income - expenses;
    netEl.textContent = `${net >= 0 ? '+' : '-'}$${formatCurrency(Math.abs(net))}`;
    netEl.className = `summary-value ${net >= 0 ? 'income' : 'expense'}`;
  }
}

// ---- SAVINGS VIEW ----
function renderSavings() {
  renderSavingsBalances();
  renderSavingsChart();
  renderGoals();
  updateTransferSlider();
}

function renderSavingsBalances() {
  const mainEl = document.getElementById('savings-main-balance');
  const savingsEl = document.getElementById('savings-amount');
  const trendEl = document.getElementById('savings-trend');
  if (mainEl) mainEl.textContent = `$${formatCurrency(state.balance)}`;
  if (savingsEl) savingsEl.textContent = `$${formatCurrency(state.savings)}`;
  if (trendEl) trendEl.textContent = '+$45.00 this month';
}

function updateTransferSlider() {
  const slider = document.getElementById('transfer-slider');
  const maxLabel = document.getElementById('slider-max');
  if (maxLabel) maxLabel.textContent = `$${formatCurrency(state.balance)}`;
  if (slider) slider.value = 0;
  const inputEl = document.getElementById('transfer-amount');
  if (inputEl) inputEl.value = '';
}

function animateTransfer(direction) {
  const rightArrow = document.querySelector('.xfer-arrow.xfer-right');
  const leftArrow  = document.querySelector('.xfer-arrow.xfer-left');
  const mainCard   = document.getElementById('main-balance-card');
  const savCard    = document.getElementById('savings-balance-card');

  const arrow      = direction === 'save' ? rightArrow : leftArrow;
  const targetCard = direction === 'save' ? savCard    : mainCard;

  if (arrow) {
    arrow.classList.remove('animating');
    void arrow.offsetWidth;
    arrow.classList.add('animating');
    arrow.addEventListener('animationend', () => arrow.classList.remove('animating'), { once: true });
  }
  if (targetCard) {
    targetCard.classList.remove('card-received');
    void targetCard.offsetWidth;
    targetCard.classList.add('card-received');
    targetCard.addEventListener('animationend', () => targetCard.classList.remove('card-received'), { once: true });
  }
}

function renderSavingsChart() {
  const canvas = document.getElementById('savings-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);

  const dw = canvas.offsetWidth;
  const dh = canvas.offsetHeight;

  // Generate mock savings data for last 30 days
  const data = [];
  let val = state.savings - 150;
  for (let i = 30; i >= 0; i--) {
    val += (Math.random() - 0.3) * 15;
    val = Math.max(val, state.savings * 0.6);
    data.push(val);
  }
  data[data.length - 1] = state.savings;

  const maxVal = Math.max(...data) * 1.1;
  const minVal = Math.min(...data) * 0.9;
  const range = maxVal - minVal;

  // Draw gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, dh);
  gradient.addColorStop(0, 'rgba(29, 29, 31, 0.08)');
  gradient.addColorStop(1, 'rgba(29, 29, 31, 0)');

  ctx.beginPath();
  ctx.moveTo(0, dh);

  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * dw;
    const y = dh - ((v - minVal) / range) * (dh - 20);
    if (i === 0) ctx.lineTo(x, y);
    else {
      const prevX = ((i - 1) / (data.length - 1)) * dw;
      const prevY = dh - ((data[i - 1] - minVal) / range) * (dh - 20);
      const cpx = (prevX + x) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
    }
  });

  ctx.lineTo(dw, dh);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw line
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * dw;
    const y = dh - ((v - minVal) / range) * (dh - 20);
    if (i === 0) ctx.moveTo(x, y);
    else {
      const prevX = ((i - 1) / (data.length - 1)) * dw;
      const prevY = dh - ((data[i - 1] - minVal) / range) * (dh - 20);
      const cpx = (prevX + x) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
    }
  });
  ctx.strokeStyle = '#1D1D1F';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw end dot
  const lastX = dw;
  const lastY = dh - ((data[data.length - 1] - minVal) / range) * (dh - 20);
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#1D1D1F';
  ctx.fill();
}

function renderGoals() {
  const container = document.getElementById('goals-list');
  if (!container) return;

  let html = state.savingsGoals.map(g => {
    const pct = Math.round((g.current / g.target) * 100);
    return `
      <div class="goal-card" data-id="${g.id}">
        <div class="goal-header">
          <div class="goal-emoji">${renderFaIcon(g.icon || g.emoji, 'fa-solid fa-bullseye')}</div>
          <div class="goal-percent">${pct}%</div>
        </div>
        <div class="goal-name">${g.name}</div>
        <div class="goal-amounts">
          <span>$${formatCurrency(g.current)}</span>
          <span>of $${formatCurrency(g.target)}</span>
        </div>
        <div class="goal-progress">
          <div class="goal-progress-fill ${g.color}" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');

  html += `
    <button class="add-goal-btn" onclick="openGoalSheet()">
      ${icons.plus}
      <span>Add Goal</span>
    </button>`;

  container.innerHTML = html;
}

// ---- DEBTS VIEW ----
function renderDebts() {
  renderDebtSummary();
  renderDebtTabs();
  renderDebtList();
}

function renderDebtSummary() {
  const owed = state.debts.filter(d => d.type === 'owe').reduce((s, d) => s + d.amount, 0);
  const lent = state.debts.filter(d => d.type === 'lent').reduce((s, d) => s + d.amount, 0);

  const oweEl = document.getElementById('total-owed');
  const lentEl = document.getElementById('total-lent');
  if (oweEl) oweEl.textContent = `$${formatCurrency(owed)}`;
  if (lentEl) lentEl.textContent = `$${formatCurrency(lent)}`;
}

function renderDebtTabs() {
  document.querySelectorAll('.debt-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === state.debtViewTab);
  });
}

function renderDebtList() {
  const container = document.getElementById('debt-list');
  if (!container) return;

  const filtered = state.debts.filter(d => d.type === state.debtViewTab);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${state.debtViewTab === 'owe' ? renderFaIcon('fa-solid fa-face-smile-beam', 'fa-solid fa-circle-check') : renderFaIcon('fa-solid fa-money-bill-wave', 'fa-solid fa-money-bill-wave')}</div>
        <h3>${state.debtViewTab === 'owe' ? 'No debts!' : 'No loans yet'}</h3>
        <p>${state.debtViewTab === 'owe' ? 'You don\'t owe anyone money' : 'No one owes you money'}</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="debt-card" data-id="${d.id}">
      <div class="debt-avatar-wrap">
        <div class="avatar" style="background:${d.color}">${d.initial}</div>
        <div class="debt-type-badge ${d.type}">${d.type === 'owe' ? 'Owe' : 'Lent'}</div>
      </div>
      <div class="debt-card-info">
        <div class="name">${d.name}</div>
        <div class="reason">${d.reason}</div>
      </div>
      <div class="debt-card-right">
        <div class="debt-card-amount">
          <div class="amount ${d.type}">${d.type === 'owe' ? '-' : '+'}$${formatCurrency(d.amount)}</div>
          <div class="date">${formatDate(d.date)}</div>
        </div>
        <div class="debt-card-actions">
          <button class="debt-action edit" onclick="editDebt(${d.id}, event)" title="Edit">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="debt-action delete" onclick="deleteDebt(${d.id}, event)" title="Delete">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- ADD TRANSACTION SHEET ----
function openAddSheet() {
  state.addSheetOpen = true;
  state.amountStr = '';
  state.selectedCategory = null;
  state.addType = 'expense';

  const overlay = document.getElementById('add-sheet-overlay');
  overlay.classList.add('visible');

  // Reset title field
  const titleEl = document.getElementById('transaction-title');
  if (titleEl) { titleEl.value = ''; titleEl.blur(); }
  const counter = document.getElementById('tx-title-counter');
  if (counter) counter.textContent = '0 / 40';

  renderAddSheet();
}

function closeAddSheet() {
  state.addSheetOpen = false;
  const overlay = document.getElementById('add-sheet-overlay');
  overlay.classList.remove('visible');
}

function renderAddSheet() {
  renderTypeToggle();
  renderAmountDisplay();
  renderCategoryPicker();
  updateSaveButton();
}

function renderTypeToggle() {
  document.querySelectorAll('.type-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === state.addType);
  });
  // Stamp data attribute so CSS can color-code the active pill
  const toggle = document.querySelector('.type-toggle');
  if (toggle) toggle.dataset.activeType = state.addType;

  renderCategoryPicker();
  renderAmountDisplay(); // keep amount color in sync
}

function renderAmountDisplay() {
  const el = document.getElementById('amount-value');
  if (el) el.textContent = state.amountStr || '0';
  // Color-code the entire amount display by transaction type
  const display = document.querySelector('.amount-display');
  if (display) display.dataset.txType = state.addType;
}

function renderCategoryPicker() {
  const container = document.getElementById('category-grid');
  if (!container) return;

  const cats = categories[state.addType];
  container.innerHTML = cats.map(c => `
    <div class="category-item ${state.selectedCategory === c.id ? 'selected' : ''}" data-cat="${c.id}">
      <div class="cat-icon" style="background:${c.bg}">${renderFaIcon(c.icon, 'fa-solid fa-tag')}</div>
      <div class="cat-name">${c.name}</div>
    </div>
  `).join('');

  container.querySelectorAll('.category-item').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedCategory = el.dataset.cat;
      renderCategoryPicker();
      updateSaveButton();
    });
  });
}

function handleNumpad(key) {
  if (key === 'delete') {
    state.amountStr = state.amountStr.slice(0, -1);
  } else if (key === '.') {
    if (!state.amountStr.includes('.')) {
      state.amountStr += state.amountStr ? '.' : '0.';
    }
  } else {
    // Limit decimal places to 2
    const parts = state.amountStr.split('.');
    if (parts[1] && parts[1].length >= 2) return;
    // Limit total length
    if (state.amountStr.replace('.', '').length >= 7) return;
    state.amountStr += key;
  }

  renderAmountDisplay();
  updateSaveButton();
}

function updateSaveButton() {
  const btn = document.getElementById('save-transaction-btn');
  if (!btn) return;
  const amount   = parseFloat(state.amountStr);
  const title    = (document.getElementById('transaction-title')?.value ?? '').trim();
  const ready    = !!(amount > 0 && state.selectedCategory && title);
  const wasReady = !btn.disabled;

  btn.disabled = !ready;

  // Pulse the button the moment all three conditions are first satisfied
  if (ready && !wasReady) {
    btn.classList.remove('just-enabled');
    void btn.offsetWidth; // reflow
    btn.classList.add('just-enabled');
    btn.addEventListener('animationend', () => btn.classList.remove('just-enabled'), { once: true });
  }
}

function saveTransaction() {
  const amount = parseFloat(state.amountStr);
  if (!amount || !state.selectedCategory) return;

  const cat   = getCategoryInfo(state.selectedCategory);
  const title = (document.getElementById('transaction-title')?.value ?? '').trim();

  const tx = {
    id:       nextId(state.transactions),
    name:     title || cat.name,
    category: state.selectedCategory,
    type:     state.addType,
    amount:   amount,
    date:     new Date().toISOString(),
    note:     title,
  };

  state.transactions.unshift(tx);

  if (state.addType === 'expense') {
    state.balance -= amount;
  } else {
    state.balance += amount;
  }

  saveData();
  closeAddSheet();

  const sign  = state.addType === 'expense' ? '-' : '+';
  const icon = state.addType === 'expense' ? 'fa-solid fa-money-bill-trend-up' : 'fa-solid fa-sack-dollar';
  showToast(icon, `${tx.name} — ${sign}$${formatCurrency(amount)}`);

  renderView(state.currentView);
}

// ---- DEBT SHEET ----
function openDebtSheet(debt = null) {
  state.debtSheetOpen = true;
  state.editingDebtId = debt ? debt.id : null;
  state.debtType = debt ? debt.type : 'owe';

  const overlay = document.getElementById('debt-sheet-overlay');
  const header = overlay.querySelector('.sheet-header h2');
  const saveBtn = overlay.querySelector('.save-btn');
  if (header) header.textContent = debt ? 'Edit Debt' : 'Add Debt';
  if (saveBtn) saveBtn.textContent = debt ? 'Save Changes' : 'Add Debt';

  const nameEl = document.getElementById('debt-name');
  const amountEl = document.getElementById('debt-amount');
  const reasonEl = document.getElementById('debt-reason');
  if (nameEl) nameEl.value = debt ? debt.name : '';
  if (amountEl) amountEl.value = debt ? debt.amount : '';
  if (reasonEl) reasonEl.value = (debt && debt.reason !== 'No reason') ? debt.reason : '';

  overlay.classList.add('visible');
  renderDebtTypeToggle();
}

function closeDebtSheet() {
  state.debtSheetOpen = false;
  state.editingDebtId = null;
  const overlay = document.getElementById('debt-sheet-overlay');
  overlay.classList.remove('visible');
}

function renderDebtTypeToggle() {
  document.querySelectorAll('.debt-type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === state.debtType);
  });
}

function saveDebt() {
  const nameEl = document.getElementById('debt-name');
  const amountEl = document.getElementById('debt-amount');
  const reasonEl = document.getElementById('debt-reason');

  const name = nameEl ? nameEl.value.trim() : '';
  const amount = amountEl ? parseFloat(amountEl.value) : 0;
  const reason = reasonEl ? reasonEl.value.trim() : '';

  if (!name || !amount) {
    showToast('fa-solid fa-triangle-exclamation', 'Please fill in name and amount');
    return;
  }

  if (state.editingDebtId) {
    const idx = state.debts.findIndex(d => d.id === state.editingDebtId);
    if (idx !== -1) {
      state.debts[idx] = {
        ...state.debts[idx],
        name,
        initial: name.charAt(0).toUpperCase(),
        type: state.debtType,
        amount,
        reason: reason || 'No reason',
      };
    }
    saveData();
    closeDebtSheet();
    showToast('fa-solid fa-circle-check', `Updated ${name}`);
    renderDebts();
    renderPeopleRow();
    return;
  }

  const colors = ['#FF9500', '#AF52DE', '#5AC8FA', '#FF2D55', '#30D158', '#007AFF', '#FFCC00', '#5856D6'];

  const debt = {
    id: nextId(state.debts),
    name,
    initial: name.charAt(0).toUpperCase(),
    type: state.debtType,
    amount,
    reason: reason || 'No reason',
    date: new Date().toISOString(),
    color: colors[Math.floor(Math.random() * colors.length)],
  };

  state.debts.push(debt);
  saveData();
  closeDebtSheet();
  showToast('fa-solid fa-circle-check', `${state.debtType === 'owe' ? 'Debt' : 'Loan'} added for ${name}`);
  renderDebts();
  renderPeopleRow();

  if (nameEl) nameEl.value = '';
  if (amountEl) amountEl.value = '';
  if (reasonEl) reasonEl.value = '';
}

function editDebt(id, event) {
  event.stopPropagation();
  const debt = state.debts.find(d => d.id === id);
  if (!debt) return;
  openDebtSheet(debt);
}

function deleteDebt(id, event) {
  event.stopPropagation();
  const debt = state.debts.find(d => d.id === id);
  if (!debt) return;
  state.debts = state.debts.filter(d => d.id !== id);
  saveData();
  showToast('fa-solid fa-trash', `Removed ${debt.name}`);
  renderDebts();
  renderPeopleRow();
}

// ---- GOAL SHEET ----
function openGoalSheet() {
  state.goalSheetOpen = true;
  const overlay = document.getElementById('goal-sheet-overlay');
  overlay.classList.add('visible');
}

function closeGoalSheet() {
  state.goalSheetOpen = false;
  const overlay = document.getElementById('goal-sheet-overlay');
  overlay.classList.remove('visible');
}

function saveGoal() {
  const nameEl = document.getElementById('goal-name-input');
  const targetEl = document.getElementById('goal-target-input');
  const iconEl = document.getElementById('goal-icon-input');

  const name = nameEl ? nameEl.value.trim() : '';
  const target = targetEl ? parseFloat(targetEl.value) : 0;
  const icon = sanitizeFaClass(iconEl ? iconEl.value : '', 'fa-solid fa-bullseye');

  if (!name || !target) {
    showToast('fa-solid fa-triangle-exclamation', 'Please fill in name and target');
    return;
  }

  const colors = ['green', 'blue', 'orange', 'purple'];

  const goal = {
    id: nextId(state.savingsGoals),
    name: name,
    icon: icon,
    target: target,
    current: 0,
    color: colors[state.savingsGoals.length % colors.length],
  };

  state.savingsGoals.push(goal);
  saveData();
  closeGoalSheet();
  showToast('fa-solid fa-bullseye', `Goal "${name}" created`);
  renderGoals();

  if (nameEl) nameEl.value = '';
  if (targetEl) targetEl.value = '';
  if (iconEl) iconEl.value = '';
}

// ---- SAVINGS TRANSFER ----
function handleTransfer() {
  const inputEl = document.getElementById('transfer-amount');
  const amount = inputEl ? parseFloat(inputEl.value) : 0;
  if (!amount || amount <= 0) return;
  if (amount > state.balance) {
    showToast('fa-solid fa-triangle-exclamation', 'Insufficient balance');
    return;
  }

  state.balance -= amount;
  state.savings += amount;

  // Add to first goal if exists
  if (state.savingsGoals.length > 0) {
    state.savingsGoals[0].current = Math.min(
      state.savingsGoals[0].current + amount,
      state.savingsGoals[0].target
    );
  }

  saveData();
  animateTransfer('save');
  showToast('fa-solid fa-arrow-right-arrow-left', `$${formatCurrency(amount)} moved to savings`);

  const slider = document.getElementById('transfer-slider');
  if (slider) slider.value = 0;
  if (inputEl) inputEl.value = '';
  renderSavings();
  renderBalanceCard();
}

function handleWithdraw() {
  const inputEl = document.getElementById('transfer-amount');
  const amount = inputEl ? parseFloat(inputEl.value) : 0;
  if (!amount || amount <= 0) return;
  if (amount > state.savings) {
    showToast('fa-solid fa-triangle-exclamation', 'Insufficient savings');
    return;
  }

  state.savings -= amount;
  state.balance += amount;

  saveData();
  animateTransfer('withdraw');
  showToast('fa-solid fa-building-columns', `$${formatCurrency(amount)} returned to main`);

  const slider = document.getElementById('transfer-slider');
  if (slider) slider.value = 0;
  if (inputEl) inputEl.value = '';
  renderSavings();
  renderBalanceCard();
}

// ---- TRANSACTION DETAIL ----
function showTransactionDetail(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  const cat = getCategoryInfo(tx.category);
  const modal = document.getElementById('transaction-detail-modal');
  if (!modal) return;

  const isExpense = tx.type === 'expense';

  modal.querySelector('.glass-modal-content').innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:34px;margin-bottom:12px;line-height:1">${renderFaIcon(cat.icon, 'fa-solid fa-tag')}</div>
      <div style="font-size:24px;font-weight:700;margin-bottom:4px;color:${isExpense ? 'var(--text-primary)' : 'var(--green)'}">
        ${isExpense ? '-' : '+'}$${formatCurrency(tx.amount)}
      </div>
      <div style="font-size:15px;color:var(--text-secondary)">${tx.name}</div>
    </div>
    <div style="background:var(--bg);border-radius:14px;padding:16px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:var(--text-tertiary);font-size:13px">Category</span>
        <span style="font-weight:500;font-size:14px">${cat.name}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:var(--text-tertiary);font-size:13px">Date</span>
        <span style="font-weight:500;font-size:14px">${formatDate(tx.date)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="color:var(--text-tertiary);font-size:13px">Time</span>
        <span style="font-weight:500;font-size:14px">${formatTime(tx.date)}</span>
      </div>
      ${tx.note ? `<div style="display:flex;justify-content:space-between">
        <span style="color:var(--text-tertiary);font-size:13px">Note</span>
        <span style="font-weight:500;font-size:14px">${tx.note}</span>
      </div>` : ''}
    </div>
    <button class="save-btn" style="background:var(--red);margin-bottom:8px" onclick="deleteTransaction(${tx.id})">Delete Transaction</button>
    <button class="save-btn" style="background:var(--bg);color:var(--text-primary)" onclick="closeTransactionDetail()">Done</button>
  `;

  modal.classList.add('visible');
}

function closeTransactionDetail() {
  const modal = document.getElementById('transaction-detail-modal');
  if (modal) modal.classList.remove('visible');
}

function deleteTransaction(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  if (tx.type === 'expense') {
    state.balance += tx.amount;
  } else {
    state.balance -= tx.amount;
  }

  state.transactions = state.transactions.filter(t => t.id !== id);
  saveData();
  closeTransactionDetail(); // keeps glass-modal path working if called from there
  showToast('fa-solid fa-trash', 'Transaction deleted');
  renderView(state.currentView);
}

// ---- TOAST ----
function showToast(iconClass, message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const iconEl = toast.querySelector('.toast-icon');
  if (iconEl) iconEl.innerHTML = renderFaIcon(iconClass, 'fa-solid fa-circle-info');
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ---- SEARCH ----
function handleSearch(query) {
  state.searchQuery = query;
  renderTransactionList();
}

// ---- INIT ----
function init() {
  initSampleData();

  // Navigation
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.tab;
      if (view === 'add') {
        openAddSheet();
      } else {
        switchView(view);
      }
    });
  });

  // Type toggle
  document.querySelectorAll('.type-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.addType = btn.dataset.type;
      state.selectedCategory = null;
      renderTypeToggle();
      renderAmountDisplay();
      updateSaveButton();
    });
  });

  // Numpad
  document.querySelectorAll('.numpad button').forEach(btn => {
    btn.addEventListener('click', () => {
      handleNumpad(btn.dataset.key);
    });
  });

  // Sheet overlays close
  document.getElementById('add-sheet-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAddSheet();
  });
  document.getElementById('debt-sheet-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDebtSheet();
  });
  document.getElementById('goal-sheet-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeGoalSheet();
  });
  document.getElementById('transaction-detail-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTransactionDetail();
  });

  // Debt tabs
  document.querySelectorAll('.debt-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.debtViewTab = tab.dataset.tab;
      renderDebtTabs();
      renderDebtList();
    });
  });

  // Debt type toggle
  document.querySelectorAll('.debt-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.debtType = btn.dataset.type;
      renderDebtTypeToggle();
    });
  });

  // Transaction title field — gates save button + drives character counter
  const titleInput = document.getElementById('transaction-title');
  if (titleInput) {
    titleInput.addEventListener('input', () => {
      updateSaveButton();
      const counter = document.getElementById('tx-title-counter');
      if (counter) counter.textContent = `${titleInput.value.length} / 40`;
    });
    // Prevent numpad key events from leaking into the text field
    titleInput.addEventListener('keydown', e => e.stopPropagation());
  }

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  // Transfer slider sync (0–100% of main balance)
  const slider = document.getElementById('transfer-slider');
  const transferInput = document.getElementById('transfer-amount');
  if (slider && transferInput) {
    slider.addEventListener('input', () => {
      const pct = slider.value / 100;
      const amount = Math.round(state.balance * pct * 100) / 100;
      transferInput.value = amount > 0 ? amount.toFixed(2) : '';
    });
  }
  // Keep the slider max label in sync when input is typed manually
  if (transferInput) {
    transferInput.addEventListener('input', () => {
      const maxLabel = document.getElementById('slider-max');
      if (maxLabel) maxLabel.textContent = `$${formatCurrency(state.balance)}`;
    });
  }

  // Quick actions
  document.querySelectorAll('.action-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action === 'send' || action === 'pay') {
        state.addType = 'expense';
        openAddSheet();
      } else if (action === 'request') {
        state.addType = 'income';
        openAddSheet();
      } else if (action === 'more') {
        switchView('transactions');
      }
    });
  });

  // Update time every minute
  updateTime();
  setInterval(updateTime, 60000);

  // Initial render
  renderHome();

  // Animate in
  document.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.animationDelay = `${i * 60}ms`;
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
