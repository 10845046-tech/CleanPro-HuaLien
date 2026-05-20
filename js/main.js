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
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Focus first input
  setTimeout(() => {
    const firstInput = overlay.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 300);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function switchModal(fromId, toId) {
  closeModal(fromId);
  setTimeout(() => openModal(toId), 200);
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
  }
});

/* ------------------------------------------
   TOAST NOTIFICATIONS
   ------------------------------------------ */
function showToast(msg, type = 'success', duration = 3500) {
  const toast = document.getElementById('toast');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, duration);
}

/* ------------------------------------------
   AUTH SYSTEM (localStorage demo)
   ------------------------------------------ */
function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName  = document.getElementById('regLastName').value.trim();
  const email     = document.getElementById('regEmail').value.trim().toLowerCase();
  const phone     = document.getElementById('regPhone').value.trim();
  const pass      = document.getElementById('regPassword').value;
  const passConf  = document.getElementById('regPasswordConfirm').value;

  if (pass !== passConf) {
    showToast(STATE.lang === 'zh' ? '密碼不一致，請重新確認。' : 'Passwords do not match.', 'error');
    return;
  }

  const existing = STATE.users.find(u => u.email === email);
  if (existing) {
    showToast(STATE.lang === 'zh' ? '此電子郵件已被註冊，請直接登入。' : 'This email is already registered. Please login.', 'error');
    return;
  }

  const newUser = { firstName, lastName, email, phone, pass };
  STATE.users.push(newUser);
  localStorage.setItem('cpUsers', JSON.stringify(STATE.users));

  // Auto login
  loginUser(newUser);
  closeModal('registerModal');
  document.getElementById('registerForm').reset();
  showToast(STATE.lang === 'zh' ? `歡迎加入，${firstName}！` : `Welcome, ${firstName}! Account created successfully.`);
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPassword').value;

  const user = STATE.users.find(u => u.email === email && u.pass === pass);
  if (!user) {
    showToast(STATE.lang === 'zh' ? '電子郵件或密碼錯誤，請再試一次。' : 'Incorrect email or password. Please try again.', 'error');
    return;
  }

  loginUser(user);
  closeModal('loginModal');
  document.getElementById('loginForm').reset();
  showToast(STATE.lang === 'zh' ? `歡迎回來，${user.firstName}！` : `Welcome back, ${user.firstName}!`);
}

function loginUser(user) {
  STATE.user = user;
  localStorage.setItem('cpUser', JSON.stringify(user));
  updateAuthUI();
}

function logout() {
  STATE.user = null;
  localStorage.removeItem('cpUser');
  updateAuthUI();
  toggleDropdown(true); // force close
  showToast(STATE.lang === 'zh' ? '已成功登出。' : 'You have been logged out.', 'info');
}

function updateAuthUI() {
  const isLoggedIn = !!STATE.user;
  document.getElementById('authButtons').style.display = isLoggedIn ? 'none' : 'flex';
  document.getElementById('userMenu').style.display   = isLoggedIn ? 'block' : 'none';

  // Booking section
  document.getElementById('bookingLocked').style.display = isLoggedIn ? 'none' : 'block';
  document.getElementById('bookingForm').style.display   = isLoggedIn ? 'block' : 'none';

  if (isLoggedIn) {
    const initials = (STATE.user.firstName[0] + (STATE.user.lastName?.[0] || '')).toUpperCase();
    document.getElementById('userAvatar').textContent   = initials;
    document.getElementById('dropdownName').textContent = `${STATE.user.firstName} ${STATE.user.lastName || ''}`.trim();
    document.getElementById('dropdownEmail').textContent = STATE.user.email;
  }
}

/* ------------------------------------------
   USER DROPDOWN
   ------------------------------------------ */
function toggleDropdown(forceClose = false) {
  const dropdown = document.getElementById('userDropdown');
  if (forceClose) {
    dropdown.classList.remove('open');
  } else {
    dropdown.classList.toggle('open');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  if (menu && !menu.contains(e.target)) {
    document.getElementById('userDropdown')?.classList.remove('open');
  }
});

/* ------------------------------------------
   PAYMENT OPTION SELECTION
   ------------------------------------------ */
function selectPayment(label) {
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  label.classList.add('selected');
  const input = label.querySelector('input');
  if (input) input.checked = true;
}

/* ------------------------------------------
   BOOKING FORM
   ------------------------------------------ */
// Set minimum date to today
const bookDateInput = document.getElementById('bookDate');
if (bookDateInput) {
  const today = new Date().toISOString().split('T')[0];
  bookDateInput.min = today;
  bookDateInput.value = today;
}

function submitBooking(e) {
  e.preventDefault();

  if (!STATE.user) {
    openModal('loginModal');
    return;
  }

  const serviceType = document.getElementById('bookServiceType').value;
  const date        = document.getElementById('bookDate').value;
  const time        = document.getElementById('bookTime').value;
  const address     = document.getElementById('bookAddress').value.trim();
  const contact     = document.getElementById('bookContact').value.trim();
  const notes       = document.getElementById('bookNotes').value.trim();
  const payment     = document.querySelector('input[name="payment"]:checked');

  if (!serviceType || !date || !time || !address || !contact) {
    showToast(STATE.lang === 'zh' ? '請填寫所有必填欄位。' : 'Please fill in all required fields.', 'error');
    return;
  }

  if (!payment) {
    showToast(STATE.lang === 'zh' ? '請選擇付款方式。' : 'Please select a payment method.', 'error');
    return;
  }

  // Save booking to localStorage
  const booking = {
    id: Date.now(),
    user: STATE.user.email,
    serviceType, date, time, address, contact,
    payment: payment.value,
    notes,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const bookings = JSON.parse(localStorage.getItem('cpBookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('cpBookings', JSON.stringify(bookings));

  // Reset form
  document.getElementById('mainBookingForm').reset();
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  bookDateInput.value = new Date().toISOString().split('T')[0];

  const successMsg = STATE.lang === 'zh'
    ? '✅ 預約成功！我們將盡快與您聯繫確認。'
    : '✅ Booking received! We\'ll contact you shortly to confirm.';
  showToast(successMsg, 'success', 5000);
}

/* ------------------------------------------
   CONTACT FORM
   ------------------------------------------ */
function submitContact(e) {
  e.preventDefault();

  const name    = document.getElementById('contactName').value.trim();
  const phone   = document.getElementById('contactPhone').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();

  // Save to localStorage (demo)
  const messages = JSON.parse(localStorage.getItem('cpMessages') || '[]');
  messages.push({ name, phone, email, subject, message, sentAt: new Date().toISOString() });
  localStorage.setItem('cpMessages', JSON.stringify(messages));

  document.getElementById('contactForm').reset();

  const successMsg = STATE.lang === 'zh'
    ? '✅ 訊息已送出！我們將於24小時內回覆您。'
    : '✅ Message sent! We\'ll reply within 24 hours.';
  showToast(successMsg, 'success', 5000);
}

/* ------------------------------------------
   SMOOTH SCROLL for anchor links
   ------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ------------------------------------------
   INIT
   ------------------------------------------ */
function init() {
  // Apply saved language
  setLang(STATE.lang);
  // Restore auth state
  updateAuthUI();
  // Trigger scroll once to set navbar state
  window.dispatchEvent(new Event('scroll'));
}

init();
