export function initCatalogTabs() {
  const tabBtns = document.querySelectorAll('.catalog-tab-btn');
  const catalogSections = document.querySelectorAll('.catalog-section');
  
  if (tabBtns.length === 0) return; // Não estamos na página do catálogo

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active de todos
      tabBtns.forEach(b => b.classList.remove('active'));
      catalogSections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
      });
      
      // Ativa o clicado
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.classList.add('active');
        targetSec.style.display = 'block';
      }
    });
  });
}
