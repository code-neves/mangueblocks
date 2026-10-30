# Mangueblock

Mangueblock é uma plataforma educativa de pensamento computacional para crianças. A pessoa aprende organizando blocos de código e observando o resultado em cenários inspirados no manguezal.

Esta pasta contém a versão de prototipagem do projeto. O app funciona no navegador e não precisa de etapa de compilação.

## O que há no protótipo

- Catálogo de 11 mundos e 53 etapas, com progressão de dificuldade e objetivos relacionados à Computação na BNCC.
- Dois modos de programação: montagem guiada e fluxo livre com arrastar e soltar.
- Blocos de movimento, coleta, repetição, condições e ações para diferentes objetivos de jogo.
- Leitura dos cartões por câmera ou por fotografia, com classificador WebAssembly e alternativa em JavaScript.
- Cenários em grade com arte do Sprout Lands e peixes ASCII decorativos no fundo da interface.
- Preferências de acessibilidade, som e progresso salvos neste navegador.

## Executar localmente

Na pasta do projeto, inicie um servidor HTTP local:

```sh
python -m http.server 8000
```

Depois, abra <http://localhost:8000> no navegador. A câmera exige um contexto seguro; `localhost` atende esse requisito nos navegadores modernos. Também é possível carregar uma foto dos cartões.

Para encerrar o servidor, use `Ctrl+C` no terminal em que ele está rodando.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `index.html` | Estrutura das telas, cabeçalho, catálogo, jogo e diálogos. |
| `css/styles.css` | Estilos da interface, layouts responsivos, catálogo e área de programação. |
| `js/data.js` | Blocos, missões iniciais e metadados do catálogo. |
| `js/bncc-worlds.js` | Definições dos dez mundos adicionais, geração de cenários, soluções e requisitos das etapas. |
| `js/catalog.js` | Filtros, cartões dos mundos, arte vetorial e navegação entre catálogo e etapas. |
| `js/game.js` | Simulação, renderização do tabuleiro, regras de conclusão e editores de blocos. |
| `js/icons.js` | Ícones SVG compartilhados e funções auxiliares de ícones. |
| `js/main.js` | Navegação entre telas e inicialização da interface. |
| `js/state.js` | Preferências de acessibilidade e persistência local. |
| `js/reader.js`, `js/reader-wasm.js` | Captura e classificação de cartões físicos. |
| `js/audio.js` | Sons curtos da interface e do jogo. |
| `js/koi.js` | Animação de peixes e efeitos ASCII do fundo. |
| `assets/sprout-lands/` | Personagem e tilesets utilizados nos cenários. |
| `docs/` | Auditorias pedagógicas, cobertura BNCC e propostas de mecânicas. |
| `_archive/` | Backups históricos e um arquivo antigo de scripts, mantidos fora da execução atual. |

Os scripts são carregados no fim de `index.html` em uma ordem que respeita suas dependências. Não os reordene sem conferir referências compartilhadas entre os arquivos.

## Dados locais

O progresso e as preferências são gravados no `localStorage` do navegador. Limpar os dados do site nesse navegador apaga esse progresso. Outro navegador ou dispositivo mantém um estado separado.

## Documentação pedagógica

- [Mundos e competências da BNCC](docs/bncc-computacao-mundos.md)
- [Auditoria de habilidades, objetivos e blocos](docs/auditoria-habilidades-e-mecanicas.md)
- [Formatos de jogo por mundo](docs/formatos-de-jogo-por-mundo.md)
- [Novos formatos e condições de vitória](docs/novos-formatos-de-jogo-por-mundo.md)
- [Créditos e licença dos recursos visuais](ASSET_CREDITS.md)

## Créditos dos recursos visuais

Os sprites em `assets/sprout-lands/` pertencem ao pacote **Sprout Lands — Basic Pack**, de Cup Nooble. Consulte [ASSET_CREDITS.md](ASSET_CREDITS.md) antes de redistribuir o projeto ou seus recursos.
