/* ==========================================
   CLEANPRO HUALIEN — MAIN JAVASCRIPT
   ==========================================
   Features:
   - Bilingual toggle (EN / 繁體中文)
   - Navbar scroll effect + mobile menu
   - Scroll animation observer
   - Member auth (localStorage-based demo)
   - Modal open/close system
   - Booking form logic
   - Contact form submission
   - Toast notifications
   - Payment option selection
   ========================================== */

'use strict';

/* ------------------------------------------
   STATE
   ------------------------------------------ */
const STATE = {
  lang: localStorage.getItem('lang') || 'en',
  user: JSON.parse(localStorage.getItem('cpUser') || 'null'),
  users: JSON.parse(localStorage.getItem('cpUsers') || '[]'),
};

/* ------------------------------------------
   LANGUAGE SYSTEM
   ------------------------------------------ */
function setLang(lang) {
  STATE.lang = lang;
  localStorage.setItem('lang', lang);

  // Toggle body class for font
  document.body.classList.toggle('lang-zh', lang === 'zh');

  // Update lang buttons
  document.getElementById('btnEN').classList.toggle('active', lang === 'en');
  document.getElementById('btnZH').classList.toggle('active', lang === 'zh');

  // Update HTML lang attribute
  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';

  // Update all elements with data-en / data-zh
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Update all select options
  document.querySelectorAll('option[data-en][data-zh]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Update placeholder text for inputs that need it
  updatePlaceholders(lang);
}

function updatePlaceholders(lang) {
  const map = {
    bookAddress: { en: 'Hualien City...', zh: '花蓮市...' },
    bookContact: { en: 'Phone / Line ID / WhatsApp', zh: '電話 / Line ID / WhatsApp' },
    bookNotes: { en: 'Any special requests...', zh: '特殊需求或備註...' },
    contactName: { en: 'John / 王小明', zh: '王小明' },
    contactPhone: { en: '09xx-xxx-xxx', zh: '09xx-xxx-xxx' },
    contactMessage: { en: 'Type your message here...', zh: '請輸入您的訊息...' },
  };
  Object.entries(map).forEach(([id, vals]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = vals[lang];
  });
}

/* ------------------------------------------
   NAVBAR
   ------------------------------------------ */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Update active nav link
  const sections = ['home', 'services', 'pricing', 'gallery', 'booking', 'contact'];
  let current = '';
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (sec && window.scrollY >= sec.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.replace('#', '');
    a.classList.toggle('active', href === current);
  });
});

function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ------------------------------------------
   SCROLL ANIMATIONS
   ------------------------------------------ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/* ------------------------------------------
   MODAL SYSTEM
   ------------------------------------------ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function handleModalBg(e, id) {
  if (e.target.id === id) closeModal(id);
}

/* ------------------------------------------
   AUTH SYSTEM
   ------------------------------------------ */
function updateAuthUI() {
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userAvatar = document.getElementById('userAvatar');
  const dropdownName = document.getElementById('dropdownName');
  const dropdownEmail = document.getElementById('dropdownEmail');

  if (STATE.user) {
    authButtons.style.display = 'none';
    userMenu.style.display = 'block';
    userAvatar.textContent = STATE.user.name.charAt(0).toUpperCase();
    dropdownName.textContent = STATE.user.name;
    dropdownEmail.textContent = STATE.user.email;
  } else {
    authButtons.style.display = 'flex';
    userMenu.style.display = 'none';
  }
}

function toggleDropdown() {
  document.getElementById('userDropdown').classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('open');
  }
});

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const found = STATE.users.find(u => u.email === email && u.password === password);
  if (!found) {
    showToast(STATE.lang === 'zh' ? '帳號或密碼錯誤' : 'Invalid email or password', 'error');
    return;
  }
  STATE.user = found;
  localStorage.setItem('cpUser', JSON.stringify(found));
  updateAuthUI();
  closeModal('loginModal');
  showToast(STATE.lang === 'zh' ? `歡迎回來，${found.name}！` : `Welcome back, ${found.name}!`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  if (STATE.users.find(u => u.email === email)) {
    showToast(STATE.lang === 'zh' ? '此電子郵件已被使用' : 'Email already registered', 'error');
    return;
  }
  const newUser = { name, email, password };
  STATE.users.push(newUser);
  localStorage.setItem('cpUsers', JSON.stringify(STATE.users));
  STATE.user = newUser;
  localStorage.setItem('cpUser', JSON.stringify(newUser));
  updateAuthUI();
  closeModal('registerModal');
  showToast(STATE.lang === 'zh' ? `歡迎，${name}！` : `Welcome, ${name}!`, 'success');
}

function logout() {
  STATE.user = null;
  localStorage.removeItem('cpUser');
  updateAuthUI();
  showToast(STATE.lang === 'zh' ? '已成功登出' : 'Logged out successfully');
}

/* ------------------------------------------
   BOOKING FORM
   ------------------------------------------ */
function handleBooking(e) {
  e.preventDefault();
  const service = document.getElementById('bookService').value;
  const date = document.getElementById('bookDate').value;
  const address = document.getElementById('bookAddress').value.trim();
  const contact = document.getElementById('bookContact').value.trim();

  if (!date || !address || !contact) {
    showToast(STATE.lang === 'zh' ? '請填寫所有必填欄位' : 'Please fill in all required fields', 'error');
    return;
  }

  const serviceNames = {
    hotel: { en: 'Hotel Room Cleaning', zh: '飯店客房清潔' },
    home: { en: 'Home Cleaning', zh: '住宅清潔' },
    deep: { en: 'Deep Cleaning', zh: '深度清潔' }
  };

  const serviceName = serviceNames[service][STATE.lang];
  showToast(
    STATE.lang === 'zh'
      ? `✅ 預約成功！${serviceName}已排定於 ${date}`
      : `✅ Booking confirmed! ${serviceName} on ${date}`,
    'success'
  );
  e.target.reset();
}

/* ------------------------------------------
   CONTACT FORM
   ------------------------------------------ */
function handleContact(e) {
  e.preventDefault();
  showToast(STATE.lang === 'zh' ? '✅ 訊息已發送！我們將盡快回覆您。' : '✅ Message sent! We\'ll get back to you soon.', 'success');
  e.target.reset();
}

/* ------------------------------------------
   TOAST NOTIFICATIONS
   ------------------------------------------ */
let toastTimer;
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ------------------------------------------
   INIT
   ------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  setLang(STATE.lang);
  updateAuthUI();

  // Set min date for booking to today
  const bookDate = document.getElementById('bookDate');
  if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.min = today;
  }
});
