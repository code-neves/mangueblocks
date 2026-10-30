const worldPlans = [
  { id:'padroes-do-mangue',mode:'paint',title:'Padrões do mangue',subtitle:'Observe semelhanças, diferenças e repetições na natureza.',description:'Complete pequenos mosaicos observando a regra que se repete.',icon:'tree',axes:['Pensamento Computacional'],focus:'Reconhecer padrões, classificar objetos e escolher atributos essenciais.',years:[0,1,2],stages:[
    ['Folhas em sequência','Continue a sequência de sinais até a clareira.',['EI03CO01'],'RRR',1,'a folha'],
    ['Ritmo da maré','Repita o movimento indicado e recolha o marcador.',['EI03CO01','EI03CO03'],'RRDR',2,'o marcador'],
    ['Separar por característica','Agrupe os sinais iguais antes de chegar ao posto.',['EF01CO01'],'RRDD',2,'a etiqueta'],
    ['Modelo da restinga','Compare o modelo com o trecho que precisa ser percorrido.',['EF02CO01'],'RRDRR',3,'a amostra'],
    ['A pista essencial','Use só a característica que distingue o alvo.',['EF02CO01','EF03CO03'],'RRDDLL',3,'a amostra']
  ]},
  { id:'trilhas-do-cotidiano',mode:'route',title:'Trilhas do cotidiano',subtitle:'Transforme uma tarefa conhecida em passos claros.',description:'Planeje, execute, reorganize e compare instruções para levar cada missão até o fim.',icon:'flag',axes:['Pensamento Computacional'],focus:'Organizar passos, executar algoritmos e comparar soluções para um mesmo problema.',years:[0,1,3],stages:[
    ['A primeira tarefa','Coloque os passos da rotina na ordem em que acontecem.',['EI03CO02'],'RRR',1,'o cartão'],
    ['Brincar de algoritmo','Execute a sequência de comandos do começo ao fim.',['EI03CO03'],'RRDR',2,'o cartão'],
    ['Reordenar os passos','Descubra a ordem que conecta o ponto inicial à bandeira.',['EF01CO02'],'RRDD',2,'a instrução'],
    ['Criar uma rota','Monte uma sequência precisa e revise cada movimento.',['EF01CO03','EI03CO04'],'RRDLL',2,'a instrução'],
    ['Duas soluções','Compare rotas possíveis e escolha uma sequência eficiente.',['EI03CO05','EF03CO03'],'RRDRR',3,'o registro']
  ]},
  { id:'sentinelas-do-estuario',mode:'switch',title:'Sentinelas do estuário',subtitle:'Leia estados e use condições para escolher uma ação.',description:'Altere o estado dos sinais no tabuleiro e descubra quais precisam ficar ligados.',icon:'eye',axes:['Pensamento Computacional'],focus:'Trabalhar verdadeiro/falso, negação, operadores lógicos e decisões condicionais.',years:[0,3,5],stages:[
    ['Ligado ou desligado','Observe os estados dos dispositivos e siga até o sinal ativo.',['EI03CO06','EI03CO07'],'RRR',1,'o sinal'],
    ['Sinais em dois estados','Alterne cada interruptor e deixe o painel ativo.',['EI03CO06','EF03CO01'],'RRDR',2,'a resposta'],
    ['Religar o painel','Ative todos os sinais do posto de observação.',['EF03CO01'],'RRDD',2,'o marcador'],
    ['Rede de sensores','Alterne os sensores até iluminar a rede.',['EF05CO03'],'RRDLL',2,'o marcador'],
    ['Canal com alerta','Ative os sinais do canal usando também a condição de passagem.',['EF05CO03','EF05CO04'],'RRDRR',3,'o registro',false,'ifClear']
  ]},
  { id:'mares-em-repeticao',mode:'paint',title:'Marés em repetição',subtitle:'Descubra quando repetir um passo e quando parar.',description:'Use ciclos para desenhar ritmos e padrões no tabuleiro.',icon:'wave',axes:['Pensamento Computacional'],focus:'Usar repetição definida e condicional, identificar padrões e planejar ciclos.',years:[0,2,3,4,5],stages:[
    ['Ritmo repetido','Repita um movimento para completar o padrão.',['EI03CO01','EI03CO04'],'RRRR',2,'a concha',true],
    ['Duas vezes','Use repetição definida para atravessar um trecho reto.',['EF02CO02'],'RRRRR',3,'a concha',true],
    ['Enquanto houver passagem','Use “Se livre, avançar” para percorrer um corredor.',['EF03CO02'],'RRRRRR',4,'o sinal',false,'ifClear'],
    ['Ciclos aninhados','Organize segmentos repetidos com mudanças de direção.',['EF04CO03'],'RRDDRR',3,'a peça',true],
    ['Repetir e decidir','Combine repetição com uma decisão sobre o terreno.',['EF04CO03','EF05CO04'],'RRRRDD',4,'o marcador',true,'ifClear']
  ]},
  { id:'resgate-do-manguezal',mode:'gather',title:'Resgate do manguezal',subtitle:'Divida um problema grande em tarefas menores.',description:'Recolha todos os materiais do setor; cada etapa acrescenta uma parte ao kit de resgate.',icon:'sprout',axes:['Pensamento Computacional'],focus:'Decompor tarefas, resolver partes e recombinar soluções em um algoritmo.',years:[0,3,4,5],stages:[
    ['Levar o kit','Resolva a tarefa usando passos em ordem.',['EI03CO02','EI03CO04'],'RRR',1,'o kit'],
    ['Separar a limpeza','Resolva primeiro o trecho curto e depois continue.',['EF03CO03'],'RRDR',2,'o material'],
    ['Reunir as equipes','Combine dois caminhos para concluir o resgate.',['EF03CO03'],'RRDDRR',3,'o material'],
    ['Reusar uma solução','Aplique uma sequência conhecida em uma nova área.',['EI03CO05','EF03CO03'],'RRDLL',2,'o registro'],
    ['Plano coletivo','Compare etapas e conclua a rota colaborativa.',['EF03CO02','EF03CO03','EF05CO04'],'RRDDLL',3,'o kit']
  ]},
  { id:'cartografos-da-restinga',mode:'visit',title:'Cartógrafos da restinga',subtitle:'Leia posições, registros e conexões no mapa.',description:'Registre uma rota visitando os marcos na ordem indicada; não há bandeira final.',icon:'flag',axes:['Pensamento Computacional'],focus:'Representar posições em matrizes, registrar atributos e modelar rotas com listas e grafos.',years:[4,5],stages:[
    ['Linha e coluna','Localize o marcador pela posição no mapa.',['EF04CO01'],'RRR',1,'a coordenada'],
    ['Coordenadas do posto','Percorra a grade até a posição indicada.',['EF04CO01'],'RRDR',2,'a coordenada'],
    ['Ficha do lugar','Encontre o local a partir das características registradas.',['EF04CO02','EF05CO01'],'RRDD',2,'a ficha'],
    ['Nós e caminhos','Siga as conexões entre pontos do mapa.',['EF05CO02'],'RRDLL',2,'o nó'],
    ['Rota mais adequada','Compare caminhos e selecione o que atende às condições.',['EF05CO02','EF05CO03'],'RRDDRR',3,'o mapa']
  ]},
  { id:'mensagens-da-lagoa',mode:'encode',title:'Mensagens da lagoa',subtitle:'Codifique sinais e transforme dados em informação.',description:'Grave sinais nos quadrados marcados para montar mensagens em diferentes formatos.',icon:'book',axes:['Mundo Digital','Pensamento Computacional'],focus:'Distinguir dado e informação e representar mensagens com códigos digitais, pixels e bits.',years:[1,3,4],stages:[
    ['Sinal de partida','Leve o ícone correto ao ponto de encontro.',['EF01CO04'],'RRR',1,'o sinal'],
    ['Dois códigos','Percorra a sequência e recolha o símbolo codificado.',['EF01CO05'],'RRDR',2,'o código'],
    ['Dado ou informação?','Reúna a observação que responde à pergunta.',['EF03CO04'],'RRDD',2,'o dado'],
    ['Escolher o formato','Use o registro adequado para organizar a mensagem.',['EF03CO05'],'RRDLL',2,'o registro'],
    ['Mensagem em pixels','Recupere o símbolo codificado no mapa quadriculado.',['EF04CO04','EF04CO05'],'RRRRDD',3,'o pixel',false,'ifWater']
  ]},
  { id:'oficina-de-ferramentas',mode:'connect',title:'Oficina de ferramentas',subtitle:'Descubra como dispositivos recebem, processam e enviam sinais.',description:'Conecte os componentes no tabuleiro para completar circuitos de entrada e saída.',icon:'cards',axes:['Mundo Digital'],focus:'Reconhecer artefatos, instruções de máquinas, hardware, software e componentes de sistemas.',years:[0,1,2,3,5],stages:[
    ['Como interagir','Escolha o caminho que corresponde ao modo de interação.',['EI03CO08','EI03CO09'],'RRR',1,'o dispositivo'],
    ['Ferramenta da comunidade','Leve o recurso adequado ao ponto de apoio.',['EF01CO06'],'RRDR',2,'a ferramenta'],
    ['Cada máquina, suas instruções','Siga os comandos que a máquina consegue executar.',['EF02CO03','EF02CO05'],'RRDD',2,'o comando'],
    ['Entrada e saída','Conecte a entrada ao resultado esperado.',['EF02CO04','EF03CO06'],'RRDLL',2,'a interface'],
    ['Sistema completo','Relacione processamento, armazenamento e sistema operacional.',['EF05CO05','EF05CO06','EF05CO07'],'RRDDRR',3,'o componente']
  ]},
  { id:'guardioes-dos-dados',mode:'protect',title:'Guardiões dos dados',subtitle:'Cuide de si, das outras pessoas e das informações.',description:'Proteja os registros sensíveis antes que a maré de dados os alcance.',icon:'access',axes:['Cultura Digital'],focus:'Desenvolver hábitos saudáveis, segurança e privacidade, ética no uso de dados e respeito à autoria.',years:[0,1,2,3,4,5],stages:[
    ['Pausa consciente','Faça uma pausa e siga a rota de uso saudável.',['EI03CO10','EI03CO11'],'RRR',1,'o lembrete'],
    ['Proteger informações','Leve apenas a informação necessária ao posto seguro.',['EF01CO07'],'RRDR',2,'o dado'],
    ['Uso com cuidado','Escolha o dispositivo e a conduta mais segura.',['EF02CO06'],'RRDD',2,'o selo'],
    ['Antes de compartilhar','Considere o impacto para colegas e trate os dados com ética.',['EF03CO09','EF04CO07'],'RRDLL',2,'o consentimento'],
    ['Fonte e autoria','Confira a confiabilidade e a licença antes de reutilizar.',['EF04CO08','EF05CO08','EF05CO09'],'RRDDRR',3,'a referência']
  ]},
  { id:'comunidade-do-futuro',mode:'build',title:'Comunidade do futuro',subtitle:'Crie soluções digitais para necessidades reais da comunidade.',description:'Monte um artefato coletivo ativando as partes necessárias ao projeto.',icon:'tree',axes:['Mundo Digital','Cultura Digital'],focus:'Pesquisar e criar conteúdo, escolher tecnologias adequadas e refletir sobre impactos sociais.',years:[0,1,3,4,5],stages:[
    ['Uma necessidade comum','Explore um recurso que ajuda a comunidade.',['EI03CO09','EF01CO06'],'RRR',1,'a ideia'],
    ['Pesquisar para descobrir','Siga as pistas até a informação encontrada na busca.',['EF03CO07'],'RRDR',2,'a fonte'],
    ['Criar para aprender','Leve os elementos necessários para compor um artefato digital.',['EF03CO08','EF04CO06'],'RRDD',2,'o recurso'],
    ['Escolher uma tecnologia','Compare alternativas para resolver o problema da comunidade.',['EF05CO011'],'RRDLL',2,'a proposta'],
    ['Tecnologia e sociedade','Avalie os efeitos da solução e apresente evidências com responsabilidade.',['EF05CO10','EF05CO08','EF05CO09'],'RRDDRR',3,'a evidência']
  ]}
];

