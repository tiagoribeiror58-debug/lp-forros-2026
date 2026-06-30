export function initCatalogFilter(): void {
  const params = new URLSearchParams(window.location.search);
  const tema = params.get('tema');
  
  if (!tema) return; // No filter applied

  const cards = document.querySelectorAll('.catalog-card');
  if (cards.length === 0) return;

  const saudeKeywords = ['clínica', 'médico', 'consultório', 'isoforro', 'hospital', 'saúde', 'lavável', 'pvc liso', 'divisória', 'recepção'];
  const acusticaKeywords = ['acústic', 'estúdio', 'podcast', 'som', 'madeira', 'amadeirado', 'isolamento', 'drywall', 'divisória', 'painel difusor', 'estúdio industrial'];

  const keywords = tema === 'saude' ? saudeKeywords : (tema === 'acustica' ? acusticaKeywords : []);

  if (keywords.length === 0) return;

  cards.forEach(card => {
    const title = card.querySelector('.catalog-card-title')?.textContent?.toLowerCase() || '';
    const desc = card.querySelector('.catalog-card-desc')?.textContent?.toLowerCase() || '';
    
    const text = title + ' ' + desc;
    
    // Check if any keyword matches
    const isMatch = keywords.some(kw => text.includes(kw));
    
    if (!isMatch) {
      (card as HTMLElement).style.display = 'none';
    } else {
      (card as HTMLElement).style.display = 'flex';
    }
  });

  // Also pre-select the B2B tab because both verticals are mostly B2B
  const b2bTab = document.querySelector('.catalog-tab-btn[data-target="tab-b2b"]');
  if (b2bTab) {
    (b2bTab as HTMLElement).click();
  }

  // Update hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    if (tema === 'saude') {
      heroTitle.textContent = 'Projetos para Saúde e Clínicas';
    } else if (tema === 'acustica') {
      heroTitle.textContent = 'Projetos de Acústica e Estúdios';
    }
  }
}
