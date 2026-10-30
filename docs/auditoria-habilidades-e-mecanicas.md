# Auditoria de habilidades, objetivos e blocos

## Como uma etapa termina

Todas as 53 atividades pedem uma ação obrigatória além de alcançar a casa final: coletar o item indicado no mapa. A tela agora mostra esse objetivo em separado da descrição. As atividades sobre repetição e condição também exigem que o programa use o bloco ensinado; chegar à bandeira sem ele não conclui a etapa.

O simulador considera uma etapa concluída quando o personagem chega a `G`, coleta todos os itens `*` e cumpre os grupos de blocos exigidos pela etapa. Cada grupo aceita qualquer bloco listado nele. Se faltar algo, o jogo informa qual item ou bloco falta.

## Blocos que o jogo já executa

| Bloco | Função | Limite atual |
| --- | --- | --- |
| Início / Fim | Delimitam a sequência no Fluxo livre. | Não são comandos da simulação. |
| Avançar / Esquerda / Direita | Movimento e orientação na grade. | Executam uma ação por vez. |
| Pular | Atravessa uma casa de água e pousa em chão. | Não atravessa obstáculos nem água em série. |
| Pegar | Coleta o item da casa atual. | É a interação que registra o item exigido. |
| Repetir 2× / 3× | Repete o próximo comando de movimento. | Repetição contada, simples; sem ciclos aninhados. |
| Se livre, avançar | Avança uma casa se não houver obstáculo ou água. | Condição única; não tem ramo alternativo. |
| Se houver água | Avança ou pula conforme a casa à frente. | Condição específica do terreno; não é um bloco condicional geral. |

## Habilidades usadas e conjunto de blocos necessário

“Disponível” significa que há uma operação executável no jogo. “Parcial” indica que o kit cobre uma parte do conceito, mas não permite avaliar a habilidade inteira. “Falta” indica que o conceito aparece no currículo da atividade, mas ainda precisa de mecânica própria para ser exercitado de verdade.

### Educação Infantil

| Código | Habilidade trabalhada | Blocos necessários para avaliar a habilidade | Situação |
| --- | --- | --- | --- |
| EI03CO01 | Reconhecer padrões e repetições | Observar, comparar, classificar, Repetir 2×/3× | Parcial: repetição executável; comparação e classificação não existem. |
| EI03CO02 | Organizar instruções em sequência | Início, Avançar, Esquerda, Direita, Pegar, Fim | Disponível para sequências espaciais. |
| EI03CO03 | Executar e observar algoritmos | Início, comandos de movimento, Pegar, Fim | Disponível para algoritmos de navegação. |
| EI03CO04 | Criar algoritmos e reconhecer repetições | Movimento, Repetir 2×/3×, Pegar | Parcial: cria rotas e repetições simples; não cria outros tipos de algoritmo. |
| EI03CO05 | Comparar soluções | Executar, comparar passos/custo, escolher solução | Falta: o jogo não compara duas soluções. |
| EI03CO06 | Trabalhar com verdadeiro e falso | Verdadeiro, Falso, NÃO | Falta: as condições atuais não representam valores lógicos selecionáveis. |
| EI03CO07 | Reconhecer dispositivos e estados | Dispositivo, Entrada, Ligado/Desligado | Falta. |
| EI03CO08 | Interpretar interfaces | Observar interface, Entrada, Saída | Falta. |
| EI03CO09 | Reconhecer formas de interação | Toque, Teclado, Voz ou outro seletor de interação | Falta. |
| EI03CO10 | Usar tecnologia com segurança e respeito | Proteger, Consentir, Compartilhar com segurança | Falta. |
| EI03CO11 | Desenvolver hábitos saudáveis de uso | Pausar, Retomar, Limite de tempo | Falta. |

### 1º ano

