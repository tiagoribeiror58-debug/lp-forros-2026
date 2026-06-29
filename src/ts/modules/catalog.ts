import { openLightbox } from './lightbox.js';

export function initCatalogTabs(): void {
  const tabBtns = document.querySelectorAll<HTMLElement>('.catalog-tab-btn');
  const catalogSections = document.querySelectorAll<HTMLElement>('.catalog-section');
  
  if (tabBtns.length > 0) {
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

  // Lightbox for catalog cards
  const catalogImages = document.querySelectorAll<HTMLImageElement>('.catalog-card-img img');
  catalogImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      if (src) openLightbox(src);
    });
  });
}
