export function initCatalogTabs(): void {
  const tabBtns = document.querySelectorAll<HTMLElement>('.catalog-tab-btn');
  const catalogSections = document.querySelectorAll<HTMLElement>('.catalog-section');
  
  if (tabBtns.length === 0) return; 

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      catalogSections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
      });
      
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const targetSec = document.getElementById(targetId);
        if (targetSec) {
          targetSec.classList.add('active');
          targetSec.style.display = 'block';
        }
      }
    });
  });
}
