import re

html_template = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo de Projetos | MF Prime Acabamentos</title>
  <meta name="description" content="Catálogo completo de projetos residenciais e comerciais em PVC, Drywall e Divisórias da MF Prime Acabamentos.">

  <!-- TODO: troque a URL base abaixo pelo seu domínio próprio quando tiver -->
  <link rel="canonical" href="https://lp-forros-2026.vercel.app/catalogo">
  <meta name="theme-color" content="#a8662e">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">

  <!-- Open Graph (WhatsApp, Facebook, Instagram) -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="MF Prime Acabamentos">
  <meta property="og:title" content="Catálogo de Projetos | MF Prime Acabamentos">
  <meta property="og:description" content="Forros, divisórias e revestimentos para projetos residenciais e comerciais (B2B).">
  <meta property="og:url" content="https://lp-forros-2026.vercel.app/catalogo">
  <meta property="og:image" content="https://lp-forros-2026.vercel.app/Imagens-tetos/projeto-4.jpeg">
  <meta property="og:image:alt" content="Projeto de teto instalado pela MF Prime Acabamentos">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Catálogo de Projetos | MF Prime Acabamentos">
  <meta name="twitter:description" content="Forros, divisórias e revestimentos para projetos residenciais e comerciais (B2B).">
  <meta name="twitter:image" content="https://lp-forros-2026.vercel.app/Imagens-tetos/projeto-4.jpeg">

  <link rel="stylesheet" href="/src/css/main.css">
</head>
<body class="catalog-page">
  <!-- HEADER -->
  <header id="main-header">
    <div class="container">
      <div class="logo">
        <a href="index.html" style="display:flex; align-items:center; text-decoration:none; color:inherit;">
          <img src="/logo.png" alt="MF Prime Acabamentos Logo" style="height: 40px; width: auto; object-fit: contain; margin-right: 8px;">
          <span>MF Prime Acabamentos</span>
        </a>
      </div>
      <nav>
        <ul>
          <li><a href="index.html">Início</a></li>
          <li><a href="index.html#galeria">Portfólio</a></li>
          <li><a href="/catalogo" class="active">Catálogo</a></li>
        </ul>
      </nav>
      <a href="index.html#orcamento" class="btn btn-primary">Fazer Orçamento</a>
    </div>
  </header>

  <section class="hero catalog-hero">
    <div class="container">
      <div class="hero-content" style="text-align: center; max-width: 800px; margin: 0 auto;">
        <span class="hero-tagline">Soluções Completas</span>
        <h1 class="hero-title">Catálogo de Projetos</h1>
        <p class="hero-desc lead">Navegue pelas nossas opções de forros, divisórias e revestimentos para projetos residenciais e comerciais (B2B).</p>
      </div>
    </div>
  </section>

  <section class="section catalog-content-section" style="padding-top: 0;">
    <div class="container">
      <!-- Tabs -->
      <div class="catalog-tabs">
        <button class="catalog-tab-btn active" data-target="tab-pf">Residencial (PF)</button>
        <button class="catalog-tab-btn" data-target="tab-b2b">Comercial (B2B)</button>
        <button class="catalog-tab-btn" data-target="tab-servicos">Serviços Extras</button>
      </div>

      <!-- Tab Content: PF -->
      <div class="catalog-section active" id="tab-pf">
{pf_content}
      </div>

      <!-- Tab Content: B2B -->
      <div class="catalog-section" id="tab-b2b" style="display: none;">
{b2b_content}
      </div>

      <!-- Tab Content: Servicos -->
      <div class="catalog-section" id="tab-servicos" style="display: none;">
{servicos_content}
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="section-dark">
    <div class="container">
      <div class="footer-content reveal">
        <div class="footer-brand">
          <div class="logo">
            <img src="logo.png" alt="MF Prime Acabamentos Logo" style="height: 40px; width: auto; object-fit: contain; margin-right: 8px;">
            <span>MF Prime Acabamentos</span>
          </div>
          <p>Instalamos forros e divisórias com cuidado e material de qualidade, buscando deixar cada ambiente do jeito que o cliente imaginou.</p>
        </div>
        <div>
          <div class="footer-links-title">Menu Rapido</div>
          <ul class="footer-links">
            <li><a href="index.html#filosofia">Nossos Diferenciais</a></li>
            <li><a href="index.html#galeria">Mostruário de Projetos</a></li>
            <li><a href="index.html#orcamento">Simulador de Orçamento</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-links-title">Contato</div>
          <ul class="footer-links">
            <li>WhatsApp: (11) 99999-9999</li>
            <li>contato@primeacabamentos.com.br</li>
            <li>Atendimento em toda a Região</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom reveal">
        <div>&copy; 2026 MF Prime Acabamentos. Todos os direitos reservados.</div>
      </div>
    </div>
  </footer>

  <script type="module" src="/src/ts/main.ts"></script>