| Código | Habilidade trabalhada | Blocos necessários para avaliar a habilidade | Situação |
| --- | --- | --- | --- |
| EF01CO01 | Classificar informações por atributos | Observar, Classificar por atributo, Conferir grupo | Falta. |
| EF01CO02 | Seguir instruções ordenadas | Início, movimento, Pegar, Fim | Disponível para sequências espaciais. |
| EF01CO03 | Criar e reorganizar algoritmos | Movimento, Repetir, Reordenar | Parcial: sequências existem; o kit não representa outras tarefas. |
| EF01CO04 | Entender dados armazenados/transmitidos | Ler, Armazenar, Enviar, Receber | Falta. |
| EF01CO05 | Representar dados com códigos | Codificar, Decodificar, Comparar representação | Falta. |
| EF01CO06 | Criar artefatos para uma necessidade | Escolher ferramenta, Criar, Testar resultado | Falta. |
| EF01CO07 | Proteger dados pessoais | Identificar dado pessoal, Proteger, Compartilhar com permissão | Falta. |

### 2º ano

| Código | Habilidade trabalhada | Blocos necessários para avaliar a habilidade | Situação |
| --- | --- | --- | --- |
| EF02CO01 | Representar objetos por atributos e padrões | Observar, Comparar, Modelar por atributos | Falta. |
| EF02CO02 | Reconhecer e usar repetições simples | Repetir 2×/3×, movimento | Disponível; as etapas correspondentes agora exigem repetição. |
| EF02CO03 | Executar instruções adequadas à máquina | Selecionar dispositivo, escolher instrução compatível, executar | Parcial: executa um conjunto pequeno de movimentos, sem modelos diferentes de máquina. |
| EF02CO04 | Distinguir hardware e software | Identificar componente físico, identificar programa/instrução | Falta. |
| EF02CO05 | Reconhecer computação no cotidiano | Identificar tecnologia, relacionar uso e necessidade | Falta. |
| EF02CO06 | Usar dispositivos com cuidado | Proteger, Pausar, Confirmar ação | Falta. |

### 3º ano

| Código | Habilidade trabalhada | Blocos necessários para avaliar a habilidade | Situação |
| --- | --- | --- | --- |
| EF03CO01 | Negação em proposições lógicas | Verdadeiro, Falso, NÃO, testar resultado | Falta. |
| EF03CO02 | Repetição condicionada | Enquanto/Até, condição, movimento | Parcial: há condição de uma única ação, sem ciclo que repete até uma condição mudar. |
| EF03CO03 | Decompor problemas em partes | Dividir tarefa, executar sub-rotina, reunir resultados | Falta: uma rota longa não demonstra decomposição. |
| EF03CO04 | Transformar dados em informação | Observar dado, relacionar pergunta, interpretar resultado | Falta. |
| EF03CO05 | Organizar dados em formatos | Escolher lista/tabela/registro, inserir e consultar | Falta. |
| EF03CO06 | Relacionar entrada e saída | Entrada, Processar, Saída | Falta. |
| EF03CO07 | Pesquisar com ferramentas digitais | Buscar, refinar termos, selecionar resultado | Falta. |
| EF03CO08 | Criar conteúdo digital | Criar, editar, testar/publicar | Falta. |
| EF03CO09 | Considerar efeitos do compartilhamento | Revisar público, consentimento, compartilhar | Falta. |

### 4º ano

| Código | Habilidade trabalhada | Blocos necessários para avaliar a habilidade | Situação |
| --- | --- | --- | --- |
| EF04CO01 | Representar posições em matrizes | Coordenada linha/coluna, ler e mover na grade | Parcial: a grade existe, mas não há bloco para ler ou registrar coordenadas. |
| EF04CO02 | Descrever registros com campos | Criar registro, nomear campo, consultar campo | Falta. |
| EF04CO03 | Usar repetições aninhadas ou condicionais | Repetir, bloco de sequência/sub-rotina, condição e ciclo | Parcial: repetições simples existem; não há aninhamento nem repetição condicional. |
| EF04CO04 | Compreender codificação digital | Codificar, Decodificar, comparar mensagem | Falta. |
| EF04CO05 | Representar caracteres/pixels/bits | Definir símbolo, codificar bits/pixels, ler representação | Falta. |
| EF04CO06 | Criar conteúdo computacional | Criar, editar, testar, revisar | Falta. |
| EF04CO07 | Coletar e usar dados eticamente | Coletar, consentir, anonimizar, compartilhar | Falta. |
| EF04CO08 | Avaliar confiabilidade de fontes | Buscar, comparar fontes, verificar evidências | Falta. |

