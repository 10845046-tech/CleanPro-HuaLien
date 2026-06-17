/* ==========================================
   SERVICE DETAIL PANEL LOGIC
   CleanPro Hualien
   ==========================================
   When user clicks a service card/image,
   a side panel slides in with:
   - Photo gallery of that service
   - What's included list
   - Step-by-step process
   - Pricing breakdown
   - Call-to-action buttons
   ========================================== */

'use strict';

/* ------------------------------------------
   SERVICE DATA
   ------------------------------------------ */
const SERVICE_DATA = {
  hotel: {
    icon: '🛏️',
    title: { en: 'Hotel Room Cleaning', zh: '飯店客房清潔' },
    subtitle: { en: 'For Hotels, Motels & Guesthouses', zh: '適用於飯店、汽車旅館及民宿' },
    photos: [
      { src: 'images/cleaning-hotel.png', alt: 'Hotel room being cleaned', wide: true },
      { src: 'images/hotel-detail-1.png', alt: 'Fresh bed linen prepared by housekeeper' },
      { src: 'images/hotel-detail-2.png', alt: 'Hotel bathroom sanitization' },
    ],
    features: [
      { icon: '🛏️', text: { en: 'Bed making & linen change', zh: '鋪床及床單更換' } },
      { icon: '🚿', text: { en: 'Bathroom deep sanitization', zh: '衛浴深度消毒' } },
      { icon: '🧹', text: { en: 'Vacuuming & mopping floors', zh: '吸塵及拖地' } },
      { icon: '🗑️', text: { en: 'Trash removal & restocking', zh: '垃圾清除及補充備品' } },
      { icon: '🪟', text: { en: 'Window & mirror cleaning', zh: '窗戶及鏡子清潔' } },
      { icon: '🌸', text: { en: 'Air freshening & odour removal', zh: '空氣清新及除臭' } },
      { icon: '🧴', text: { en: 'Amenity restocking', zh: '補充備品' } },
      { icon: '⚡', text: { en: 'Fast turnaround (45–60 min)', zh: '快速翻房（45–60分鐘）' } },
    ],
    steps: [
      { title: { en: 'Schedule & Arrival', zh: '排程與到達' }, desc: { en: 'Our team arrives on time and checks in with your front desk.', zh: '我們的團隊準時到達，並與您的前台確認。' } },
      { title: { en: 'Strip & Remove', zh: '拆卸及清除' }, desc: { en: 'Remove used linens, towels, trash, and used amenities.', zh: '拆除使用過的床單、毛巾、垃圾及舊備品。' } },
      { title: { en: 'Deep Clean Bathroom', zh: '衛浴深度清潔' }, desc: { en: 'Scrub toilet, sink, shower, and tiles with hospital-grade disinfectant.', zh: '用醫療級消毒劑清洗馬桶、洗手盆、淋浴間及瓷磚。' } },
      { title: { en: 'Room Cleaning', zh: '房間清潔' }, desc: { en: 'Vacuum, mop, wipe all surfaces, dust furniture and make the bed.', zh: '吸塵、拖地、擦拭所有表面、清除家具灰塵並鋪床。' } },
      { title: { en: 'Restock & Final Check', zh: '補充及最終檢查' }, desc: { en: 'Restock amenities, do a quality walkthrough, and report to management.', zh: '補充備品，進行品質巡查，並向管理層報告。' } },
    ],
    pricing: [
      { name: { en: 'Standard Room', zh: '標準客房' }, price: 'NT$250', unit: { en: '/room', zh: '/間' } },
      { name: { en: 'Deluxe Room', zh: '豪華客房' }, price: 'NT$350', unit: { en: '/room', zh: '/間' }, featured: true },
      { name: { en: 'Suite', zh: '套房' }, price: 'NT$500', unit: { en: '/room', zh: '/間' } },
      { name: { en: 'Monthly Package (20+ rooms)', zh: '月租方案（20間以上）', }, price: 'NT$4,500', unit: { en: '/month', zh: '/月' } },
    ],
  },

  home: {
    icon: '🏠',
    title: { en: 'Home Cleaning', zh: '住宅清潔' },
    subtitle: { en: 'For Apartments, Houses & Condos', zh: '適用於公寓、住宅及大廈' },
    photos: [
      { src: 'images/home-cleaning.png', alt: 'Professional home cleaning service', wide: true },
      { src: 'images/home-detail-1.png', alt: 'Living room vacuuming service' },
      { src: 'images/home-detail-2.png', alt: 'Kitchen deep cleaning' },
    ],
    features: [
      { icon: '🛋️', text: { en: 'Living room & bedrooms', zh: '客廳及臥室清潔' } },
      { icon: '🍳', text: { en: 'Kitchen deep cleaning', zh: '廚房深度清潔' } },
      { icon: '🚿', text: { en: 'Bathroom scrubbing', zh: '衛浴徹底刷洗' } },
      { icon: '🪟', text: { en: 'Window interior cleaning', zh: '室內窗戶清潔' } },
      { icon: '🧹', text: { en: 'Mopping all hard floors', zh: '所有硬地板拖地' } },
      { icon: '📦', text: { en: 'Organizing & decluttering', zh: '整理及收納' } },
      { icon: '🌿', text: { en: 'Eco-friendly products available', zh: '可使用環保清潔劑' } },
      { icon: '📅', text: { en: 'Flexible weekly / biweekly plans', zh: '靈活的每週/雙週方案' } },
    ],
    steps: [
      { title: { en: 'Consultation & Quote', zh: '諮詢及報價' }, desc: { en: 'We assess your home size and specific cleaning needs, then provide a transparent quote.', zh: '我們評估您的家居大小及特定清潔需求，然後提供透明報價。' } },
      { title: { en: 'Scheduling', zh: '排程' }, desc: { en: 'Choose a convenient time slot. We offer morning, afternoon, and evening availability.', zh: '選擇方便的時間段。我們提供早上、下午及晚上的服務。' } },
      { title: { en: 'Systematic Cleaning', zh: '系統性清潔' }, desc: { en: 'Our team works room by room, top-to-bottom, ensuring nothing is missed.', zh: '我們的團隊逐間房間、由上至下進行清潔，確保不遺漏任何地方。' } },
      { title: { en: 'Quality Inspection', zh: '品質檢查' }, desc: { en: 'Supervisor does a final walkthrough and addresses any concerns immediately.', zh: '主管進行最終巡查，並立即處理任何問題。' } },
    ],
    pricing: [
      { name: { en: 'Studio (< 30m²)', zh: '套房（30平米以下）' }, price: 'NT$2,000', unit: { en: '/visit', zh: '/次' } },
      { name: { en: '2-Bedroom (30–60m²)', zh: '兩房（30–60平米）' }, price: 'NT$3,000', unit: { en: '/visit', zh: '/次' }, featured: true },
      { name: { en: '3-Bedroom (60–90m²)', zh: '三房（60–90平米）' }, price: 'NT$4,000', unit: { en: '/visit', zh: '/次' } },
      { name: { en: 'Large Home (90m²+)', zh: '大型住宅（90平米以上）' }, price: 'NT$5,500+', unit: { en: '/visit', zh: '/次' } },
    ],
  },

  deep: {
    icon: '✨',
    title: { en: 'Deep Cleaning', zh: '深度清潔' },
    subtitle: { en: 'Thorough Top-to-Bottom Cleaning', zh: '徹底由頂至底全面清潔' },
    photos: [
      { src: 'images/motel.png', alt: 'Deep cleaning preparation', wide: true },
      { src: 'images/deep-detail-1.png', alt: 'Professional bathroom deep cleaning' },
      { src: 'images/deep-detail-2.png', alt: 'AC unit deep cleaning service' },
    ],
    features: [
      { icon: '🧽', text: { en: 'Carpet shampooing & steaming', zh: '地毯洗滌及蒸氣清潔' } },
      { icon: '🛋️', text: { en: 'Sofa & upholstery cleaning', zh: '沙發及布面深度清潔' } },
      { icon: '❄️', text: { en: 'AC unit full service', zh: '冷氣機全面清洗' } },
      { icon: '🍳', text: { en: 'Oven & appliance cleaning', zh: '烤箱及電器清潔' } },
      { icon: '🦠', text: { en: 'Hospital-grade disinfection', zh: '醫療級全面消毒' } },
      { icon: '🕳️', text: { en: 'Hard-to-reach areas', zh: '難以清潔的角落' } },
      { icon: '💧', text: { en: 'Tile grout & mould removal', zh: '瓷磚縫及霉菌清除' } },
      { icon: '🏗️', text: { en: 'Post-renovation cleaning', zh: '裝修後清潔' } },
    ],
    steps: [
      { title: { en: 'Assessment & Plan', zh: '評估及計劃' }, desc: { en: 'We inspect your property and create a customized deep cleaning checklist.', zh: '我們檢查您的物業，並制定定制的深度清潔清單。' } },
      { title: { en: 'Preparation', zh: '準備工作' }, desc: { en: 'Set up professional equipment including steam cleaners, HEPA vacuums, and extraction machines.', zh: '設置專業設備，包括蒸氣清潔機、HEPA吸塵器及提取機。' } },
      { title: { en: 'Deep Cleaning Begins', zh: '開始深度清潔' }, desc: { en: 'Systematic deep clean of every surface, corner, and fixture from ceiling to floor.', zh: '從天花板到地板，對每個表面、角落及裝置進行系統性深度清潔。' } },
      { title: { en: 'Sanitization', zh: '消毒處理' }, desc: { en: 'Apply hospital-grade disinfectants to all high-touch surfaces and bathrooms.', zh: '對所有高頻接觸表面及衛浴施用醫療級消毒劑。' } },
      { title: { en: 'Final Inspection', zh: '最終檢查' }, desc: { en: 'Detailed walkthrough with client to ensure 100% satisfaction before we leave.', zh: '與客戶進行詳細巡查，確保100%滿意後離開。' } },
    ],
    pricing: [
      { name: { en: 'Studio / 1-Bed', zh: '套房 / 一房' }, price: 'NT$5,000', unit: { en: '/session', zh: '/次' } },
      { name: { en: '2–3 Bedroom', zh: '兩房至三房' }, price: 'NT$8,000', unit: { en: '/session', zh: '/次' }, featured: true },
      { name: { en: 'Large Property', zh: '大型物業' }, price: 'NT$12,000+', unit: { en: '/session', zh: '/次' } },
      { name: { en: 'Post-Renovation', zh: '裝修後清潔' }, price: 'NT$15,000+', unit: { en: '/session', zh: '/次' } },
    ],
  },
};

