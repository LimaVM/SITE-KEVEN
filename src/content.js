/* ==========================================================
   TODO O TEXTO E OS LINKS DO CARTÃO MORAM AQUI.
   Tema: a ânsia de ter e o tédio de possuir.
   ========================================================== */

export const cartao = {
  handle: 'kevenskt',
  bio: 'a ânsia de ter e o tédio de possuir.',
  avatar: './assets/kev.jpeg',
  sig: 'Zyzz'
}

/* as frases se redigitam sozinhas embaixo da bio */
export const typed = [
  'quanto durou a última coisa que você quis muito?',
  'o desejo não quer o objeto. quer o desejo.',
  'entre a falta e o tédio, sobra pouco.',
  'você quer até conseguir. depois só quer outra coisa.'
]

export const entrada = {
  call: 'clique para entrar',
  /* a chamada pisca entre as variações, como sinal sujo */
  glitch: ['clique para entrar', 'cliq#e para ent#ar', 'clique para entrar', 'cl_que p4ra entrar']
}

export const links = [
  { id: 'instagram', nome: 'instagram', url: 'https://www.instagram.com/kevenskt/' },
  { id: 'spotify', nome: 'spotify', url: 'https://open.spotify.com/user/wfeaq3ypc10rdhw34cx71a4rm' },
  { id: 'discord', nome: 'discord', url: 'https://discord.com/users/938971182026350605' }
]

export const musica = {
  /* largue o arquivo em public/assets/trilha.mp3 e o site passa a tocar dali:
     sem anúncio, sem iframe, loop exato. enquanto o arquivo não existir,
     ele cai sozinho no embed do YouTube. */
  arquivo: './assets/trilha.mp3',

  video: '5EpyN_6dqyk',
  start: 24,
  titulo: 'Timeless',
  artista: 'The Weeknd, Playboi Carti',
  capa: 'https://i.ytimg.com/vi/5EpyN_6dqyk/hqdefault.jpg'
}

export const views = {
  label: 'visitas deste navegador'
}