function taskIndices(route, mode, itemAt) {
  const end = route.length;
  const points = mode === 'gather'
    ? [itemAt, Math.max(1, end - 1), end]
    : [1, Math.max(2, Math.ceil(end / 2)), end];
  return [...new Set(points)];
}

function scenarioMap(route, itemAt, waterAt=-1, mode='route', taskAt=[]) {
  const vectors={R:[1,0],D:[0,1],L:[-1,0],U:[0,-1]}, points=[{x:0,y:0}];
  for(const step of route){const [dx,dy]=vectors[step],p=points.at(-1);points.push({x:p.x+dx,y:p.y+dy});}
  const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
  const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
  const width=Math.max(4,maxX-minX+3),height=Math.max(3,maxY-minY+3);
  const grid=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>mode!=='route'&&x>0&&y>0&&x<width-1&&y<height-1?'.':'#'));
  const cells=points.map(p=>({x:p.x-minX+1,y:p.y-minY+1}));
  cells.forEach((p,i)=>grid[p.y][p.x]=i===0?'S':i===points.length-1&&mode==='route'?'G':'.');
  if(waterAt>0&&waterAt<cells.length-1){const p=cells[waterAt];grid[p.y][p.x]='o';}
  if (mode === 'route') {
    const item=cells[itemAt];if(item&&grid[item.y][item.x]==='.')grid[item.y][item.x]='*';
  } else {
    const marker = mode === 'switch' ? '!' : mode === 'visit' ? 'c' : mode === 'gather' ? '*' : 'p';
    taskAt.forEach(index => { const point=cells[index];if(point&&grid[point.y][point.x]==='.')grid[point.y][point.x]=marker; });
  }
  return {map:grid.map(row=>row.join('')),taskPoints:taskAt.map(index=>`${cells[index].x},${cells[index].y}`)};
}

