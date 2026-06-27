import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Get header and footer from index.html (or I will just use string blocks to be safe)
html_template = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo de Projetos | MF Prime Acabamentos</title>
  <meta name="description" content="Catálogo completo de projetos residenciais e comerciais em PVC, Drywall e Divisórias da MF Prime Acabamentos.">
  <link rel="stylesheet" href="index.css">
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
          <li><a href="catalogo.html" class="active">Catálogo</a></li>
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

  <script type="module" src="app.js"></script>
</body>
</html>
"""

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
                            badges_html += '<span class="badge badge-premium">⭐ Premium</span>'
                        if '🔁' in destaque:
                            badges_html += '<span class="badge badge-trending">🔁 Mais Pedido</span>'
                        if '⭐' not in destaque and '🔁' not in destaque and destaque != '':
                            text = destaque.replace("⭐","").replace("🔁","").strip()
                            if text:
                                badges_html += f'<span class="badge badge-info">{text}</span>'
                            
                        card_html = f'''
                        <div class="catalog-card reveal">
                          <div class="catalog-card-content">
                            <div class="catalog-badges">{badges_html}</div>
                            <h4 class="catalog-card-title">{name}</h4>
                            <p class="catalog-card-desc">{desc}</p>
                          </div>
                          <div class="catalog-card-action">
                            <a href="index.html#orcamento" class="btn btn-outline btn-small">Tenho interesse</a>
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

parse_markdown('../projetos_prime_acabamentos.md')
print('catalogo.html gerado com sucesso.')
