/**
 * MP Forros - Scripts Principais
 * Design System B2C focado em usabilidade e performance.
 */

// 1. Configurações Globais (Fácil alteração)
const CONFIG = {
  // Número do WhatsApp (Substitua pelo número real do cliente)
  whatsappNumber: '5511999999999', 
  // Mensagem padrão do WhatsApp
  whatsappGreeting: 'Olá, MP Forros! Vim pelo site e gostaria de um orçamento.'
};

// 2. Estado do Aplicativo
const appState = {
  currentFilter: 'all'
};

// 3. Imagens do Portfólio (Mapeadas da pasta local)
// Usando encodeURI para lidar com espaços no nome dos arquivos
const portfolioImages = [
  { file: 'WhatsApp Image 2026-06-17 at 18.27.19 (1).jpeg', category: 'pvc', title: 'Forro PVC' },
  { file: 'WhatsApp Image 2026-06-17 at 18.27.19.jpeg', category: 'gesso', title: 'Gesso Acartonado' },
  { file: 'WhatsApp Image 2026-06-17 at 18.27.20 (1).jpeg', category: 'madeira', title: 'Amadeirado' },
  { file: 'WhatsApp Image 2026-06-17 at 18.27.20 (2).jpeg', category: 'gesso', title: 'Sanca Iluminada' },
  { file: 'WhatsApp Image 2026-06-17 at 18.27.20 (3).jpeg', category: 'pvc', title: 'PVC Premium' },
  { file: 'WhatsApp Image 2026-06-17 at 18.27.20.jpeg', category: 'madeira', title: 'Estilo Rústico' },
  { file: 'WhatsApp Image 2026-06-17 at 18.27.21.jpeg', category: 'gesso', title: 'Gesso Liso' },
  { file: 'WhatsApp Image 2026-06-17 at 18.31.14 (1).jpeg', category: 'pvc', title: 'PVC Claro' },
  { file: 'WhatsApp Image 2026-06-17 at 18.31.14 (2).jpeg', category: 'gesso', title: 'Iluminação Indireta' },
  { file: 'WhatsApp Image 2026-06-17 at 18.31.14.jpeg', category: 'madeira', title: 'Painel Teto' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.23 (1).jpeg', category: 'pvc', title: 'Área Externa' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.23.jpeg', category: 'gesso', title: 'Quarto Moderno' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.24 (1).jpeg', category: 'madeira', title: 'Madeira Natural' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.24 (2).jpeg', category: 'pvc', title: 'Banheiro Premium' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.24 (3).jpeg', category: 'gesso', title: 'Sala de Estar' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.24.jpeg', category: 'pvc', title: 'Garagem' },
  { file: 'WhatsApp Image 2026-06-17 at 19.51.26.jpeg', category: 'gesso', title: 'Acabamento Fino' }
];

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
  const container = document.getElementById('gallery-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Renderizar itens
  const renderItems = (filter) => {
    container.innerHTML = '';
    
    const filteredImages = filter === 'all' 
      ? portfolioImages 
      : portfolioImages.filter(img => img.category === filter);

    filteredImages.forEach(img => {
      // Cria a estrutura do item da galeria
      const item = document.createElement('div');
      item.className = 'portfolio-item reveal active'; // Já renderiza ativo para não piscar
      
      const imgPath = `/Imagens-tetos/${encodeURI(img.file)}`;
      
      item.innerHTML = `
        <img src="${imgPath}" alt="${img.title}" loading="lazy">
        <div class="portfolio-info">
          <div class="portfolio-title">${img.title}</div>
          <div class="portfolio-tag">${img.category.toUpperCase()}</div>
        </div>
      `;
      
      // Clique abre o lightbox
      item.addEventListener('click', () => openLightbox(imgPath));
      
      container.appendChild(item);
    });
  };

  // Setup dos botões de filtro
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Atualiza classe active
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Filtra e renderiza
      appState.currentFilter = e.target.dataset.filter;
      renderItems(appState.currentFilter);
    });
  });

  // Render inicial
  renderItems('all');
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
