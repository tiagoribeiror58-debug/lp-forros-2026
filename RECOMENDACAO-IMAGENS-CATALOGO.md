# Recomendação: imagens do catálogo (IA vs. fotos reais)

## Veredito: NÃO gerar imagens com IA para os projetos do catálogo

Esse é um negócio de **prova social e confiança**. O cliente está decidindo deixar um pedreiro/instalador entrar na casa dele e gastar alguns mil reais num teto. O que vende isso é **"essas pessoas fizeram isso de verdade"**. Imagem de IA, por melhor que esteja em 2026, tem três problemas fatais aqui:

1. **Detalhe técnico mente.** IA erra junta de drywall, alinhamento de sanca, perfil de PVC, caimento de luz — justamente os detalhes que o próprio site vende ("juntas alinhadas, sancas bem acabadas"). Um cliente que entende de obra percebe na hora.
2. **Risco de propaganda enganosa.** Mostrar um teto que nunca foi feito = prometer um padrão que pode não ser entregue. Isso queima reputação no boca a boca, que é o canal #1 desse setor.
3. **Já existem 17 fotos reais** em `public/Imagens-tetos/`. Esse é o maior ativo do projeto — fotos de projetos reais.

## O que fazer hoje

**Usar as fotos reais que já existem.** O catálogo hoje é texto puro (cards sem foto) — o trabalho é casar cada card de projeto com uma das 17 fotos reais já disponíveis.

## Onde a IA pode ajudar (uso aceitável)

- **Limpar/melhorar fotos reais** (luz, perspectiva, remover entulho de fundo) — isso é edição, não invenção. Aceitável.
- **Imagem de capa/hero genérica decorativa**, onde não há promessa implícita de "fizemos isso".

## GPT manual vs. ferramenta nativa de imagem

Para **editar fotos reais já existentes**, qualquer ferramenta serve e o resultado é honesto.
Para **gerar do zero**, nenhuma é recomendada — pelos motivos acima.

## Próximo passo proposto

Adaptar `build_catalog.py` e o markdown fonte (`catalogo-projetos.md`) para que cada card do catálogo aponte para uma das 17 fotos reais existentes (com `loading="lazy"`), fechando o ponto pendente de imagens no catálogo.