</body>
</html>
"""

def get_project_image(name, category_title):
    name_lower = name.lower()
    cat_lower = category_title.lower()
    
    # 1. Painel Madeira
    if any(k in name_lower for k in ["amadeirado", "ripado", "madeira", "pergolado"]):
        return "/Imagens-tetos/geradas/painel-madeira.png"
    # Painel de TV
    elif "tv" in name_lower:
        return "/Imagens-tetos/geradas/painel-tv.png"
    # 2. Painel 3D
    elif "3d" in name_lower:
        return "/Imagens-tetos/geradas/painel-3d.png"
    # 3. Painel Marmorizado
    elif "marmorizado" in name_lower:
        return "/Imagens-tetos/geradas/painel-marmorizado.png"
    # 4. Cimento Queimado
    elif "cimento" in name_lower:
        return "/Imagens-tetos/geradas/cimento-queimado.png"
    # 5. Sanca com LED
    elif any(k in name_lower for k in ["sanca", "led", "spot", "iluminação"]):
        return "/Imagens-tetos/geradas/sanca-led.png"
    # 6. Forro Drywall
    elif "drywall" in name_lower and any(k in name_lower for k in ["forro", "teto"]):
        return "/Imagens-tetos/geradas/forro-drywall.png"
    # 7. Forro PVC
    elif "pvc" in name_lower and any(k in name_lower for k in ["forro", "teto"]):
        return "/Imagens-tetos/geradas/forro-pvc.png"
    # 8. Divisoria Vidro
    elif "vidro" in name_lower and "divisória" in name_lower:
        return "/Imagens-tetos/geradas/divisoria-vidro.png"
    # 9. Divisoria Drywall
    elif "divisória" in name_lower or "parede" in name_lower or "layout open space" in name_lower:
        return "/Imagens-tetos/geradas/divisoria-drywall.png"
    # 10. Closet Drywall
    elif "closet" in name_lower:
        return "/Imagens-tetos/geradas/closet-drywall.png"
    # 11. Recepção Comercial
    elif "recepção" in name_lower:
        return "/Imagens-tetos/geradas/recepcao-comercial.png"
    # 12. Clinica/Procedimento
    elif any(k in name_lower for k in ["clínica", "médico", "odontológico", "consultório", "esterilização", "farmácia", "laboratório"]):
        return "/Imagens-tetos/geradas/clinica-procedimento.png"
    # 13. Isolamento Acústico
    elif any(k in name_lower for k in ["acústico", "isolamento", "estúdio", "podcast"]):
        return "/Imagens-tetos/geradas/isolamento-acustico.png"
    # 14. Area Kids
    elif any(k in name_lower for k in ["kids", "brinquedoteca", "escola", "aula"]):
        return "/Imagens-tetos/geradas/area-kids.png"
    # 15. Fachada/Lounge/Comercial
    elif any(k in name_lower for k in ["fachada", "lounge", "hotel", "hoteleira", "uh", "comum", "condomínio", "restaurante", "gourmet", "balcão"]):
        return "/Imagens-tetos/geradas/fachada-loja.png"
    
    # Fallbacks baseados na categoria
    if "revestimento" in cat_lower or "painel" in cat_lower:
        return "/Imagens-tetos/geradas/painel-madeira.png"
    elif "forro" in cat_lower or "iluminação" in cat_lower:
        return "/Imagens-tetos/geradas/forro-drywall.png"
    elif "divisória" in cat_lower or "ambientes" in cat_lower:
        return "/Imagens-tetos/geradas/divisoria-drywall.png"
    elif "clínica" in cat_lower or "saúde" in cat_lower:
        return "/Imagens-tetos/geradas/clinica-procedimento.png"
    
    return "/Imagens-tetos/geradas/forro-drywall.png"

def parse_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dividir em partes
    parts = content.split('## PARTE ')
    
    def process_tables(part_text):
        sections_html = []
        # Find all h3 headers
        sections = re.split(r'### (.+)', part_text)
        
        # se nao tiver h3, ver se tem tabela direta (como no serviços)
        if len(sections) == 1:
            sections = ['', 'Outros', sections[0]]
            
        for i in range(1, len(sections), 2):
            title = sections[i].strip()
            body = sections[i+1]
            sections_html.append(f'<h3 class="catalog-category-title">{title}</h3>')
            sections_html.append('<div class="catalog-grid">')
            
            # parse table rows
            for line in body.split('\n'):
                line = line.strip()
                if line.startswith('|') and not line.startswith('| Projeto') and not line.startswith('| Serviço') and not line.startswith('|---') and not line.startswith('| Faixa'):
                    cols = [c.strip() for c in line.split('|')[1:-1]]
                    if len(cols) >= 2:
                        name = cols[0]
                        desc = cols[1]
                        destaque = cols[2] if len(cols) > 2 else ""
                        
                        badges_html = ""
                        if '⭐' in destaque:
                            badges_html += '<span class="badge badge-premium"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: text-top;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Premium</span>'
                        if '🔁' in destaque:
                            badges_html += '<span class="badge badge-trending"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: text-top;"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg> Mais Pedido</span>'
                        if '⭐' not in destaque and '🔁' not in destaque and destaque != '':
                            text = destaque.replace("⭐","").replace("🔁","").strip()
                            if text:
                                badges_html += f'<span class="badge badge-info">{text}</span>'
                            
                        img_path = get_project_image(name, title)
                        
                        card_html = f'''
                        <div class="catalog-card reveal">
                          <div class="catalog-card-img">
                            <img src="{img_path}" alt="{name}" loading="lazy">
                          </div>
                          <div class="catalog-card-content">
                            <div class="catalog-badges">{badges_html}</div>
                            <h4 class="catalog-card-title">{name}</h4>
                            <p class="catalog-card-desc">{desc}</p>
                          </div>
                          <div class="catalog-card-action">
                            <a href="index.html#orcamento" class="btn btn-primary btn-small" style="width: 100%; display: flex; justify-content: center; gap: 8px;">Fazer orçamento</a>
                          </div>
                        </div>
                        '''
                        sections_html.append(card_html)
            sections_html.append('</div>')
            
        return "\n".join(sections_html)


    pf_content = process_tables(parts[1]) if len(parts) > 1 else ""
    b2b_content = process_tables(parts[2]) if len(parts) > 2 else ""
    servicos_content = process_tables(parts[3]) if len(parts) > 3 else ""

    final_html = html_template.format(pf_content=pf_content, b2b_content=b2b_content, servicos_content=servicos_content)
    with open('catalogo.html', 'w', encoding='utf-8') as f:
        f.write(final_html)

parse_markdown('catalogo-projetos.md')
print('catalogo.html gerado com sucesso.')
