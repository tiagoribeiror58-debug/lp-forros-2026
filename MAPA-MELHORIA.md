# Mapa de Otimização e Melhoria Contínua (CRO)
Este documento serve como guia estratégico para monitorar, analisar e aprimorar a taxa de conversão (CRO) da Landing Page da **MF Prime Acabamentos**, utilizando decisões baseadas em dados reais de uso.

---

## 1. Funil de Conversão e KPIs
Para entender onde estamos perdendo potenciais clientes, devemos mapear as interações na página através dos seguintes indicadores:

### A. Engajamento com a Galeria & Catálogo
*   **Métrica:** Cliques de ampliação (Zoom/Lightbox) nas imagens do catálogo e do mostruário.
*   **Objetivo:** Medir se as imagens hiper-realistas geradas por IA estão capturando a atenção do público de alto padrão.
*   **Ação:** Se certas imagens geram 0 cliques, elas devem ser substituídas por categorias de maior apelo.

### B. Funil do Orçamentador (Wizard)
*   **Métrica de Entrada:** Taxa de cliques para iniciar o orçamentador.
*   **Taxa de Abandono por Etapa:**
    *   *Passo 1 (Acabamento)* $\rightarrow$ *Passo 2 (Tamanho)*
    *   *Passo 2 (Tamanho)* $\rightarrow$ *Passo 3 (Ambiente)*
    *   *Passo 3 (Ambiente)* $\rightarrow$ *Clique Final (WhatsApp)*
*   **Objetivo:** Descobrir qual pergunta causa maior atrito ou desistência.

### C. Conversão Final (Macro Conversão)
*   **Métrica:** Cliques nos CTAs de WhatsApp (Hero e Final do Wizard).
*   **Objetivo:** Manter a taxa de conversão final (cliques vs. visitas totais) acima de **5% a 8%** (média saudável para o nicho de prestação de serviços premium).

---

## 2. Ferramentas Recomendadas para Coleta de Dados

Para monitorar os padrões de navegação dos usuários de forma invisível e precisa, recomendamos a implementação das seguintes ferramentas na raiz da página:

### A. Análise Comportamental (Mapas de Calor e Gravações)
#### **Microsoft Clarity** (Altamente Recomendado - Gratuito)
*   **O que faz:** Gera mapas de calor de cliques/rolagem, mapas de movimento do mouse e gravações reais de tela de como o usuário navega pelo site (totalmente anônimo).
*   **Aplicação Prática:** Permite assistir a gravações de usuários preenchendo o Wizard de orçamento para ver onde eles hesitam, clicam errado ou desistem antes de enviar.
*   *Alternativa paga:* **Hotjar**.

### B. Web Analytics (Métricas Quantitativas)
#### **Google Analytics 4 (GA4)**
*   **O que faz:** Mede volume de visitas, canais de aquisição (de onde o usuário veio - tráfego pago, Instagram, busca orgânica) e tempo de retenção.
*   **Aplicação Prática:** Configurar eventos customizados para cada etapa do Wizard para gerar um funil visual de desistência.

### C. Gestão de Tags (Sem necessidade de reprogramar)
#### **Google Tag Manager (GTM)**
*   **O que faz:** Centraliza todos os scripts (Clarity, GA4, Pixel do Facebook/Instagram) em um único container.
*   **Aplicação Prática:** Evita sobrecarregar o código da página e facilita a instalação de novas tags de rastreamento no futuro sem precisar editar os arquivos do repositório.

---

## 3. Próximos Experimentos (Testes A/B)
Com as ferramentas instaladas, o roteiro de testes sugerido é:

1.  **Cor do CTA Final:** Testar o botão do WhatsApp com a cor verde oficial (`#25D366`) versus a cor bronze de destaque da identidade visual do site (`#a8662e`).
2.  **Facilidade de Entrada no Wizard:** Testar um botão âncora fixo no rodapé em dispositivos móveis direcionando diretamente para a seção de orçamento.
3.  **Tamanho vs. Sem Tamanho:** Comparar se remover a obrigatoriedade implícita ou o slider de tamanho (passo 2) aumenta o envio de leads.
