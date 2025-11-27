
(function(){
  const input = document.querySelector('[data-search]');
  const resultsBox = document.querySelector('[data-search-results]');
  if(!input || !resultsBox) return;
  let pages = [];
  fetch('/search-index.json').then(r=>r.json()).then(j=>pages=j.pages||[]);
  function highlight(t, q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'ig');
    return t.replace(re, m=>`<mark>${m}</mark>`);
  }
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(q.length < 2) { resultsBox.innerHTML=''; resultsBox.style.display='none'; return; }
    const hits = pages.filter(p => (p.title+p.desc+p.tags.join(' ')).toLowerCase().includes(q)).slice(0,8);
    resultsBox.innerHTML = hits.map(h=>`
      <a href="${h.url}" style="display:block;padding:8px;border-radius:10px;text-decoration:none">
        <div style="font-weight:800">${highlight(h.title, q)}</div>
        <div style="font-size:12px;color:#6b7280">${highlight(h.desc, q)}</div>
      </a>
    `).join('');
    resultsBox.style.display = hits.length?'block':'none';
  });
})();

(function(){
  const REDIRECT_URL = document.body.dataset.redirect;
  const ctaFab = document.getElementById("ctaFab");
  const mask = document.getElementById("mask");
  const modal = document.getElementById("modal");
  const goBtn = document.getElementById("goBtn");
  const closeBtn = document.getElementById("closeBtn");
  if(!ctaFab) return;
  window.addEventListener("load", () => {
    setTimeout(() => { ctaFab.style.display = "inline-flex"; }, 2500);
  });
  function openModal(){ mask.style.display="block"; modal.style.display="block"; document.body.style.overflow="hidden"; }
  function closeModal(){ mask.style.display="none"; modal.style.display="none"; document.body.style.overflow=""; }
  ctaFab.addEventListener("click", openModal);
  mask.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  goBtn.addEventListener("click", () => window.location.href = REDIRECT_URL);
})();



// Language auto-redirect ONLY when no explicit language is set on <body>
(function(){
  const bodyLang = document.body.dataset.lang || "";
  if (bodyLang) return; // already in a language namespace
  const lang = (navigator.language||"").toLowerCase();
  const path = location.pathname;
  // run only on site root ("/" or "/index.html")
  if (!(path === "/" || path.endsWith("/index.html"))) return;

  if (lang.startsWith("en")) location.replace("/en/");
  else if (lang.startsWith("vi")) location.replace("/vi/");
  else if (lang.startsWith("ms")) location.replace("/ms/");
  else if (lang.startsWith("km")) location.replace("/km/");
  else if (lang.startsWith("zh-cn") || lang.startsWith("zh-sg") || lang.startsWith("zh-hans")) location.replace("/zh-hans/");
  else if (lang.includes("zh-hk") || lang.includes("yue")) location.replace("/yue/");
})();

// Dropdown toggles
(function(){
  function setupDropdown(sel){
    document.querySelectorAll(sel).forEach(dd=>{
      const btn=dd.querySelector('.dropdown-btn');
      if(!btn) return;
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        dd.classList.toggle('open');
        document.querySelectorAll(sel+'.open').forEach(o=>{ if(o!==dd) o.classList.remove('open'); });
      });
    });
  }
  setupDropdown('.dropdown');
  document.addEventListener('click', ()=>{
    document.querySelectorAll('.dropdown.open').forEach(dd=>dd.classList.remove('open'));
  });
})();

// CTA + modal multi-language text
(function(){
  const ctaFab = document.getElementById("ctaFab");
  const modal = document.getElementById("modal");
  const goBtn = document.getElementById("goBtn");
  const closeBtn = document.getElementById("closeBtn");
  if (!ctaFab || !modal || !goBtn || !closeBtn) return;

  var path = location.pathname || "/";
  var lang = "zh-Hant";
  if (path.indexOf("/en/") === 0) lang = "en";
  else if (path.indexOf("/vi/") === 0) lang = "vi";
  else if (path.indexOf("/ms/") === 0) lang = "ms";
  else if (path.indexOf("/km/") === 0) lang = "km";
  else if (path.indexOf("/zh-hans/") === 0) lang = "zh-Hans";
  else if (path.indexOf("/yue/") === 0) lang = "yue";

  var packs = {
    "zh-Hant": {
      cardButton: "前往官方入口",
      title: "準備好開始體驗了嗎？",
      body: "點擊下方按鈕進入官方入口，系統會依你的地區自動分流到合適站點。",
      primary: "進入官方入口",
      secondary: "我再看看"
    },
    "en": {
      cardButton: "Go to official entry",
      title: "Ready to start playing?",
      body: "Tap the button below to enter the official entry. We’ll automatically route you to the best site for your region.",
      primary: "Enter official site",
      secondary: "Maybe later"
    },
    "vi": {
      cardButton: "Vào cổng chính thức",
      title: "Sẵn sàng bắt đầu trải nghiệm chưa?",
      body: "Nhấn nút bên dưới để vào cổng chính thức, hệ thống sẽ tự động chuyển bạn tới trang phù hợp với khu vực của bạn.",
      primary: "Vào cổng chính thức",
      secondary: "Xem thêm đã"
    },
    "ms": {
      cardButton: "Masuk laman rasmi",
      title: "Sedia untuk mula bermain?",
      body: "Tekan butang di bawah untuk masuk ke laman rasmi. Sistem akan menghantar anda ke laman yang sesuai dengan kawasan anda secara automatik.",
      primary: "Masuk laman rasmi",
      secondary: "Nanti dulu"
    },
    "km": {
      cardButton: "ចូលទៅគេហទំព័រផ្លូវការ",
      title: "តើអ្នករួចរាល់ដើម្បីចាប់ផ្តើមបទពិសោធន៍ឬនៅ?",
      body: "ចុចប៊ូតុងខាងក្រោមដើម្បីចូលទៅកាន់ច្រកផ្លូវការ ប្រព័ន្ធនឹងបញ្ជូនអ្នកទៅគេហទំព័រដែលសមស្របតាមតំបន់របស់អ្នក។",
      primary: "ចូលផ្លូវការ",
      secondary: "មើលបន្តទៀតសិន"
    },
    "zh-Hans": {
      cardButton: "前往官网入口",
      title: "准备好开始体验了吗？",
      body: "点击下方按钮进入官网入口，系统会根据你的地区自动分流到适合站点。",
      primary: "进入官网入口",
      secondary: "再看看"
    },
    "yue": {
      cardButton: "前往官方入口",
      title: "準備好開始體驗未？",
      body: "撳下面個掣進入官方入口，系統會按你所在地區自動帶你去合適站點。",
      primary: "進入官方入口",
      secondary: "再睇一陣"
    }
  };

  var p = packs[lang] || packs["zh-Hant"];

  ctaFab.textContent = p.cardButton;
  ctaFab.setAttribute("aria-label", p.cardButton);

  var h4 = modal.querySelector("h4");
  var msg = modal.querySelector("p");
  if (h4) h4.textContent = p.title;
  if (msg) msg.textContent = p.body;

  goBtn.textContent = p.primary;
  closeBtn.textContent = p.secondary;
})();
