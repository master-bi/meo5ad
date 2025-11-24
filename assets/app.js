
// Header shrink effect
(function () {
  const header = document.querySelector("header.site");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    if (y < 40) {
      header.classList.remove("compact");
      lastY = y;
      return;
    }

    if (y > lastY + 6) {
      header.classList.add("compact");
    } else if (y < lastY - 6) {
      header.classList.remove("compact");
    }

    lastY = y;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