function scenarioSolution(route,itemAt,waterAt=-1,compress=false,conditional='',mode='route',taskAt=[]){
  const direction={R:1,D:2,L:3,U:0};let facing=1,out=[];
  const turnAndMove=dir=>{const delta=(direction[dir]-facing+4)%4;if(delta===1)out.push('right');else if(delta===3)out.push('left');else if(delta===2)out.push('right','right');facing=direction[dir];out.push('fwd');};
  const interactAt=index=>{
    if(mode==='route'){if(index===itemAt)out.push('act');return;}
    if(mode==='visit')return;
    else if(mode==='gather'&&taskAt.includes(index))out.push('act');
    else if(mode==='switch'&&taskAt.includes(index))out.push('toggle');
    else if(taskAt.includes(index))out.push(mode);
  };
  for(let i=0;i<route.length;){
    if(waterAt===i+1){const delta=(direction[route[i]]-facing+4)%4;if(delta===1)out.push('right');else if(delta===3)out.push('left');else if(delta===2)out.push('right','right');facing=direction[route[i]];out.push('ifWater');i+=2;}
    else{turnAndMove(route[i]);i++;}
    interactAt(i);
  }
  if(conditional){const at=out.indexOf('fwd');if(at>=0)out[at]=conditional;}
  if(compress){const packed=[];for(let i=0;i<out.length;){if(out[i]!=='fwd'){packed.push(out[i++]);continue;}let j=i;while(out[j]==='fwd')j++;let n=j-i;if(n>=3){packed.push('repeat3','fwd');n-=3;}if(n===2){packed.push('repeat2','fwd');n=0;}while(n-->0)packed.push('fwd');i=j;}out=packed;}
  return out;
}

