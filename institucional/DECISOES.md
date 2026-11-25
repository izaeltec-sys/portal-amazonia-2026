# Decisões — portfólio institucional AEEC & Polaco

## Escopo consolidado
- Apresentação institucional e de capacidade de organização esportiva; não é proposta de patrocínio ou promessa comercial.
- AEEC: associação; Polaco Cycling Team Eventos: marca/equipe organizadora. Preservar nomes e marcas originais.
- Identidade aprovada: editorial esportiva, Barlow Condensed e IBM Plex Sans, fotografias reais, sem reconstrução de logos.
- Calendário de 2027: AABB em junho e Portal da Amazônia em novembro, datas a confirmar.
- Indicadores: distinguir inscrições confirmadas, registros e concluintes. Não atribuir fotografias a eventos diferentes.

## 25/11/2026 — impressão A4
Orientações expressas do usuário: respiro entre fundo e texto; card de logos na primeira página; evitar texto cortado e fotografias que cortem rostos; iterar até resultado aceitável; remover prévias rejeitadas do PC.

Implementação escolhida: capa de impressão empilhada (texto em duas colunas e foto ampla), card das marcas no fim da capa, margens internas de 5–8 mm nas áreas coloridas, blocos de corridas indivisíveis, fotografias integrais com object-fit:contain, encerramento e rodapé juntos. Manter HTML de conteúdo e assets originais; alterar apenas CSS de impressão. O enquadramento integral tem prioridade sobre preencher todos os retângulos; algumas fotos verticais terão área livre ao lado. A quantidade de páginas não é meta absoluta.

O resultado R7 passou pela inspeção visual em mosaico e verificações programáticas. Não equivale à aprovação final do usuário nem à autorização para distribuir fotografias de imprensa. Ver TAREFAS.md e VALIDACAO.md.

## R8 — 25/11/2026
Conforme feedback do usuário, o botão deve aguardar todas as fotografias antes da impressão. Mantém-se carregamento antecipado após a carga inicial, preparação explícita no clique, mensagem de erro se imagem indisponível ou timeout de 45 s. O usuário prefere fotos maiores com enquadramento integral, e para eventos de foto única, texto/dados à esquerda e foto à direita. Ajustar respiro da última página sem aumentar a contagem de páginas. Layout web preservado, salvo comportamento do botão e carregamento antecipado das imagens. Não alterar conteúdo editorial nem assets.
