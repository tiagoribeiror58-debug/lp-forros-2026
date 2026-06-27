/**
 * MF Prime Acabamentos - Scripts Principais
 * Design System B2C focado em usabilidade e performance.
 */

// 1. Configurações Globais (Fácil alteração)
const CONFIG = {
  // Número do WhatsApp (Substitua pelo número real do cliente)
  whatsappNumber: '5511999999999', 
  // Mensagem padrão do WhatsApp
  whatsappGreeting: 'Olá, MF Prime Acabamentos! Vim pelo site e gostaria de um orçamento.'
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
  initCatalogTabs();
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
 * Lógica das Tabs do Catálogo
 */
function initCatalogTabs() {
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

/**
 * Catálogo Completo Logic
 */
const DATA = {
  pf: {
    label: 'Pessoa Física (Residencial)',
    tagClass: 'cat-tag-pf',
    categories: [
      {
        name: 'Revestimentos e painéis decorativos',
        items: [
          { name:'Painel PVC amadeirado (ripado)', desc:'Parede ou teto com réguas imitando madeira — rústico ou contemporâneo.', star:false, rec:true },
          { name:'Painel PVC liso', desc:'Revestimento liso para paredes internas, lavabos, áreas de serviço.', star:false, rec:false },
          { name:'Painel PVC 3D', desc:'Placas com relevos geométricos para paredes de destaque — sala, quarto.', star:false, rec:true },
          { name:'Painel marmorizado (SPC/PVC)', desc:'Simula mármore Carrara, preto ou travertino — TV, bancadas, painéis.', star:true, rec:false },
          { name:'Painel cimento queimado sobre drywall', desc:'Acabamento industrial/moderno aplicado sobre estrutura de drywall.', star:true, rec:false },
          { name:'Parede ripada decorativa', desc:'Réguas verticais ou horizontais em MDF, PVC ou madeira — sala, quarto.', star:false, rec:true },
          { name:'Revestimento para área úmida', desc:'PVC resistente à umidade para banheiros, lavanderias, garagens.', star:false, rec:false },
          { name:'Painel de TV com nicho integrado', desc:'Estrutura em drywall + revestimento PVC ao redor da TV.', star:true, rec:true },
          { name:'Headboard (cabeceira) em drywall/PVC', desc:'Parede de cabeceira trabalhada com iluminação ou revestimento.', star:false, rec:true },
          { name:'Painel de lareira suspensa', desc:'Estrutura em drywall para emoldurar lareira elétrica ou à gás.', star:true, rec:false },
        ]
      },
      {
        name: 'Forros e iluminação indireta',
        items: [
          { name:'Forro de drywall liso', desc:'Teto liso com acabamento perfeito para pintura — elimina imperfeições.', star:false, rec:false },
          { name:'Sanca de gesso/drywall simples', desc:'Rebaixo perimetral para iluminação indireta com LED.', star:false, rec:true },
          { name:'Sanca aberta com LED embutido', desc:'Rasgo estruturado para fita de LED — cria atmosfera de luz indireta.', star:true, rec:true },
          { name:'Teto com spot embutido', desc:'Forro de drywall com aberturas para spots de embutir.', star:false, rec:false },
          { name:'Forro de PVC vinílico', desc:'Réguas de PVC resistentes à umidade, ideal para áreas molhadas.', star:false, rec:false },
          { name:'Forro rebaixado com saia', desc:'Teto com rebaixo central + saia lateral em drywall criando efeito 3D.', star:true, rec:false },
          { name:'Forro com moldura perimetral', desc:'Acabamento refinado nas bordas do teto — residências de alto padrão.', star:false, rec:false },
          { name:'Sanca com cortineiro embutido', desc:'Drywall com vão para trilho de cortina — integrado ao teto.', star:false, rec:true },
          { name:'Forro acústico residencial', desc:'Drywall com manta acústica — home office, quarto de bebê, home theater.', star:true, rec:false },
          { name:'Teto tensionado (sob consulta)', desc:'Forro especial de tecido ou PVC tensionado — projetos diferenciados.', star:true, rec:false },
        ]
      },
      {
        name: 'Divisórias e separação de ambientes',
        items: [
          { name:'Divisória de drywall simples', desc:'Separação de cômodos com parede de gesso acartonado — mais rápido que alvenaria.', star:false, rec:false },
          { name:'Divisória de drywall acústica', desc:'Com lã de rocha — home office, quarto, studio de música.', star:true, rec:false },
          { name:'Divisória drywall para área úmida', desc:'Placa resistente à umidade (RU) para banheiros e lavabos.', star:false, rec:false },
          { name:'Parede de vidro residencial', desc:'Divisória em vidro temperado com perfil preto ou branco.', star:true, rec:true },
          { name:'Cobogó em drywall', desc:'Abertura vazada trabalhada no drywall para integração parcial de ambientes.', star:false, rec:false },
          { name:'Nicho embutido na parede', desc:'Recorte em drywall para armazenamento ou decoração.', star:false, rec:true },
          { name:'Parede curva ou irregular', desc:'Estrutura de drywall em formato não linear — projeto especial.', star:true, rec:false },
          { name:'Separação sala/cozinha integrada', desc:'Meia parede ou bancada em drywall integrando ambientes.', star:false, rec:true },
        ]
      },
      {
        name: 'Estruturas fixas e mobiliário embutido',
        items: [
          { name:'Closet em drywall', desc:'Estrutura de closet com cabideiros, gavetas e nichos — sem marcenaria.', star:true, rec:true },
          { name:'Estante embutida na parede', desc:'Prateleiras integradas ao drywall — sala, escritório, corredor.', star:false, rec:true },
          { name:'Bancada de estudo embutida', desc:'Mesa fixa integrada à parede com nichos e suporte para monitor.', star:false, rec:false },
          { name:'Porta de correr embutida no drywall', desc:'Porta que some na parede — otimiza espaço em ambientes pequenos.', star:true, rec:false },
          { name:'Estrutura para TV com fio escondido', desc:'Drywall com passa-fio integrado e nicho para equipamentos.', star:false, rec:true },
          { name:'Pergolado ou painel externo PVC', desc:'Estrutura em PVC para área externa, varanda, espaço gourmet.', star:false, rec:false },
          { name:'Banheiro seco em drywall', desc:'Parede de drywall separando área seca de área molhada no banheiro.', star:false, rec:false },
        ]
      },
    ]
  },
  b2b: {
    label: 'B2B / Comercial e Corporativo',
    tagClass: 'cat-tag-b2b',
    categories: [
      {
        name: 'Divisórias e layouts corporativos',
        items: [
          { name:'Divisória de vidro com perfil (escritório)', desc:'Salas e boxes com vidro temperado — perfil preto, branco ou natural.', star:true, rec:true },
          { name:'Divisória com persiana embutida', desc:'Vidro duplo com persiana interna — salas de reunião com privacidade.', star:true, rec:false },
          { name:'Divisória modular PVC/Eucatex', desc:'Painéis removíveis e reutilizáveis — fácil montagem e desmontagem.', star:false, rec:false },
          { name:'Layout open space em drywall', desc:'Separação parcial de setores com meia parede ou bancada.', star:false, rec:true },
          { name:'Sala de reunião completa', desc:'Drywall acústico + vidro + forro + iluminação — entrega chave na mão.', star:true, rec:false },
          { name:'Cabines privativas (coworking)', desc:'Pequenos boxes individuais em drywall ou PVC para coworking.', star:true, rec:false },
          { name:'Recepção com painel de marca', desc:'Parede de fundo da recepção com painel decorativo e logo da empresa.', star:false, rec:true },
          { name:'Banheiro corporativo completo', desc:'Drywall resistente à umidade, forro PVC e revestimento — entrega total.', star:false, rec:false },
        ]
      },
      {
        name: 'Clínicas e saúde',
        items: [
          { name:'Consultório médico/odontológico', desc:'Divisória drywall acústica + revestimento lavável + forro PVC.', star:true, rec:false },
          { name:'Sala de espera clínica', desc:'Painel decorativo + forro rebaixado + iluminação indireta.', star:false, rec:true },
          { name:'Banheiro acessível (PcD)', desc:'Drywall com reforço interno para barras de apoio + acessórios.', star:false, rec:false },
          { name:'Sala de esterilização', desc:'Revestimento de alta resistência e fácil higienização.', star:false, rec:false },
          { name:'Clínica estética — sala de procedimento', desc:'Drywall + PVC lavável + iluminação técnica embutida.', star:true, rec:false },
          { name:'Farmácia ou laboratório', desc:'Divisórias modulares + revestimento resistente + forro mineral.', star:false, rec:false },
        ]
      },
      {
        name: 'Varejo e gastronomia',
        items: [
          { name:'Fachada interna de loja (painel PVC)', desc:'Revestimento do ambiente interno com painéis amadeirados ou 3D.', star:false, rec:true },
          { name:'Provadores em drywall', desc:'Cabines com porta embutida e revestimento interno — lojas de roupa.', star:false, rec:false },
          { name:'Espaço gourmet externo', desc:'Forro PVC para área coberta + divisória de vidro + revestimento.', star:true, rec:false },
          { name:'Balcão e bancada fixa (drywall)', desc:'Estrutura de drywall para balcão de atendimento ou bar.', star:false, rec:false },
          { name:'Parede de fundo do salão', desc:'Painel de destaque com revestimento PVC ou cimento queimado.', star:false, rec:true },
          { name:'Cozinha industrial — forro PVC', desc:'Forro resistente a gordura e umidade em cozinha profissional.', star:false, rec:false },
          { name:'Isolamento acústico de restaurante', desc:'Parede e forro com tratamento acústico para conforto do cliente.', star:true, rec:false },
        ]
      },
      {
        name: 'Educação, academias e entretenimento',
        items: [
          { name:'Sala de aula com forro acústico', desc:'Placas minerais ou drywall acústico para escolas e cursos.', star:false, rec:false },
          { name:'Sala de dança / estúdio', desc:'Drywall com reforço + espelho embutido + forro acústico.', star:true, rec:false },
          { name:'Sala de musculação — divisória', desc:'Separação de setores em academia com divisória de vidro ou drywall.', star:false, rec:true },
          { name:'Estúdio de podcast / gravação', desc:'Tratamento acústico total — drywall multicamada + manta + forro.', star:true, rec:false },
          { name:'Sala de cinema corporativo', desc:'Forro rebaixado + drywall acústico + iluminação indireta + painel.', star:true, rec:false },
          { name:'Brinquedoteca / área kids', desc:'Drywall com revestimento colorido lavável + nichos + forro PVC.', star:false, rec:false },
        ]
      },
      {
        name: 'Hotéis, pousadas e Airbnb premium',
        items: [
          { name:'Reforma de UH (unidade habitacional)', desc:'Forro + revestimento + divisória de banheiro + iluminação.', star:true, rec:false },
          { name:'Painel de cabeceira (hotel)', desc:'Headboard em drywall com revestimento e iluminação embutida.', star:false, rec:true },
          { name:'Banheiro hotel — revestimento PVC', desc:'PVC que simula pedra natural — resistente e fácil limpeza.', star:false, rec:false },
          { name:'Lounge e área comum', desc:'Forro rebaixado + sanca LED + painel decorativo + divisória.', star:true, rec:false },
          { name:'Corredor com forro e iluminação', desc:'Forro de drywall com spots embutidos ao longo dos corredores.', star:false, rec:false },
        ]
      },
      {
        name: 'Construtoras e incorporadoras',
        items: [
          { name:'Drywall em substituição à alvenaria', desc:'Paredes internas de unidades residenciais ou comerciais — obra nova.', star:true, rec:false },
          { name:'Forro de drywall em bloco de apartamentos', desc:'Tetos de todas as unidades de um empreendimento.', star:true, rec:false },
          { name:'Áreas comuns do condomínio', desc:'Hall, salão de festas, academia interna, coworking.', star:false, rec:true },
          { name:'Revestimento PVC em apartamentos compactos', desc:'Studios e quitinetes com revestimento rápido e atrativo.', star:false, rec:false },
          { name:'Retrabalho e manutenção pós-obra', desc:'Reparos, substituição de placas, reforços — recorrente.', star:false, rec:false },
        ]
      },
    ]
  },
  svc: {
    label: 'Serviços Complementares',
    tagClass: 'cat-tag-svc',
    categories: [
      {
        name: 'Ampliam ticket médio e fidelizam',
        items: [
          { name:'Consultoria de layout e materiais', desc:'Antes da obra — orienta o cliente na escolha sem custo de projeto.', star:false, rec:false },
          { name:'Visita técnica e orçamento detalhado', desc:'Diferencial de transparência e confiança.', star:false, rec:true },
          { name:'Instalação de iluminação LED integrada', desc:'Junto a forros e sancas — parceria com eletricista ou serviço próprio.', star:false, rec:false },
          { name:'Pintura pós-drywall', desc:'Massa corrida + pintura sobre as placas instaladas.', star:false, rec:false },
          { name:'Demolição de parede para integração', desc:'Retirada de alvenaria antes da instalação do novo layout.', star:false, rec:false },
          { name:'Manutenção e reparo de drywall', desc:'Rachados, furos, umidade — recorrência garantida.', star:false, rec:false },
          { name:'Impermeabilização de áreas úmidas', desc:'Antes do revestimento PVC em banheiros e áreas externas.', star:false, rec:false },
          { name:'Assessoria para arquitetos', desc:'Execução fiel de projetos — parceria formal com escritórios.', star:true, rec:true },
          { name:'Contrato de manutenção periódica (B2B)', desc:'Inspeção e reparos programados para clínicas, escritórios e hotéis.', star:true, rec:false },
        ]
      }
    ]
  }
};

const TICKETS = [
  { range:'Até R$ 3 mil', label:'Entrada', ex:'Nichos, forros simples, painéis PVC de área pequena.' },
  { range:'R$ 3 mil – R$ 15 mil', label:'Médio', ex:'Sancas + LED, divisórias simples, revestimento de sala.' },
  { range:'R$ 15 mil – R$ 50 mil', label:'Alto', ex:'Closet completo, sala de reunião, clínica, reforma de apartamento.' },
  { range:'Acima de R$ 50 mil', label:'Premium', ex:'Hotel, construtora, studio de gravação, projeto corporativo completo.' },
];

let catFilterSeg = 'all';
let catFilterStar = false;
let catFilterRec  = false;
let catSearchQ    = '';

function allCatItems() {
  const out = [];
  ['pf','b2b','svc'].forEach(seg => {
    DATA[seg].categories.forEach(cat => {
      cat.items.forEach(item => out.push({ ...item, seg, catName: cat.name }));
    });
  });
  return out;
}

function renderCatalog() {
  const mc = document.getElementById('mainContent');
  const nr = document.getElementById('no-results');
  if (!mc || !nr) return;
  
  mc.innerHTML = '';
  nr.classList.remove('show');

  const q = catSearchQ.toLowerCase();
  const segs = catFilterSeg === 'all' ? ['pf','b2b','svc'] : [catFilterSeg];
  let totalVisible = 0;

  segs.forEach(seg => {
    const segData = DATA[seg];
    const filteredCats = segData.categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (catFilterStar && !item.star) return false;
        if (catFilterRec  && !item.rec)  return false;
        if (q && !item.name.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false;
        return true;
      })
    })).filter(cat => cat.items.length > 0);

    if (!filteredCats.length) return;

    const block = document.createElement('div');
    block.className = 'cat-section-block';
    const catCount = filteredCats.reduce((a,c) => a + c.items.length, 0);
    totalVisible += catCount;

    block.innerHTML = `
      <div class="cat-section-head">
        <h2>${segData.label}</h2>
        <span class="cat-seg-tag ${segData.tagClass}">${seg === 'pf' ? 'Residencial' : seg === 'b2b' ? 'Empresas' : 'Serviços'}</span>
        <span class="cat-count">${catCount} projeto${catCount !== 1 ? 's' : ''}</span>
      </div>
    `;

    filteredCats.forEach(cat => {
      const catDiv = document.createElement('div');
      catDiv.className = 'cat-block';
      catDiv.innerHTML = `<div class="cat-label">${cat.name}</div>`;
      const cardsDiv = document.createElement('div');
      cardsDiv.className = 'cat-cards';
      cat.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'cat-card';
        const badges = [];
        if (item.star) badges.push('<span class="cat-pill cat-pill-star">⭐ Alto ticket</span>');
        if (item.rec)  badges.push('<span class="cat-pill cat-pill-rec">🔁 Indicação</span>');
        card.innerHTML = `
          <div class="cat-card-name">${highlightCat(item.name, q)}</div>
          <div class="cat-card-desc">${highlightCat(item.desc, q)}</div>
          ${badges.length ? `<div class="cat-card-foot">${badges.join('')}</div>` : ''}
        `;
        cardsDiv.appendChild(card);
      });
      catDiv.appendChild(cardsDiv);
      block.appendChild(catDiv);
    });

    mc.appendChild(block);
  });

  if (!catFilterStar && !catFilterRec && !q && (catFilterSeg === 'all' || catFilterSeg === 'b2b')) {
    const tb = document.createElement('div');
    tb.className = 'cat-section-block';
    tb.innerHTML = `
      <div class="cat-section-head">
        <h2>Faixas de ticket</h2>
        <span class="cat-seg-tag cat-tag-svc">Referência</span>
        <span class="cat-count">valores não verificados — valide com sua operação</span>
      </div>
      <div class="cat-ticket-grid">
        ${TICKETS.map(t => `
          <div class="cat-ticket-card">
            <div class="cat-ticket-label">${t.label}</div>
            <div class="cat-ticket-range">${t.range}</div>
            <div class="cat-ticket-examples">${t.ex}</div>
          </div>
        `).join('')}
      </div>
    `;
    mc.appendChild(tb);
  }

  if (totalVisible === 0) {
    document.getElementById('search-term').textContent = `"${catSearchQ}"`;
    nr.classList.add('show');
  }
}

function highlightCat(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\\\]/g,'\\\\$&')})`, 'gi');
  return text.replace(re, '<mark style="background:var(--primary-light);color:var(--primary-hover);border-radius:2px;padding:0 2px;">$1</mark>');
}

function initCatalog() {
  const mc = document.getElementById('mainContent');
  if (!mc) return; // Not on the right page

  document.querySelectorAll('.cat-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      catFilterSeg = btn.dataset.seg;
      renderCatalog();
    });
  });

  const btnStar = document.getElementById('btnStar');
  if(btnStar) {
    btnStar.addEventListener('click', function() {
      catFilterStar = !catFilterStar;
      this.classList.toggle('active-star', catFilterStar);
      renderCatalog();
    });
  }

  const btnRec = document.getElementById('btnRec');
  if(btnRec) {
    btnRec.addEventListener('click', function() {
      catFilterRec = !catFilterRec;
      this.classList.toggle('active-rec', catFilterRec);
      renderCatalog();
    });
  }

  const searchInp = document.getElementById('searchInput');
  if(searchInp) {
    searchInp.addEventListener('input', function() {
      catSearchQ = this.value.trim();
      renderCatalog();
    });
  }

  renderCatalog();
}
