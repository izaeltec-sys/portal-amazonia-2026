# Validação — revisão A4 (25/11/2026)

## Ambiente e evidência
PC Escritório (Windows), Microsoft Edge headless com A4 definido no CSS, cabeçalhos automáticos desabilitados e numeração institucional. PDF renderizado com PyMuPDF; mosaicos inspecionados visualmente. Fonte original: institucional/index.html, commit 72697ba84797a57a5463c4ff8b53468176572e75. Implementação publicada: 8fee910dca77114b2cc5a91703e00fc25ffc74d9.

## Iterações
| Revisão | Páginas | Resultado |
| --- | --- | --- |
| Original | 14 | Cortes de texto nas bordas escuras, capa sem logos, quebras e espaços excessivos. |
| R2 | 13 | Agrupou corridas e operação, mas margens inadequadas e muito espaço ocioso. |
| R3 | 13 | Rodapé isolado. |
| R4 | 15 | Regressão de paginação. |
| R5 | 14 | Capa e margens corrigidas; rodapé isolado e blocos com espaço excessivo. |
| R6 | 12 | Sem palavras fora da área verificada; rodapé integrado. Fotos pequenas e perspectivas com espaço ocioso. |
| R7 | 12 | Selecionada: capa com marcas, fotos maiores e integrais, páginas temáticas, numeração e rodapé completos. |

## Testes R7
- 12 páginas e 15.209.091 bytes na prévia de teste.
- Inspeção de mosaico das 12 páginas: capa e assinaturas juntas; cinco edições completas; operação em página única; dois campeonatos separados; ações sociais, público, bastidores, 2027 e referências presentes; sem página exclusiva de rodapé.
- Teste geométrico: zero palavras extraídas com coordenadas x inferiores a 30 pt ou superiores a 565 pt, em todas as páginas. Não substitui prova física nem garante todos os possíveis recortes tipográficos.
- A segunda exportação com HTML normal (sem forçar atributo open ou eager) produziu 12 páginas, textos iguais, contagem de imagens igual e renderização pixel a pixel igual à R7 em escala 0,4. Contagens de imagens por página: 3, 1, 2, 3, 4, 2, 0, 5, 6, 4, 1, 0.
- Alterações limitadas a CSS @media print acrescentado ao HTML; nenhum asset, texto editorial ou estrutura de conteúdo foi substituído.
- Limitações: espaços brancos intencionais em páginas de conteúdo breve; fotos verticais mantidas inteiras em vez de cortadas; verificação visual em mosaico não é revisão em tamanho físico. A prévia continua sujeita à aprovação do usuário e confirmação de direitos de republicação.

## Reprodução
Abrir o portfólio, aguardar fontes/imagens e selecionar Salvar em PDF; papel A4, escala padrão, desativar cabeçalhos e rodapés automáticos do navegador, manter gráficos de fundo. Conferir as 12 páginas. O script beforeprint/afterprint expande o histórico e restaura o estado de navegação.


## Confirmação após publicação e limpeza
- URL pública respondeu HTTP 200 e contém CSS R7. Nova impressão diretamente da URL publicada, sem modificar HTML nem forçar details, retornou 12 páginas. Comparação das 12 páginas com a prévia selecionada: textos idênticos, número de imagens idêntico e renderização pixel a pixel idêntica em escala 0,4. Teste manual do botão não executado nesta sessão.
- Arquivo selecionado no PC Escritório: Downloads/Previa_Institucional_AEEC_Polaco_2026_Revisada.pdf (15.209.091 bytes). Original de 14 páginas preservado como referência. Removidas as prévias intermediárias R2–R6, a cópia duplicada R7 e os 7 mosaicos; 13 arquivos, 93.821.192 bytes. Diretórios temporários de revisão e de verificação removidos. Não foram removidos assets ou documentos pessoais.