/* ------------------------------------------
   OPEN / CLOSE SERVICE DETAIL PANEL
   ------------------------------------------ */
let currentService = null;

function openServiceDetail(serviceKey) {
  const data = SERVICE_DATA[serviceKey];
  if (!data) return;

  currentService = serviceKey;
  const lang = (typeof STATE !== 'undefined' ? STATE.lang : null) || localStorage.getItem('lang') || 'en';

  // Populate header
  document.getElementById('sdpIcon').textContent = data.icon;
  document.getElementById('sdpTitle').textContent = data.title[lang];
  document.getElementById('sdpSubtitle').textContent = data.subtitle[lang];

  // Populate gallery
  const gallery = document.getElementById('sdpGallery');
  gallery.innerHTML = data.photos.map(photo => `
    <div class="sdp-gallery-item${photo.wide ? ' wide' : ''}" onclick="openLightbox('${photo.src}', '${photo.alt}')">
      <img src="${photo.src}" alt="${photo.alt}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect width=%22400%22 height=%22300%22 fill=%22%23d4ede6%22/><text x=%22200%22 y=%22150%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%231e8c6a%22 text-anchor=%22middle%22 dy=%220.3em%22>CleanPro</text></svg>'" />
    </div>
  `).join('');

  // Populate features
  const features = document.getElementById('sdpFeatures');
  features.innerHTML = data.features.map(f => `
    <div class="sdp-feature-item">
      <div class="sdp-feature-icon">${f.icon}</div>
      <div class="sdp-feature-text">${f.text[lang]}</div>
    </div>
  `).join('');

  // Populate steps
  const steps = document.getElementById('sdpSteps');
  steps.innerHTML = data.steps.map((step, i) => `
    <div class="sdp-step">
      <div class="sdp-step-num">${i + 1}</div>
      <div class="sdp-step-content">
        <div class="sdp-step-title">${step.title[lang]}</div>
        <div class="sdp-step-desc">${step.desc[lang]}</div>
      </div>
    </div>
  `).join('');

  // Populate pricing
  const pricing = document.getElementById('sdpPricing');
  pricing.innerHTML = data.pricing.map(p => `
    <div class="sdp-pricing-item${p.featured ? ' featured' : ''}">
      <div class="sdp-pricing-item-name">${p.name[lang]}</div>
      <div class="sdp-pricing-item-price">${p.price}</div>
      <div class="sdp-pricing-item-unit">${p.unit[lang]}</div>
    </div>
  `).join('');

  // Re-apply lang to newly injected [data-en][data-zh] elements
  document.querySelectorAll('.service-detail-panel [data-en][data-zh]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Show panel + overlay
  document.getElementById('serviceDetailOverlay').classList.add('active');
  document.getElementById('serviceDetailPanel').classList.add('active');
  document.body.style.overflow = 'hidden';

  // Scroll panel to top
  document.getElementById('serviceDetailPanel').scrollTop = 0;
}

function closeServiceDetail() {
  document.getElementById('serviceDetailOverlay').classList.remove('active');
  document.getElementById('serviceDetailPanel').classList.remove('active');
  document.body.style.overflow = '';
  currentService = null;
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.querySelector('.img-lightbox.active')) {
      closeLightbox();
    } else if (document.getElementById('serviceDetailPanel').classList.contains('active')) {
      closeServiceDetail();
    }
  }
});

/* ------------------------------------------
   IMAGE LIGHTBOX
   ------------------------------------------ */
function openLightbox(src, alt) {
  // Create lightbox if it doesn't exist
  let lb = document.getElementById('imgLightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'img-lightbox';
    lb.id = 'imgLightbox';
    lb.innerHTML = `
      <div class="img-lightbox-close" onclick="closeLightbox()">✕</div>
      <img id="lightboxImg" src="" alt="" />
    `;
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.body.appendChild(lb);
  }

  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxImg').alt = alt;
  lb.classList.add('active');
}

function closeLightbox() {
  const lb = document.getElementById('imgLightbox');
  if (lb) lb.classList.remove('active');
}
