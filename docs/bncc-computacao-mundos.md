# Mundos de Computação e BNCC

Base curricular: *Computação na Educação Básica – Complemento à BNCC* (2022), documento complementar de 75 páginas. As páginas abaixo são a numeração impressa no documento. Os códigos foram mantidos como aparecem na fonte, inclusive **EF05CO011**.

## Cobertura dos 10 mundos

Cada mundo tem cinco etapas. Os códigos de cada etapa aparecem nos cartões do catálogo e nos dados da missão. A progressão de dificuldade é uma proposta de design do Mangueblock, não uma sequência oficial da BNCC.

| Mundo | Foco | Objetivos associados |
|---|---|---|
| Padrões do mangue | Padrões, classificação e atributos essenciais | EI03CO01, EI03CO03, EF01CO01, EF02CO01, EF03CO03 |
| Trilhas do cotidiano | Sequências, execução, criação e comparação de algoritmos | EI03CO02, EI03CO03, EI03CO04, EI03CO05, EF01CO02, EF01CO03, EF03CO03 |
| Sentinelas do estuário | Estados, lógica, negação e decisões | EI03CO06, EI03CO07, EF03CO01, EF05CO03, EF05CO04 |
| Marés em repetição | Padrões e repetições simples, condicionais e aninhadas | EI03CO01, EI03CO04, EF02CO02, EF03CO02, EF04CO03, EF05CO04 |
| Resgate do manguezal | Decomposição e recombinação de problemas | EI03CO02, EI03CO04, EI03CO05, EF03CO02, EF03CO03, EF05CO04 |
| Cartógrafos da restinga | Matrizes, coordenadas, registros, listas e grafos | EF04CO01, EF04CO02, EF05CO01, EF05CO02, EF05CO03 |
| Mensagens da lagoa | Informação, codificação, formatos e dados | EF01CO04, EF01CO05, EF03CO04, EF03CO05, EF04CO04, EF04CO05 |
| Oficina de ferramentas | Artefatos, máquinas, hardware, software e sistemas | EI03CO08, EI03CO09, EF01CO06, EF02CO03, EF02CO04, EF02CO05, EF03CO06, EF05CO05, EF05CO06, EF05CO07 |
| Guardiões dos dados | Hábitos saudáveis, segurança, privacidade, ética e autoria | EI03CO10, EI03CO11, EF01CO07, EF02CO06, EF03CO09, EF04CO07, EF04CO08, EF05CO08, EF05CO09 |
| Comunidade do futuro | Pesquisa, criação, escolha de tecnologia e impactos sociais | EI03CO09, EF01CO06, EF03CO07, EF03CO08, EF04CO06, EF05CO011, EF05CO08, EF05CO09, EF05CO10 |

## Inventário dos objetivos considerados

As descrições abaixo resumem os objetivos da fonte. O código correspondente está ligado a uma ou mais etapas acima.

| Etapa e páginas impressas | Códigos e objetivo resumido |
|---|---|
| Educação Infantil, pp. 2–4 | EI03CO01 padrões de repetição; EI03CO02 expressar etapas em ordem; EI03CO03 vivenciar a execução de algoritmos; EI03CO04 criar e representar algoritmos; EI03CO05 comparar soluções; EI03CO06 decisões verdadeiro/falso. |
| Educação Infantil, pp. 6–8 | EI03CO07 reconhecer dispositivos e estados ligado/desligado; EI03CO08 compreender interfaces; EI03CO09 reconhecer dispositivos e modos de interação; EI03CO10 usar tecnologia com segurança, consciência e respeito; EI03CO11 adotar hábitos saudáveis no uso de artefatos computacionais. |
| 1º ano, pp. 12–14 | EF01CO01 organizar objetos por características; EF01CO02 identificar e seguir sequências; EF01CO03 criar e reordenar algoritmos; EF01CO04 reconhecer informação, armazenamento e transmissão; EF01CO05 representar informação por codificações; EF01CO06 explorar artefatos para necessidades pessoais e coletivas; EF01CO07 usar tecnologia com segurança e proteger dados pessoais. |
| 2º ano, p. 16 | EF02CO01 criar e comparar modelos, padrões e atributos; EF02CO02 criar e simular algoritmos com sequências e repetição definida simples; EF02CO03 reconhecer conjuntos de instruções de máquinas; EF02CO04 distinguir hardware e software; EF02CO05 reconhecer tecnologias computacionais do cotidiano; EF02CO06 reconhecer cuidados de segurança. |
| 3º ano, pp. 18–22 | EF03CO01 proposições verdadeiras/falsas e negação; EF03CO02 algoritmos com repetição condicionada; EF03CO03 decompor e recombinar problemas; EF03CO04 relacionar dados e informação; EF03CO05 escolher estruturas e formatos de dados; EF03CO06 reconhecer interfaces físicas de entrada/saída; EF03CO07 pesquisar com navegador e busca; EF03CO08 criar conteúdos digitais em diferentes formatos; EF03CO09 reconhecer impactos de compartilhar dados pessoais. |
| 4º ano, pp. 24–26 | EF04CO01 representar matrizes com posições coordenadas; EF04CO02 representar objetos com registros de campos nomeados; EF04CO03 criar e simular algoritmos com repetição simples, aninhada, definida ou indefinida; EF04CO04 compreender codificação digital de dados; EF04CO05 codificar informação, inclusive binário, ASCII e atributos de pixels; EF04CO06 criar conteúdo com ferramentas computacionais; EF04CO07 agir eticamente com dados; EF04CO08 verificar confiabilidade de fontes. |
| 5º ano, pp. 28–32 | EF05CO01 representar coleções ordenadas como listas; EF05CO02 representar relações como grafos; EF05CO03 operar NOT/AND/OR; EF05CO04 criar e simular algoritmos com repetição e seleção condicional; EF05CO05 reconhecer entrada, saída, processamento e armazenamento; EF05CO06 reconhecer armazenamento local/remoto; EF05CO07 reconhecer o papel do sistema operacional; EF05CO08 avaliar criticamente informação online; EF05CO09 respeitar direitos autorais; EF05CO10 refletir sobre tecnologia, trabalho e sociedade; EF05CO011 identificar tecnologias adequadas a um problema. |

## Mecânicas de programação

- **Repetir 2× / 3×** repete o próximo comando de movimento o número indicado. A etapa exige um comando logo depois do bloco.
- **Se livre, avançar** testa a célula à frente e só avança se ela não for obstáculo nem água.
- **Se houver água** atravessa uma célula de água com um salto; sem água à frente, avança uma célula. O mapa precisa ter chão livre no destino do salto.
- Os mapas são grades com início, objetivo, item opcional, água e obstáculos. As etapas foram verificadas executando a solução cadastrada no mesmo simulador do jogo.

As etapas sobre segurança, pesquisa, autoria, escolha de ferramentas e impactos sociais dão contexto e códigos curriculares às missões; a validação desses objetivos também depende da mediação pedagógica e de conversas com a turma, não apenas do resultado de uma rota no jogo.
