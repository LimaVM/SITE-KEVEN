/* ==========================================================
   TODO O TEXTO DO SITE MORA AQUI.
   Tema: a ânsia de ter e o tédio de possuir.
   Regra da casa: frase curta. se não couber num respiro, corta.
   Regra 2: nada de travessão.
   Regra 3: o site não explica. ele faz você sentir e só então comenta.
   ========================================================== */

export const boot = {
  lines: [
    '> catalogando o que você quis este ano...',
    '> 0 itens ainda te alegram',
    '> pronto.'
  ],
  foot: 'nada à venda aqui. o desejo é seu.',
  cta: 'entrar',
  ctaTaunts: ['tem certeza?', 'ainda dá tempo', 'então entra']
}

export const hero = {
  kicker: '// a ânsia de ter e o tédio de possuir',
  title: ['você quer até conseguir.', 'depois só quer outra coisa.'],
  typed: [
    'quanto durou a última coisa que você quis muito?',
    'o desejo não quer o objeto. quer o desejo.',
    'entre a falta e o tédio, sobra pouco.'
  ],
  scroll: 'desce ↓',
  portrait: {
    src: './assets/kev.jpeg',
    alt: 'retrato em preto e branco de um rosto sem expressão',
    tag: 'sujeito 01 / já quis tudo isso'
  }
}

export const marquee = 'QUERER DÓI  ✶  TER CANSA  ✶  E O PÊNDULO NÃO PARA  ✶  '

export const manifesto = {
  kicker: '// o pêndulo',
  title: ['a falta dói.', 'a posse cansa.'],
  body: `Você passa meses atrás de uma coisa. Consegue. Três semanas depois ela é
só mais um objeto na casa, e a lista já tem outro nome no topo.`,
  caption: 'fig. 01 / você, três semanas depois',
  btn: 'quero mais',
  btnTaunts: ['sempre quer.', 'de novo?', 'então pega.'],
  btnDone: 'e agora?'
}

/* ---------- a dose: tolerância ---------- */
export const dose = {
  kicker: '// a dose',
  title: 'aperta. sente.',
  hint: 'a dose é sempre a mesma.',
  btn: 'aperta',
  meter: 'o que você sentiu',
  /* comentários que aparecem conforme a intensidade cai */
  beats: {
    3: 'já foi melhor na primeira.',
    6: 'mesma dose. metade do efeito.',
    9: 'quase nada agora.',
    11: 'zero. a dose não mudou.'
  },
  dead: 'você continua apertando um botão que não te dá mais nada.',
  deadAgain: 'e de novo.',
  reset: 'zerar',
  resetMsg: 'não zera. isso não volta.'
}

/* ---------- mimese: você quer o que querem ---------- */
export const mimese = {
  kicker: '// a escolha',
  title: 'qual você quer?',
  hint: 'os dois são objetos. escolhe um.',
  badge: n => `${n.toLocaleString('pt-BR')} pessoas querem este`,
  rounds: [
    'agora o outro é o disputado.',
    'você trocou de lado junto com o número.',
    'de novo o número mudou de lugar.'
  ],
  reveal: [
    'os dois quadrados são o mesmo quadrado.',
    'sempre foram.'
  ],
  revealSub: 'você não escolheu um objeto. escolheu o que estava sendo escolhido.',
  again: 'escolher de novo'
}

/* ---------- esteira: a meta anda junto ---------- */
export const esteira = {
  kicker: '// a meta',
  title: 'chega lá.',
  hint: 'segura pra avançar.',
  push: 'avançar',
  goal: 'meta',
  you: 'você',
  stop: 'parar',
  marks: {
    120: 'a barra andou. a meta também.',
    260: 'mais rápido não diminui a distância.',
    420: 'a distância é fixa. o esforço não.'
  },
  stopped: ['você parou e a distância continuou a mesma.', 'ela nunca foi sobre chegar.'],
  dist: 'falta'
}

export const counter = {
  label: 'segundos desde que a última compra parou de te alegrar',
  foot: 'estimativa generosa.'
}

export const silence = {
  kicker: '// o teste',
  title: ['segure 10 segundos', 'sem querer nada.'],
  hint: 'enquanto você segura, o site para de te oferecer coisa.',
  hold: 'segure',
  holding: 'fica.',
  fails: [
    'soltou.',
    'dez segundos. só isso.',
    'já procurando a próxima?',
    'de novo. sem pressa.'
  ],
  win: 'dez segundos e não faltou nada.',
  reward: [
    'Repara: não faltou nada.',
    'A falta era o que você trouxe junto.'
  ]
}

export const choice = {
  kicker: '// escolhe',
  title: 'os dois lados do pêndulo:',
  loud: 'quero mais',
  quiet: 'já tenho',
  loudReply: [
    'então corre.',
    'a lista não acaba. é esse o combinado.'
  ],
  quietReply: [
    'então para de correr.',
    'tudo que é seu hoje já foi coisa que você quis.'
  ]
}

export const trace = {
  warn: 'antes de ir procurar a próxima coisa:',
  title: 'eu sei quem leu isso até aqui.',
  foot: 'é só você e o pêndulo.',
  footEm: 'por enquanto.'
}

export const alerta = {
  tag: 'aviso do sistema',
  title: 'desejo em nível crítico',
  body: 'você já quis 2.418 coisas. 3 ainda te alegram. deseja continuar?',
  yes: 'quero mais',
  no: 'chega'
}

export const trilha = {
  on: 'som',
  off: 'mudo',
  blocked: 'ligar som',
  credit: 'The Weeknd, Playboi Carti · Timeless'
}

export const footer = {
  big: 'o pêndulo é você',
  small: 'a falta dói · a posse cansa · o meio é curto, repara nele',
  sig: 'Zyzz'
}

export const exitIntent = 'já vai? tem coisa nova te esperando.'
