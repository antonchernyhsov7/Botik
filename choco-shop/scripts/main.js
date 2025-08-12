(function () {
  'use strict';

  const productList = [
    {
      id: 'dark-classic',
      name: 'Горький классический 72%',
      description: 'Чистый вкус какао без сахара. Идеален с эспрессо.',
      price: 320,
      category: 'dark',
      image: 'https://images.unsplash.com/photo-1493925410384-84f842e616fb?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'milk-hazelnut',
      name: 'Молочный с фундуком',
      description: 'Нежный молочный шоколад с обжаренным фундуком.',
      price: 350,
      category: 'milk',
      image: 'https://images.unsplash.com/photo-1511389026070-a14ae610a1be?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'white-vanilla',
      name: 'Белый ванильный',
      description: 'Тончайшая ваниль из Мадагаскара и сливочная текстура.',
      price: 340,
      category: 'white',
      image: 'https://images.unsplash.com/photo-1541781359449-1327c88fa6d1?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'orange-dark',
      name: 'Горький с апельсином',
      description: 'Цедра и натуральное масло апельсина для освежающего акцента.',
      price: 360,
      category: 'dark',
      image: 'https://images.unsplash.com/photo-1587653918252-70c4f86a18a7?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'caramel-salt',
      name: 'Молочный с солёной карамелью',
      description: 'Баланс сладкого и солёного, тянущаяся карамель.',
      price: 380,
      category: 'filled',
      image: 'https://images.unsplash.com/photo-1505575972945-2804b4e1d9c5?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'gift-set',
      name: 'Подарочный набор ассорти',
      description: '6 мини-плиток разных вкусов в фирменной коробке.',
      price: 990,
      category: 'set',
      image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'white-pistachio',
      name: 'Белый с фисташкой',
      description: 'Натуральные фисташки и сливочная нежность белого шоколада.',
      price: 390,
      category: 'white',
      image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'dark-almond',
      name: 'Горький с миндалём',
      description: 'Обжаренный миндаль и глубокий вкус какао-бобов.',
      price: 370,
      category: 'dark',
      image: 'https://images.unsplash.com/photo-1541781286675-4fa8b596ff96?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 'milk-raisin',
      name: 'Молочный с изюмом и орехами',
      description: 'Классическая комбинация, которая никогда не подводит.',
      price: 360,
      category: 'milk',
      image: 'https://images.unsplash.com/photo-1506878206813-92402b8ded23?q=80&w=1600&auto=format&fit=crop'
    }
  ];

  const currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

  const els = {
    productGrid: document.getElementById('productGrid'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    searchInput: document.getElementById('searchInput'),
    cartButton: document.getElementById('cartButton'),
    cartPanel: document.getElementById('cartPanel'),
    cartBackdrop: document.getElementById('cartBackdrop'),
    closeCart: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    cartCount: document.getElementById('cartCount'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    toast: document.getElementById('toast'),
    year: document.getElementById('year'),
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    contactForm: document.getElementById('contactForm')
  };

  const state = {
    filter: 'all',
    search: '',
    cart: loadCart()
  };

  function loadCart() {
    try {
      const raw = localStorage.getItem('chocoCart');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    localStorage.setItem('chocoCart', JSON.stringify(state.cart));
  }

  function setYear() {
    if (els.year) els.year.textContent = new Date().getFullYear();
  }

  function renderProducts() {
    const query = state.search.trim().toLowerCase();
    const filtered = productList.filter(p => {
      const byFilter = state.filter === 'all' ? true : p.category === state.filter;
      const byQuery = !query ? true : (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      return byFilter && byQuery;
    });

    if (!filtered.length) {
      els.productGrid.innerHTML = `<div class="empty">Ничего не найдено. Попробуйте изменить запрос.</div>`;
      return;
    }

    els.productGrid.innerHTML = filtered.map(p => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        </div>
        <div class="product-body">
          <h3 class="product-title">${escapeHtml(p.name)}</h3>
          <p class="product-desc">${escapeHtml(p.description)}</p>
        </div>
        <div class="product-footer">
          <div class="price">${currency.format(p.price)}</div>
          <button class="btn btn-primary add-to-cart" data-id="${p.id}">В корзину</button>
        </div>
      </article>
    `).join('');
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  function handleFilterClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('filter-btn')) return;
    els.filterButtons.forEach(b => b.classList.remove('active'));
    target.classList.add('active');
    state.filter = target.dataset.filter || 'all';
    renderProducts();
  }

  function handleSearchInput() {
    state.search = els.searchInput.value;
    renderProducts();
  }

  function addToCart(productId) {
    const product = productList.find(p => p.id === productId);
    if (!product) return;
    const currentQty = state.cart[productId]?.qty || 0;
    state.cart[productId] = { id: productId, qty: currentQty + 1 };
    saveCart();
    renderCart();
    showToast(`${product.name} добавлен в корзину`);
  }

  function removeFromCart(productId) {
    delete state.cart[productId];
    saveCart();
    renderCart();
  }

  function updateQty(productId, qty) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (!state.cart[productId]) return;
    state.cart[productId].qty = qty;
    saveCart();
    renderCart();
  }

  function calcCartTotals() {
    let total = 0;
    let count = 0;
    for (const key of Object.keys(state.cart)) {
      const item = state.cart[key];
      const product = productList.find(p => p.id === key);
      if (!product) continue;
      total += product.price * item.qty;
      count += item.qty;
    }
    return { total, count };
  }

  function renderCart() {
    const keys = Object.keys(state.cart);
    if (!keys.length) {
      els.cartItems.innerHTML = `<div class="empty">Ваша корзина пуста</div>`;
      els.cartTotal.textContent = currency.format(0);
      els.checkoutBtn.disabled = true;
      els.cartCount.textContent = '0';
      return;
    }

    const itemsHtml = keys.map(key => {
      const item = state.cart[key];
      const product = productList.find(p => p.id === key);
      if (!product) return '';
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" />
          <div>
            <div class="cart-item-title">${escapeHtml(product.name)}</div>
            <div class="cart-item-price">${currency.format(product.price)}</div>
          </div>
          <div class="cart-item-controls">
            <input class="qty-input" type="number" min="1" step="1" value="${item.qty}" data-id="${product.id}" aria-label="Количество" />
            <button class="icon-btn remove-item" data-id="${product.id}" aria-label="Удалить">🗑</button>
          </div>
        </div>
      `;
    }).join('');

    els.cartItems.innerHTML = itemsHtml;
    const { total, count } = calcCartTotals();
    els.cartTotal.textContent = currency.format(total);
    els.checkoutBtn.disabled = count === 0;
    els.cartCount.textContent = String(count);
  }

  function openCart() {
    els.cartPanel.hidden = false;
    renderCart();
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    els.cartPanel.hidden = true;
    document.body.style.overflow = '';
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      els.toast.hidden = true;
    }, 1800);
  }

  function attachEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.matches('.add-to-cart')) {
        addToCart(target.dataset.id);
      }
      if (target.matches('#cartButton')) {
        openCart();
      }
      if (target.matches('#closeCart') || target.matches('#cartBackdrop')) {
        closeCart();
      }
      if (target.matches('.remove-item')) {
        removeFromCart(target.dataset.id);
      }
      if (target.matches('.nav-toggle')) {
        const expanded = target.getAttribute('aria-expanded') === 'true';
        target.setAttribute('aria-expanded', String(!expanded));
        els.navMenu.classList.toggle('open');
      }
      if (target.closest('.nav-menu a')) {
        els.navMenu.classList.remove('open');
        const btn = document.querySelector('.nav-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('input', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches('.qty-input')) {
        const id = target.getAttribute('data-id');
        const value = Number(target.value);
        if (Number.isFinite(value)) updateQty(id, Math.max(0, Math.floor(value)));
      }
    });

    els.filterButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));
    els.searchInput.addEventListener('input', debounce(handleSearchInput, 150));

    if (els.contactForm) {
      els.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();
        let valid = true;

        clearErrors();
        if (!name) { setError('name', 'Укажите имя'); valid = false; }
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError('email', 'Введите корректный email'); valid = false; }
        if (message.length < 10) { setError('message', 'Минимум 10 символов'); valid = false; }

        if (!valid) return;
        showToast('Спасибо! Сообщение отправлено (симуляция)');
        form.reset();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.cartPanel.hidden) closeCart();
    });
  }

  function setError(field, message) {
    const el = document.querySelector(`.error[data-for="${field}"]`);
    if (el) el.textContent = message;
  }
  function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
  }

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function init() {
    setYear();
    renderProducts();
    renderCart();
    attachEvents();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();