## R8 — 25/11/2026
Feedback do usuário: PDF gerado imediatamente pelo botão perdeu fotos; aumentar imagens nas páginas 2, 9, 10; margens da página 12 e duas colunas nos eventos com foto única (páginas 3–4). Código no commit 44e4d7077094b30da04cb95e144d1b79eccf80c5.
- PDF enviado: 12 páginas, 9 ocorrências de imagens; R8: 12 páginas, 31 ocorrências (incluindo logos e fotos repetidas).
- Edge headless via CDP, cache desativado, latência simulada 180 ms, 1,8 MB/s. Clique automatizado quando apenas 3/31 imagens carregadas. Interceptação de window.print confirmou que a chamada só ocorreu com 31/31 imagens decodificáveis; exportação CDP gerou PDF completo. Ao concluir, botão habilitado e histórico voltou ao estado inicial (0 abertos).
- Falha simulada bloqueando jiu-2025-luta-1.webp: zero chamadas de impressão, aviso exibido, botão e histórico restaurados.
- Inspeção do mosaico das 12 páginas e página 12 em resolução ampliada; zero palavras extraídas fora do intervalo x=30–565 pt. Áreas das fotos na p.2: 4799→8520 mm²; p.3: 2580→6334 e 2905→6048 mm²; p.4 foto única: 3021→5822 mm². Páginas 9 e 10 também ganharam área fotográfica; algumas fotos já limitadas pela largura permaneceram do mesmo tamanho.
- Primeira execução Pages (45648772693): build bem-sucedido; deploy falhou HTTP 500 ao criar deployment. Aguardar/verificar novo deploy; não confundir commit com publicação.
- Impressão pelo atalho nativo Ctrl+P não pode aguardar assincronamente todas as imagens; preferir botão Salvar em PDF. Fontes externas seguem com fallback local. PDF continua prévia.

## R9 — 25/11/2026
Commit 6929a777ecd6e9cdcd543db407da22761f1192d1. Validação estática: 31 referências img src idênticas à R8, cinco details de edições, script integralmente preservado; novo CSS exclusivamente @media print, legenda de Wellington Vilela corrigida. Capturas da R8 sustentam os ajustes das páginas 9 e 11. Sem nova renderização, teste visual ou confirmação de 12 páginas: PC Escritório indisponível. As duas publicações R8 (45648772693 e 45648934872) falharam. Conferir novo workflow.

## R10 — 25/11/2026
R9 gerada no IFRO: 14 páginas. Renderização real por Windows.Data.Pdf mostrou ações sociais separadas nas p.9–10 e perspectivas 2027 divididas nas p.12–13; rejeitada. R10: Edge headless, arquivo HTML do commit R9 com patch de CSS de impressão, base de imagens pública, imagens eager e cinco details abertos para o teste. PDF 12 páginas (15.206.847 bytes). Todas as páginas renderizadas por Windows.Data.Pdf a 900 px; inspeção do mosaico completo e das p.9 e 11 ampliadas: ações sociais juntas, fotografia aérea acima de texto e calendário completo, sem as quebras R9. Não houve instalação de programas. Script do botão de impressão inalterado em relação à R8; teste normal pelo botão na R10 pública ainda não realizado. PDF salvo no IFRO E39992 em Downloads/Previa_Institucional_AEEC_Polaco_2026_R10.pdf; R9 e pastas temporárias da revisão removidas. Implementação de9abbe5368cbc60b035f679c699eeca10292ced.

## R11 — 25/11/2026
R10 pública: HTTP 200, CSS R10 e guard savePdf presentes. Workflow 45667592354 sucesso. Teste Edge CDP no IFRO, cache desabilitado e rede limitada: clique com 3/31 imagens; chamada de impressão somente com 31/31, cinco edições abertas, botão restaurado ao final. R11 candidata local: mesma foto enviada, localizada em Downloads (JPEG de 1.397.132 bytes, blob e8838fcbc9b41271a01a1c251087dcf3577231e8); sem manipular a imagem. Teste do botão com 1/31 inicialmente, 31/31 carregadas antes da impressão; 12 páginas renderizadas a 900 px, mosaico integral e p.9/11 ampliadas conferidas. Foto aérea 87 mm, título acima, descrição abaixo, perspectivas intactas. Teste CDP interceptou window.print e exportou com Page.printToPDF; não é clique manual no diálogo. R11 pública ainda precisa ser confirmada.

### R11 pública — validação concluída
Workflow 45679595539: sucesso. URL pública com ?v=771e539 confirmou os marcadores R11 e nova imagem. Edge CDP com cache desabilitado e conexão limitada: 1/31 imagens inicialmente, 31/31 na chamada, cinco edições abertas, botão e histórico restaurados. Exportação 12 páginas, 16.352.568 bytes. Renderização Windows.Data.Pdf a 900 px e inspeção do mosaico completo e p.9/11 ampliadas: composição e fotos esperadas, sem seções adicionais. Os hashes PNG não coincidiram em 11 páginas; não se afirma identidade pixel a pixel. Visualmente não foi observada regressão. Prévia candidata salva no IFRO E39992 em Downloads/Previa_Institucional_AEEC_Polaco_2026_R11.pdf. Diretório temporário e processos Edge exclusivos dos perfis de teste removidos; navegador de uso normal não foi encerrado. R10 preservada como referência.