### 5º ano

| Código | Habilidade trabalhada | Blocos necessários para avaliar a habilidade | Situação |
| --- | --- | --- | --- |
| EF05CO01 | Organizar elementos em listas | Criar lista, inserir, remover, consultar posição | Falta. |
| EF05CO02 | Modelar relações como grafos | Criar nó, criar ligação, percorrer/consultar grafo | Falta. |
| EF05CO03 | Usar NÃO, E e OU | Verdadeiro, Falso, NÃO, E, OU | Falta: “Se livre” não cobre operadores booleanos. |
| EF05CO04 | Combinar condição e repetição | Se/Então/Senão, Enquanto/Até, Repetir | Parcial: condição única e repetição contada; sem ramos ou ciclo condicional. |
| EF05CO05 | Identificar entrada, processamento e saída | Entrada, Processar, Armazenar, Saída | Falta. |
| EF05CO06 | Distinguir armazenamento local e remoto | Local, Nuvem/Remoto, Enviar, Recuperar | Falta. |
| EF05CO07 | Compreender o papel do sistema operacional | Sistema operacional, Programa, Hardware, alocar recurso | Falta. |
| EF05CO08 | Avaliar confiabilidade de informação | Buscar, comparar fonte, verificar evidência | Falta. |
| EF05CO09 | Respeitar autoria e licenças | Identificar autoria, verificar licença, citar | Falta. |
| EF05CO10 | Analisar efeitos da tecnologia na sociedade | Comparar cenários, identificar impacto, justificar escolha | Falta. |
| EF05CO011 | Selecionar tecnologia adequada | Comparar ferramentas por critérios, escolher e justificar | Falta. O código é mantido como aparece no material curricular usado pelo projeto. |

## Cobertura real e próximos blocos

Hoje o simulador avalia navegação, coleta, repetição contada e duas condições de terreno. Isso sustenta objetivos iniciais de algoritmos, repetição simples, coordenadas exploratórias e decisões sobre água/obstáculos. Não sustenta, por si só, todas as habilidades de dados, dispositivos, pesquisa, privacidade, autoria, lógica booleana ou impacto social listadas nos cartões.

Para ampliar a cobertura sem transformar a paleta em dezenas de botões isolados, a próxima família de blocos deve ser:

1. **Lógica:** Verdadeiro/Falso, NÃO, E, OU, Se/Então/Senão e Enquanto/Até.
2. **Dados:** Observar, Classificar, Registrar, Codificar/Decodificar, Criar lista/registro e Consultar.
3. **Sistemas:** Entrada, Processar, Armazenar local/remoto, Enviar/Receber e Saída.
4. **Cultura digital:** Buscar, Verificar fonte, Proteger dado, Consentir, Citar autoria, Pausar e Comparar impacto.
5. **Abstração e criação:** Criar sub-rotina, decompor/reunir tarefa, modelar nó/ligação e testar artefato.

Cada bloco novo precisa alterar o estado da simulação ou produzir um resultado observável. Um bloco que só aparece no programa, sem efeito ou condição de sucesso verificável, não conta como avaliação da competência.

## Códigos de Matemática nas três atividades originais

EF01MA12, EF02MA12, EF03MA12 e EF04MA16 são códigos de Matemática, não códigos BNCC Computação. As atividades originais mantêm esses vínculos interdisciplinares; a análise de blocos acima se concentra nas habilidades de Computação.
