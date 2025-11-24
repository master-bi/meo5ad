
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
