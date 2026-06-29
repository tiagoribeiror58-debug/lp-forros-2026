let lightbox: HTMLElement | null = null;
let lightboxImg: HTMLImageElement | null = null;
let lightboxClose: HTMLElement | null = null;
let lightboxNext: HTMLElement | null = null;
let lightboxPrev: HTMLElement | null = null;

let currentImages: string[] = [];
let currentIndex: number = 0;
let isZoomed: boolean = false;

export function initLightbox(): void {
  lightbox = document.getElementById('lightbox');
  if (!lightbox) return; 

  lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  lightboxClose = document.getElementById('lightbox-close');
  lightboxNext = document.getElementById('lightbox-next');
  lightboxPrev = document.getElementById('lightbox-prev');

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target === lightbox || target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  if(lightboxNext) lightboxNext.addEventListener('click', (e: MouseEvent) => { e.stopPropagation(); nextImage(); });
  if(lightboxPrev) lightboxPrev.addEventListener('click', (e: MouseEvent) => { e.stopPropagation(); prevImage(); });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  if (lightboxImg) {
    lightboxImg.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      toggleZoom();
    });
  }

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  lightbox.addEventListener('touchend', (e: TouchEvent) => {
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

export function openLightbox(src: string): void {
  if (!lightbox || !lightboxImg) return;
  const visibleItems = Array.from(document.querySelectorAll<HTMLImageElement>('.portfolio-item:not(.hidden) img'));
  
  if(visibleItems.length === 0) {
    currentImages = [src];
    currentIndex = 0;
  } else {
    currentImages = visibleItems.map(img => img.getAttribute('src') || '');
    currentIndex = currentImages.indexOf(src);
    // Se a imagem não for encontrada no portfolio (ex: clicou no catálogo), cria galeria isolada
    if(currentIndex === -1) {
      currentImages = [src];
      currentIndex = 0;
    }
  }

  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}

function updateLightboxImage(): void {
  if (!lightboxImg) return;
  lightboxImg.src = currentImages[currentIndex];
  if(isZoomed) toggleZoom(); 
}

function nextImage(): void {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightboxImage();
}

function prevImage(): void {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxImage();
}

function toggleZoom(): void {
  if (!lightboxImg) return;
  isZoomed = !isZoomed;
  if(isZoomed) {
    lightboxImg.classList.add('zoomed');
  } else {
    lightboxImg.classList.remove('zoomed');
  }
}

function closeLightbox(): void {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if(isZoomed) toggleZoom();
  setTimeout(() => { 
    if (lightboxImg) lightboxImg.src = ''; 
  }, 400); 
}