const worldColors=['#277C48','#2864C5','#E76F21','#16827b','#803DA5','#9a7400','#2585a0','#5865a8','#b44b54','#287a64'];
const objectivePrompts={
  EI03CO01:'Que parte do padrão se repete?',EI03CO02:'Quais passos precisam vir primeiro e por quê?',EI03CO03:'O que acontece quando cada instrução é executada?',EI03CO04:'Que sequência você criaria para resolver a tarefa?',EI03CO05:'As duas soluções funcionam? Qual tem menos passos?',EI03CO06:'A afirmação é verdadeira ou falsa?',EI03CO07:'Qual dispositivo está ligado ou desligado?',EI03CO08:'Como a interface comunica a instrução?',EI03CO09:'Que forma de interação atende a essa necessidade?',EI03CO10:'Como usar esse recurso com segurança e respeito?',EI03CO11:'Que pausa ou hábito torna o uso mais saudável?',
  EF01CO01:'Que característica permite agrupar esses objetos?',EF01CO02:'Qual é a ordem das etapas da tarefa?',EF01CO03:'Como representar a solução com instruções ordenadas?',EF01CO04:'Que informação foi armazenada ou transmitida?',EF01CO05:'Como o mesmo sinal pode ser representado por outro código?',EF01CO06:'Que necessidade pessoal ou coletiva o artefato atende?',EF01CO07:'Quais dados pessoais precisam permanecer protegidos?',
  EF02CO01:'Quais atributos são essenciais para representar esse modelo?',EF02CO02:'Que instrução se repete e quantas vezes?',EF02CO03:'Quais instruções essa máquina consegue executar?',EF02CO04:'O que é componente físico e o que é instrução?',EF02CO05:'Onde essa tecnologia aparece no cotidiano?',EF02CO06:'Que cuidado protege o dispositivo e quem o utiliza?',
  EF03CO01:'Como a negação muda o valor verdadeiro ou falso?',EF03CO02:'Quando a condição permite repetir ou interromper?',EF03CO03:'Em quais partes menores você pode dividir o problema?',EF03CO04:'Que dado observado responde à pergunta?',EF03CO05:'Qual formato organiza melhor essa informação?',EF03CO06:'Que elemento recebe a entrada e qual apresenta a saída?',EF03CO07:'Que termos de busca ajudam a encontrar uma fonte útil?',EF03CO08:'Qual formato digital comunica melhor sua ideia?',EF03CO09:'Quem pode ser afetado ao compartilhar esses dados?',
  EF04CO01:'Como a posição pode ser descrita por linha e coluna?',EF04CO02:'Quais campos nomeados descrevem esse objeto?',EF04CO03:'Que repetição pode conter outra repetição?',EF04CO04:'Por que os dados precisam de uma codificação digital?',EF04CO05:'Como bits, caracteres ou pixels representam essa mensagem?',EF04CO06:'Que conteúdo você criaria com uma ferramenta computacional?',EF04CO07:'Como coletar e usar esses dados de modo ético?',EF04CO08:'Que evidências ajudam a avaliar a confiabilidade da fonte?',
  EF05CO01:'Como uma lista mantém itens em uma ordem variável?',EF05CO02:'Quais pontos e conexões formam esse grafo?',EF05CO03:'Como NOT, AND ou OR alteram a decisão?',EF05CO04:'Qual condição escolhe o próximo conjunto de instruções?',EF05CO05:'Onde entram, são processados e saem os dados?',EF05CO06:'O dado está guardado localmente ou remotamente?',EF05CO07:'Como o sistema operacional coordena programa e hardware?',EF05CO08:'Que sinais mostram que uma informação online é confiável?',EF05CO09:'Como reconhecer e respeitar a autoria desse conteúdo?',EF05CO10:'Como essa tecnologia pode mudar o trabalho e a sociedade?',EF05CO011:'Qual tecnologia resolve melhor o problema e por quê?'
};
worldPlans.forEach((world,wi)=>{
  world.stages.forEach((stage,si)=>{
    const [title,description,codes,route,itemAt,itemName,compress=false,mechanic='']=stage;
    const waterAt=mechanic==='ifWater'?Math.min(2,route.length-1):-1;
    let taskAt=taskIndices(route,world.mode,itemAt).filter(index=>index!==waterAt);
    if(world.mode==='paint'&&compress)taskAt=[1,route.length].filter(index=>index!==waterAt);
    const scenario=scenarioMap(route,itemAt,waterAt,world.mode,taskAt);const {map}=scenario;
    const icon=wi===6?'star':world.icon;const solution=scenarioSolution(route,itemAt,waterAt,compress,mechanic==='ifClear'?'ifClear':'',world.mode,taskAt);
    const stageYears=[...new Set(codes.map(code=>code.startsWith('EI')?0:Number(code.slice(2,4))).filter(Number.isFinite))].sort((a,b)=>a-b);
    const modeGoal=['encode','connect','protect','build'].includes(world.mode)?'stations':world.mode;
    const actionNames={paint:'Pintar pixel',encode:'Gravar sinal',connect:'Conectar peça',protect:'Proteger dado',build:'Construir'};
    const activityName={paint:'mosaico',encode:'mensagem',connect:'circuito',protect:'proteção dos registros',build:'artefato'}[world.mode];
    const interaction=world.mode==='switch'?'Acione os interruptores até deixar todos os sinais ligados.':world.mode==='gather'?`Recolha todos os ${taskAt.length} materiais. A coleta completa encerra a etapa.`:world.mode==='visit'?'Passe pelos marcos numerados na ordem indicada; a última visita conclui a etapa.':world.mode==='route'?`Pegue ${itemName} e chegue à bandeira.`:`Use “${BI[world.mode].n}” em cada ponto para completar o ${activityName}. Não há bandeira final nesta atividade.`;
    const requiredBlockGroups=[];
    if(mechanic==='ifClear')requiredBlockGroups.push(['ifClear']);
    if(mechanic==='ifWater')requiredBlockGroups.push(['ifWater']);
    if(compress)requiredBlockGroups.push(['repeat2','repeat3']);
    if (modeGoal==='stations') requiredBlockGroups.push([world.mode]);
    if (modeGoal==='switch') requiredBlockGroups.push(['toggle']);
    const allowedBlocks=new Set(['fwd','left','right']);
    if(modeGoal==='route'||modeGoal==='gather')allowedBlocks.add('act');
    if(modeGoal==='switch')allowedBlocks.add('toggle');
    if(modeGoal==='paint'||modeGoal==='stations')allowedBlocks.add(world.mode);
    if(compress){allowedBlocks.add('repeat2');allowedBlocks.add('repeat3');}
    if(mechanic==='ifClear')allowedBlocks.add('ifClear');
    if(mechanic==='ifWater'){allowedBlocks.add('ifWater');allowedBlocks.add('jump');}
    const strategyText=requiredBlockGroups.length?` Use ${requiredBlockGroups.map(group=>group.map(id=>BI[id].n).join(' ou ')).join(' e ')} pelo menos uma vez.`:'';
    M.push({id:`${world.id}-${si+1}`,col:worldColors[wi],t:title,icon,d:description,goalText:`Objetivo: ${interaction}${strategyText}`,goalType:modeGoal,taskAction:['paint','stations'].includes(modeGoal)?world.mode:'',checkpoints:modeGoal==='visit'?scenario.taskPoints:[],taskActionLabel:actionNames[world.mode]||'',taskCount:taskAt.length,allowedBlocks:[...allowedBlocks],requiredBlockGroups,years:stageYears,cg:[2,5,10],sk:codes,item:itemName,ico:icon,ic:worldColors[wi],if:'#e3f2df',map,hint:`BNCC ${codes.join(', ')}. Para pensar: ${codes.map(code=>objectivePrompts[code]).filter(Boolean).join(' ')}`,sol:solution,mechanic:mechanic||(compress?'repetição contada':world.mode)});
  });
  const bnccCodes=[...new Set(world.stages.flatMap(stage=>stage[2]))];
  THEMES.push({id:world.id,title:world.title,subtitle:world.subtitle,description:world.description,icon:world.icon,axes:world.axes,focus:world.focus,bnccCodes,stages:world.stages.map((stage,i)=>({missionId:`${world.id}-${i+1}`,level:`Etapa ${String(i+1).padStart(2,'0')}`,skill:stage[2].join(' · ')}))});
});
