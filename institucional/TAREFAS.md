# Tarefas — portfólio institucional

Atualização: 25/11/2026. Base funcional da revisão: commit 8fee910dca77114b2cc5a91703e00fc25ffc74d9.

## Concluídas
- [x] Preservar acervo e logos no repositório; manter separação entre histórico esportivo e ações sociais.
- [x] Inspecionar as 14 páginas da prévia original.
- [x] Corrigir capa e inserir card de marcas na primeira página impressa.
- [x] Corrigir cortes laterais e controlar quebras de seção; preservar enquadramento integral de fotografias.
- [x] Testar R2–R7; selecionar R7 (12 páginas) e confirmar comportamento com HTML normal, sem forçar detalhes abertos.
- [x] Publicar CSS de impressão validado em main, mantendo layout web.

## Pendentes
- [ ] Aprovação visual do usuário da prévia revisada em A4; conferir também uma impressão física, se necessária.
- [x] Verificar deployment GitHub Pages e reprodução por impressão headless diretamente da URL pública; 12 páginas idênticas à R7.
- [x] Limpar prévias rejeitadas, mosaicos e diretórios temporários (13 arquivos, 93.821.192 bytes liberados); preservar o original como referência e a R7 revisada.
- [ ] Teste manual pelo botão Salvar em PDF na interface, se necessário, e aprovação do usuário.
- [ ] Confirmar autorizações de republicação das fotos jornalísticas e direito de imagem aplicável, particularmente de crianças e adolescentes. Remover/substituir imagens sem liberação adequada.
- [ ] Conferir datas, nomes, números e créditos para distribuição institucional definitiva.
- [ ] Após aprovação, registrar e gerar versão final (não chamar a prévia de final).
- [ ] Avaliar fontes locais e compressão do PDF sem comprometer a legibilidade.

## Retomada
Ler README.md, DECISOES.md e VALIDACAO.md; confirmar HEAD em main antes de alterar. Não recriar a identidade nem reiniciar a paginação a partir do PDF antigo. A fonte é institucional/index.html.

## Revisão R8 — 25/11/2026
- [x] Reproduzir perda de imagens no PDF enviado pelo usuário (9 ocorrências de imagens em vez de 31).
- [x] Botão Salvar em PDF aguarda carregamento e decodificação das imagens e document.fonts.ready; bloqueia impressão incompleta, informa falha e restaura o estado.
- [x] Aumentar fotografias nas páginas 2, 9 e 10 e margens internas da página 12; diagramação em duas colunas para eventos com foto única nas páginas 3 e 4.
- [x] Teste local R8 com cache desativado e rede limitada; 12 páginas completas, sem palavras fora dos limites geométricos verificados. Teste de falha de imagem aprovado.
- [ ] Confirmar novo deploy público e teste da URL (primeira tentativa falhou por HTTP 500 no GitHub Pages).
- [ ] Aprovação visual e direitos de imagem continuam pendentes.
