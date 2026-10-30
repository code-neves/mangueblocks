# Formatos de jogo e competências por mundo

O cenário agora pode encerrar uma etapa por diferentes resultados observáveis. A rota com bandeira continua disponível para algoritmos espaciais, mas não é mais a regra padrão dos dez mundos.

## Mecânicas implementadas

| Resultado | Estado avaliado pelo simulador | Blocos usados |
| --- | --- | --- |
| Rota e coleta | Chegar à bandeira com todos os itens recolhidos | Movimento, Pegar, Pular e condições |
| Mosaico | Pintar todos os quadrados marcados; não precisa chegar a uma bandeira | Movimento, Repetir, Pintar pixel |
| Sinais | Deixar todos os interruptores em `1` | Movimento, Alternar sinal |
| Recolha completa | Pegar todos os materiais; a última coleta encerra a etapa | Movimento, Pegar, Repetir |
| Marcos em ordem | Visitar cada número na sequência; o último marco encerra a etapa | Movimento e sequência |
| Estações de tarefa | Executar a ação daquele mundo em cada ponto marcado | Movimento e Gravar sinal, Conectar peça, Proteger dado ou Construir |

Os blocos de estação mudam o estado do ponto marcado e o simulador confere se todos foram concluídos. Isso permite condições de vitória distintas já nesta versão, mantendo explícito que a avaliação de conceitos mais ricos ainda pede novas regras.

## Habilidade, cenário e próximos passos

| Mundo | Habilidades BNCC selecionadas | Forma de jogo atual | Extensão que melhor representa a habilidade |
| --- | --- | --- | --- |
| **Padrões do mangue** | EI03CO01, EF01CO01, EF02CO01: repetição, classificação e atributos | Pintar um mosaico no tabuleiro; etapas de ciclo exigem Repetir. | Dar atributos aos objetos e pedir que a turma classifique por uma regra, em vez de apenas pintar alvos. |
| **Trilhas do cotidiano** | EI03CO02/03/04/05, EF01CO02/03, EF03CO03: sequência, criação, comparação e decomposição | Rota curta continua como uma atividade de algoritmo espacial. | Modo de depuração com sequência defeituosa; comparação de duas soluções; sub-rotinas para decompor tarefas. |
| **Sentinelas do estuário** | EI03CO06/07, EF03CO01, EF05CO03/04: estados e lógica | Alternar interruptores 0/1; vencer com os sinais pedidos ligados. | NOT, AND, OR e Se/Então/Senão devem combinar pistas e gerar resultados visíveis. |
| **Marés em repetição** | EI03CO01/04, EF02CO02, EF03CO02, EF04CO03, EF05CO04: ciclos | Pintar padrões usando Repetir; blocos exigidos são parte da vitória. | Adicionar Enquanto/Até e sequências dentro de sequências. “Se livre” atual só executa um avanço condicional. |
| **Resgate do manguezal** | EI03CO02/04/05, EF03CO02/03, EF05CO04: decomposição e recomposição | Recolher todas as peças do kit; não existe casa final. | Adicionar carregar, entregar e sub-rotinas de resgate que possam ser reusadas. |
| **Cartógrafos da restinga** | EF04CO01/02, EF05CO01/02: coordenadas, registros, listas e grafos | Visitar marcos numerados em ordem, sem bandeira. | Criar rotas com bifurcações e blocos para ler coordenadas, registrar nós e seguir ligações. |
| **Mensagens da lagoa** | EF01CO04/05, EF03CO04/05, EF04CO04/05: dados e codificação | Gravar sinais nos quadrados marcados; cada bit muda de 0 para 1. | Incluir padrões de bits 0/1, leitura/decodificação e comparação de formatos. |
| **Oficina de ferramentas** | EI03CO08/09, EF01CO06, EF02CO03/04/05, EF03CO06, EF05CO05/06/07: interfaces e sistemas | Conectar as estações do circuito; concluir todos os pontos encerra o desafio. | Mostrar componentes e ligações reais; exigir uma cadeia Entrada → Processar → Armazenar → Saída. |
| **Guardiões dos dados** | EI03CO10/11, EF01CO07, EF02CO06, EF03CO09, EF04CO07/08, EF05CO08/09: segurança, ética, fonte e autoria | Proteger todas as estações de dados. | Apresentar alternativas de compartilhamento, evidências de fonte, licenças e consequências para a decisão. |
| **Comunidade do futuro** | EF03CO07/08, EF04CO06, EF05CO10/011: pesquisa, criação e impacto | Construir um artefato ativando as partes marcadas. | Oferecer projetos alternativos com critérios de escolha e efeitos sociais comparáveis. |

## Blocos adicionais desta versão

- **Pintar pixel**: marca uma célula-alvo e permite que ciclos produzam um desenho.
- **Alternar sinal**: muda interruptores entre 0 e 1; a condição de vitória verifica o estado final.
- **Gravar sinal**, **Conectar peça**, **Proteger dado** e **Construir**: concluem estações específicas e atualizam a célula correspondente.

Esses verbos compartilham o mesmo mecanismo de execução em uma estação marcada, mas têm blocos e resultados visuais próprios para manter o programa legível. Eles são protótipos de interação: “proteger” ainda não é uma avaliação completa de privacidade, e “conectar” ainda não verifica uma rede de fios entre componentes.

## Revisão curricular

As atividades de mosaico agora avaliam uma ação concreta além de caminhar; as etapas de repetição também exigem os blocos de repetição. A etapa de sinais avalia estado binário simples. As competências de classificação, decomposição, operadores booleanos, pesquisa, consentimento, confiabilidade e impacto social continuam como metas de extensão, porque ainda não há escolhas, dados ou consequências suficientes para avaliá-las honestamente.
