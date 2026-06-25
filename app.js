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
 * Lightbox (Modal de visualização de imagem)
 */
let lightbox, lightboxImg, lightboxClose;

function initLightbox() {
  lightbox = document.getElementById('lightbox');
  lightboxImg = document.getElementById('lightbox-img');
  lightboxClose = document.getElementById('lightbox-close');

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox(); // Fecha ao clicar fora da imagem
  });
  
  // Fecha com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Limpa o src após a animação fechar
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
        if (input) input.checked = true;
      });
    });
  };

  setupRadioGroups('mat-options');
  setupRadioGroups('room-options');

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
      const isSizeUnknown = sizeUnknown ? sizeUnknown.checked : false;

      const material = materialEl ? materialEl.value : 'Não definido';
      const room = roomEl ? roomEl.value : 'Ainda não definido';
      const size = isSizeUnknown ? 'Não sei informar' : `${slider.value} m²`;

      const message = `${CONFIG.whatsappGreeting}

*Detalhes do meu projeto:*
- *Acabamento:* ${material}
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
