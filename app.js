/**
 * Prime Acabamentos - Scripts Principais
 * Design System B2C focado em usabilidade e performance.
 */

// 1. Configurações Globais (Fácil alteração)
const CONFIG = {
  // Número do WhatsApp (Substitua pelo número real do cliente)
  whatsappNumber: '5511999999999', 
  // Mensagem padrão do WhatsApp
  whatsappGreeting: 'Olá, Prime Acabamentos! Vim pelo site e gostaria de um orçamento.'
};

// 2. Estado do Aplicativo
const appState = {
  currentFilter: 'all'
};



document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initGallery();
  initLightbox();
  initCalculator();
});

/**
 * Animação de entrada (Fade-in e Slide-up estilo Apple)
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Dispara quando 15% do elemento estiver visível
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Uma vez animado, paramos de observar para manter a performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(element => observer.observe(element));
}

/**
 * Comportamento do Header com Glassmorphism
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * Galeria de Portfólio Dinâmica
 */

function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Atualiza classe active nos botões
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const filter = e.target.dataset.filter;
      appState.currentFilter = filter;
      
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          // Remover classe hidden e limpar o display inline
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          // Adicionar classe hidden
          item.classList.add('hidden');
        }
      });
    });
  });
}


/**
 * Lightbox (Modal de visualização de imagem com Swipe e Zoom)
 */
let lightbox, lightboxImg, lightboxClose, lightboxNext, lightboxPrev;
let currentImages = [];
let currentIndex = 0;
let isZoomed = false;

function initLightbox() {
  lightbox = document.getElementById('lightbox');
  lightboxImg = document.getElementById('lightbox-img');
  lightboxClose = document.getElementById('lightbox-close');
  lightboxNext = document.getElementById('lightbox-next');
  lightboxPrev = document.getElementById('lightbox-prev');

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    // Fecha apenas se clicar na área escura (fora da imagem ou botões)
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  if(lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  if(lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  // Fecha com a tecla ESC e navega com Setas
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Funcionalidade de Expandir (Zoom)
  lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleZoom();
  });

  // Suporte a Swipe no Mobile (Arrastar para o lado)
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
    if (isZoomed) return; // Não troca de foto se estiver com zoom
    const threshold = 50; // Distância mínima para validar o arrasto
    if (touchEndX < touchStartX - threshold) nextImage();
    if (touchEndX > touchStartX + threshold) prevImage();
  }
}

function openLightbox(src) {
  // Puxa as imagens apenas da galeria filtrada (que não estão .hidden)
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
  document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
}

function updateLightboxImage() {
  lightboxImg.src = currentImages[currentIndex];
  if(isZoomed) toggleZoom(); // Reseta zoom ao trocar de imagem
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
  if(isZoomed) toggleZoom(); // Reseta estado do zoom
  // Limpa o src após a animação fechar para evitar flicker na próxima vez
  setTimeout(() => { lightboxImg.src = ''; }, 400); 
}

/**
 * Calculadora de Orçamento (Envio via WhatsApp)
 */
function initCalculator() {
  // Configuração dos Labels customizados de Radio
  const setupRadioGroups = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const options = container.querySelectorAll('.calc-option');
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        // Remove 'selected' dos irmãos
        options.forEach(opt => opt.classList.remove('selected'));
        // Adiciona ao atual
        option.classList.add('selected');
        // Marca o input interno como checked (importante caso o label não dispare o input sozinho)
        const input = option.querySelector('input[type="radio"]');
        if (input) {
          input.checked = true;
          // Dispara evento para que listeners manuais (como o de mostrar/esconder a caixa de detalhes) detectem a mudança
          input.dispatchEvent(new Event('change'));
        }
      });
    });
  };

  setupRadioGroups('mat-options');
  setupRadioGroups('room-options');

  // Controle de visibilidade do campo "Personalizado"
  const matOptions = document.querySelectorAll('input[name="material"]');
  const customDetailsWrapper = document.getElementById('custom-details-wrapper');
  
  matOptions.forEach(opt => {
    opt.addEventListener('change', (e) => {
      if (e.target.value === 'Projeto Personalizado / Especial') {
        customDetailsWrapper.style.display = 'block';
      } else {
        customDetailsWrapper.style.display = 'none';
      }
    });
  });

  // Slider de Metragem e Opção "Não sei"
  const slider = document.getElementById('size-slider');
  const sizeDisplay = document.getElementById('size-display');
  const sizeUnknown = document.getElementById('size-unknown');
  const sizeWrapper = document.getElementById('size-wrapper');
  
  if (slider && sizeDisplay) {
    slider.addEventListener('input', (e) => {
      sizeDisplay.textContent = e.target.value;
      // Se mexer no slider, desmarca o "não sei"
      if (sizeUnknown) {
        sizeUnknown.checked = false;
        sizeWrapper.style.opacity = '1';
      }
    });
  }

  if (sizeUnknown && sizeWrapper) {
    sizeUnknown.addEventListener('change', (e) => {
      if(e.target.checked) {
        sizeWrapper.style.opacity = '0.4';
        sizeWrapper.style.pointerEvents = 'none'; // Desabilita interação
      } else {
        sizeWrapper.style.opacity = '1';
        sizeWrapper.style.pointerEvents = 'auto';
      }
    });
  }

  // Botão Enviar WhatsApp
  const btnSend = document.getElementById('btn-send-whatsapp');
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const materialEl = document.querySelector('input[name="material"]:checked');
      const roomEl = document.querySelector('input[name="room"]:checked');
      const customDetailsInput = document.getElementById('custom-details-input');
      const isSizeUnknown = sizeUnknown ? sizeUnknown.checked : false;

      const material = materialEl ? materialEl.value : 'Não definido';
      const room = roomEl ? roomEl.value : 'Ainda não definido';
      const size = isSizeUnknown ? 'Ainda não sei medir' : `${slider.value} m²`;

      let materialText = material;
      const isCustom = materialEl && materialEl.value === 'Projeto Personalizado / Especial';
      if (isCustom && customDetailsInput && customDetailsInput.value.trim() !== '') {
        materialText += `\n- *Ideia/Detalhes do projeto:* ${customDetailsInput.value.trim()}`;
      }

      const message = `${CONFIG.whatsappGreeting}

*Detalhes do meu projeto:*
- *Acabamento:* ${materialText}
- *Ambiente:* ${room}
- *Tamanho:* ${size}

Poderiam me passar uma estimativa de valor ou agendar uma visita?`;

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
      
      // Abre a URL em uma nova aba
      window.open(waUrl, '_blank');
    });
  }
}
