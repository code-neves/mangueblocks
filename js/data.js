/* Dados do app: cartões, competências e missões. Para criar uma missão, acrescente um item em M. */
const $ = id => document.getElementById(id);
const B = [{
    id: 'start',
    n: 'Início',
    c: '#D82E42',
    k: '#fff',
    h: 350
},
{
    id: 'fwd',
    n: 'Avançar',
    c: '#277C48',
    k: '#fff',
    h: 142
},
{
    id: 'left',
    n: 'Esquerda',
    c: '#2864C5',
    k: '#fff',
    h: 220
},
{
    id: 'right',
    n: 'Direita',
    c: '#E76F21',
    k: '#2b1300',
    h: 23
},
{
    id: 'jump',
    n: 'Pular',
    c: '#803DA5',
    k: '#fff',
    h: 278
},
{
    id: 'act',
    n: 'Pegar',
    c: '#F0CD3E',
    k: '#2b2300',
    h: 50
},
{
    id: 'end',
    n: 'Fim',
    c: '#00798A',
    k: '#fff',
    h: 186
},
{ id: 'repeat2', n: 'Repetir 2×', c: '#a63c8d', k: '#fff', h: 310 },
{ id: 'repeat3', n: 'Repetir 3×', c: '#b73f72', k: '#fff', h: 330 },
{ id: 'ifClear', n: 'Se livre, avançar', c: '#219c83', k: '#fff', h: 168 },
{ id: 'ifWater', n: 'Se houver água', c: '#91b946', k: '#fff', h: 90 },
{ id: 'paint', n: 'Pintar pixel', c: '#d75d4b', k: '#fff', h: 12 },
{ id: 'toggle', n: 'Alternar sinal', c: '#d49b28', k: '#27220e', h: 50 },
{ id: 'encode', n: 'Gravar sinal', c: '#2585a0', k: '#fff', h: 195 },
{ id: 'connect', n: 'Conectar peça', c: '#6575b8', k: '#fff', h: 235 },
{ id: 'protect', n: 'Proteger dado', c: '#287a64', k: '#fff', h: 150 },
{ id: 'build', n: 'Construir', c: '#a36c38', k: '#fff', h: 28 }
];
const BI = Object.fromEntries(B.map(b => [b.id, b]));
const CG = {
    2: 'Pensamento científico e criativo',
    4: 'Comunicação',
    5: 'Cultura digital',
    10: 'Responsabilidade e cidadania'
};
/* map: S início, G bandeira, * item, o água, # obstáculo, . chão. icon = ícone da missão; ico/ic/if = item coletável (ícone, traço, preenchimento) */
const M = [{
    id: 'horta',
    col: '#277C48',
    t: 'Semente na horta',
    icon: 'sprout',
    d: 'Pegue a semente e chegue à bandeira.',
    years: [1, 2, 3],
    cg: [2, 5, 10],
    sk: ['EF01CO03', 'EF02CO02', 'EF01MA12', 'EF02MA12'],
    item: 'a semente',
    allowedBlocks: ['fwd', 'left', 'right', 'jump', 'act'],
    ico: 'sprout',
    ic: '#277C48',
    if: '#cdeccf',
        map: ['S.*###', '##.###', '....oG'],
        hint: 'Pegue a semente antes de virar. A água pede um pulo!',
        goalText: 'Objetivo: pegue a semente, contorne o canteiro e atravesse a água.',
        sol: ['fwd', 'fwd', 'act', 'right', 'fwd', 'fwd', 'left', 'fwd', 'jump']
},
{
    id: 'rio',
    col: '#2864C5',
    t: 'Travessia do rio',
    icon: 'wave',
    d: 'Contorne as pedras, pegue a estrela e atravesse o rio.',
    years: [3, 4, 5],
    cg: [2, 4, 5],
    sk: ['EF03CO03', 'EF04CO01', 'EF03MA12', 'EF04MA16'],
    item: 'a estrela',
    allowedBlocks: ['fwd', 'left', 'right', 'jump', 'act'],
    ico: 'star',
    ic: '#9a7400',
    if: '#F0CD3E',
        map: ['####.G', '.*o..#', '.#####', 'S#####'],
        hint: 'Aqui o personagem começa olhando para o lado errado. Comece virando!',
        goalText: 'Objetivo: pegue a estrela e atravesse o rio pelo trecho seguro.',
        sol: ['left', 'fwd', 'fwd', 'right', 'fwd', 'act', 'jump', 'fwd', 'left', 'fwd', 'right', 'fwd']
},
{
    id: 'coelho',
    col: '#E76F21',
    t: 'Coelho e a cenoura',
    icon: 'rabbit',
    d: 'Leve o coelho até a bandeira, pegando a cenoura no caminho.',
    years: [0],
    cg: [2, 4],
    sk: ['EI03CO02', 'EI03CO03'],
    item: 'a cenoura',
    allowedBlocks: ['fwd', 'left', 'right', 'jump', 'act'],
    ico: 'carrot',
    ic: '#c4561a',
    if: '#f9c89c',
        fis: true,
        map: ['####', 'S.*G', '####'],
        hint: 'Pegue a cenoura antes de chegar na bandeira!',
        goalText: 'Objetivo: pegue a cenoura no caminho e leve o coelho até a bandeira.',
        sol: ['fwd', 'fwd', 'act', 'fwd']
}
];

const THEMES = [{
    id: 'aventura-mangue',
    title: 'Aventura pelo mangue',
    subtitle: 'Uma jornada de lógica entre a horta, os animais e as águas do manguezal.',
    description: 'Comece com caminhos curtos, aprenda a coletar itens e termine planejando uma travessia cheia de obstáculos.',
    axes: ['Pensamento Computacional'],
    focus: 'Sequenciar e executar algoritmos, comparar soluções e representar caminhos em uma grade.',
    bnccCodes: ['EI03CO02', 'EI03CO03', 'EF01CO03', 'EF02CO02', 'EF03CO03', 'EF04CO01'],
    icon: 'tree',
    stages: [
        { missionId: 'coelho', level: 'Primeiros passos', skill: 'Sequência de algoritmos · EI03CO02 · EI03CO03' },
        { missionId: 'horta', level: 'Novos caminhos', skill: 'Sequência e repetição · EF01CO03 · EF02CO02' },
        { missionId: 'rio', level: 'Desafio das águas', skill: 'Decomposição e grade · EF03CO03 · EF04CO01' },
    ],
}];
