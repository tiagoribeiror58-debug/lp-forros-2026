let lightbox, lightboxImg, lightboxClose, lightboxNext, lightboxPrev;
let currentImages = [];
let currentIndex = 0;
let isZoomed = false;

export function initLightbox() {
  lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // Proteção

  lightboxImg = document.getElementById('lightbox-img');
  lightboxClose = document.getElementById('lightbox-close');
  lightboxNext = document.getElementById('lightbox-next');
  lightboxPrev = document.getElementById('lightbox-prev');

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  if(lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  if(lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleZoom();
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});

  function handleSwipe() {
    if (isZoomed) return; 
    const threshold = 50; 
    if (touchEndX < touchStartX - threshold) nextImage();
    if (touchEndX > touchStartX + threshold) prevImage();
  }
}

export function openLightbox(src) {
  if (!lightbox) return;
  const visibleItems = Array.from(document.querySelectorAll('.portfolio-item:not(.hidden) img'));
  if(visibleItems.length === 0) {
    currentImages = [src];
    currentIndex = 0;
  } else {
    currentImages = visibleItems.map(img => img.getAttribute('src'));
    currentIndex = currentImages.indexOf(src);
    if(currentIndex === -1) currentIndex = 0;
  }

  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}

function updateLightboxImage() {
  lightboxImg.src = currentImages[currentIndex];
  if(isZoomed) toggleZoom(); 
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightboxImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxImage();
}

function toggleZoom() {
  isZoomed = !isZoomed;
  if(isZoomed) {
    lightboxImg.classList.add('zoomed');
  } else {
    lightboxImg.classList.remove('zoomed');
  }
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if(isZoomed) toggleZoom();
  setTimeout(() => { lightboxImg.src = ''; }, 400); 
}
