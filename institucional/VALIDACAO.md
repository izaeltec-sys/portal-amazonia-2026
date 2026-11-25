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
