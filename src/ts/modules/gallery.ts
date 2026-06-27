import { appState } from '../config.js';
import { openLightbox } from './lightbox.js';

export function initGallery(): void {
  const filterBtns = document.querySelectorAll<HTMLElement>('.filter-btn');
  const items = document.querySelectorAll<HTMLElement>('.portfolio-item');
  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e: MouseEvent) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      const target = e.target as HTMLElement;
      target.classList.add('active');
      
      const filter = target.dataset.filter;
      if (filter) {
        appState.currentFilter = filter;
        
        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
            item.style.display = '';
          } else {
            item.classList.add('hidden');
          }
        });
      }
    });
  });

  const portfolioImages = document.querySelectorAll<HTMLImageElement>('.portfolio-item img');
  portfolioImages.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      if (src) openLightbox(src);
    });
  });
  
  const portfolioInfos = document.querySelectorAll<HTMLElement>('.portfolio-info');
  portfolioInfos.forEach(info => {
    info.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const parent = target.closest('.portfolio-item');
      if (parent) {
        const img = parent.querySelector('img');
        if (img) {
          const src = img.getAttribute('src');
          if (src) openLightbox(src);
        }
      }
    });
  });
}
