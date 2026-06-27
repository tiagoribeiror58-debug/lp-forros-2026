import { appState } from '../config.js';
import { openLightbox } from './lightbox.js';

export function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const filter = e.target.dataset.filter;
      appState.currentFilter = filter;
      
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Bind lightbox clicks programmatically to avoid inline onclick issues with modules
  const portfolioImages = document.querySelectorAll('.portfolio-item img');
  portfolioImages.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.getAttribute('src'));
    });
  });
  
  const portfolioInfos = document.querySelectorAll('.portfolio-info');
  portfolioInfos.forEach(info => {
    info.addEventListener('click', (e) => {
      // Find the sibling image
      const parent = e.target.closest('.portfolio-item');
      if (parent) {
        const img = parent.querySelector('img');
        if (img) openLightbox(img.getAttribute('src'));
      }
    });
  });
}
