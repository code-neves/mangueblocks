# Novos formatos de jogo por mundo

## Ideia central

O personagem ainda se move pela grade, mas a travessia deixou de ser a resposta para todos os desafios. Os mapas agora usam cinco tipos de conclusão: rota com coleta, mosaico, sinais ligados, coleta completa e marcos visitados em ordem. Alguns mundos também usam ações contextuais para gravar, conectar, proteger ou construir em estações do tabuleiro.

## Formatos implantados

| Formato | Como os blocos controlam o desafio | Como se vence |
| --- | --- | --- |
| Rota | Avançar, virar, pular, pegar, repetir e condições de terreno | Chegar à bandeira depois de coletar o item. |
| Mosaico | Movimento, repetição e Pintar pixel | Pintar todos os alvos; não há bandeira. |
| Sinais | Movimento e Alternar sinal | Deixar todos os interruptores ligados. |
| Recolha completa | Movimento e Pegar | Recolher todos os materiais; a coleta encerra a etapa. |
| Cartografia | Movimento e checkpoints automáticos | Visitar os marcos numerados na ordem. |
| Estações | Movimento e uma ação contextual (gravar, conectar, proteger ou construir) | Completar todas as estações marcadas. |

## Análise dos dez mundos

| Mundo e habilidades BNCC | Formato aplicado às etapas | Blocos centrais | O que ainda falta para avaliar toda a habilidade |
| --- | --- | --- | --- |
| **Padrões do mangue** — EI03CO01, EF01CO01, EF02CO01: repetição, classificação e atributos | Completar mosaicos pintando alvos. As etapas com repetição exigem Repetir 2× ou 3×. | Avançar, virar, Repetir, Pintar pixel | O tabuleiro demonstra repetição visual. Classificação real precisa de objetos com atributos e uma regra de agrupamento. |
| **Trilhas do cotidiano** — EI03CO02/03/04/05, EF01CO02/03, EF03CO03: sequência, criação, comparação e decomposição | Rota permanece como um dos formatos. A coleta e a navegação são etapas de execução de algoritmo. | Início, movimento, Pegar, Fim | Criar um modo de depuração com programa defeituoso, e comparar duas soluções por resultado ou custo. Decomposição pede sub-rotinas. |
| **Sentinelas do estuário** — EI03CO06/07, EF03CO01, EF05CO03/04: estados e lógica | Interruptores alteram 0/1; a vitória exige todos ligados. | Movimento, Alternar sinal | NOT, AND, OR e Se/Então/Senão ainda são necessários para exercitar proposições e ramificações. Hoje o jogo não afirma que já avalia esses operadores. |
| **Marés em repetição** — EI03CO01/04, EF02CO02, EF03CO02, EF04CO03, EF05CO04: ciclos | Desenhar um padrão na grade usando repetição contada; objetivos de ciclo exigem o bloco de repetição. | Movimento, Repetir, Pintar pixel, Se livre, Se houver água | Ciclos aninhados e Enquanto/Até precisam de uma estrutura de controle própria. A condição atual executa no máximo um avanço. |
| **Resgate do manguezal** — EI03CO02/04/05, EF03CO02/03, EF05CO04: decomposição e recomposição | Recolher todo o kit, sem exigir chegada a uma bandeira. | Movimento, Pegar, Repetir, condições | Adicionar carregar/entregar e sub-rotinas para que cada trecho seja uma sub tarefa que se combina no resgate. |
| **Cartógrafos da restinga** — EF04CO01/02, EF05CO01/02: coordenadas, registros, listas e grafos | Percorrer marcos numerados em ordem; o último marco encerra a atividade. | Movimento e sequência dos marcos | Blocos de ler/escrever coordenada, criar lista/registro e conectar nós. Os marcos atuais não formam ainda um grafo com escolhas. |
| **Mensagens da lagoa** — EF01CO04/05, EF03CO04/05, EF04CO04/05: dados, formato e codificação | Gravar sinais em alvos; cada célula muda de 0 para 1, sem bandeira final. | Movimento, Gravar sinal, Pintar pixel | Comparar codificações e ler uma mensagem exigem alvos 0/1 definidos e bloco Decodificar. O formato atual é uma primeira interação de escrita de bits. |
| **Oficina de ferramentas** — EI03CO08/09, EF01CO06, EF02CO03/04/05, EF03CO06, EF05CO05/06/07: interfaces e sistemas | Completar estações de conexão de circuito. | Movimento, Conectar peça, Alternar sinal | Representar componentes e fios, então validar conexões. Também faltam Entrada, Processar, Armazenar e Saída como estados observáveis. |
| **Guardiões dos dados** — EI03CO10/11, EF01CO07, EF02CO06, EF03CO09, EF04CO07/08, EF05CO08/09: segurança, ética, fontes e autoria | Proteger cada estação marcada; a proteção total encerra o desafio. | Movimento, Proteger dado | Casos com escolhas de público, consentimento, evidência de fonte, licença/autoria e pausa saudável precisam de opções e consequências diferentes; marcar uma estação não avalia essas decisões. |
| **Comunidade do futuro** — EF03CO07/08, EF04CO06, EF05CO10/011: pesquisa, criação e impacto | Construir um artefato ativando as partes marcadas. | Movimento, Construir, repetição | Escolher entre tecnologias, pesquisar fontes e comparar efeitos sociais pede alternativas visíveis, critérios e mais de um resultado possível. |

## Limites conhecidos

As ações contextuais mudam o estado de cada estação e fornecem uma condição de vitória diferente, mas ainda são interações simples. Elas não substituem atividades de decisão com alternativas e evidências. Em particular, “proteger”, “conectar” e “construir” precisam de estados internos mais ricos antes de poderem avaliar privacidade, sistemas ou projeto de artefatos com profundidade.

Próximas extensões com maior retorno pedagógico:

1. Blocos booleanos NOT, AND e OR com saídas visíveis.
2. Se/Então/Senão e Enquanto/Até, com execução de ramos e ciclos.
3. Sub-rotinas chamadas por nome para apoiar decomposição e ciclos aninhados.
4. Dados tipados (bits, registros, listas), com leitura e escrita verificáveis.
5. Conexões explícitas entre componentes e regras de entrada/processamento/saída.
6. Desafios com escolhas, fontes e consequências para segurança, autoria e impacto social.
