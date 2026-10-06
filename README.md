# kevenskt

Cartão de entrada. Uma tela, um card, uma música.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # sai em dist/
```

## Como funciona

1. **Entrada.** Tela escura com o avatar borrado ao fundo e "clique para entrar" pulsando.
2. **O clique** é o gesto que libera o áudio no navegador: a música entra em 0:24 e o cartão sobe com blur virando foco.
3. **O cartão.** Avatar com anel girando, handle com brilho passando, bio, links, player e contador de visitas.

O cartão inclina de leve seguindo o mouse (perspectiva 3D, mola suave). Ao fundo cai
poeira lenta em canvas.

## A sujeira

Nada na tela fica parado. Por cima de tudo rodam grão animado, scanlines rolando e
vinheta (`src/components/Overlays.jsx`), mais:

- **flash subliminar** branco, de tempos em tempos e no hover do nome
- **micro tremor** da tela, aleatório
- **piscada** de brilho na entrada e no card, em ritmo irregular
- **glitch cromático** no nome, franja ciano e vermelha que salta
- **fantasma** do avatar, a mesma foto meio quadro atrás
- a chamada da entrada **corrompe** sozinha por alguns quadros

Quem pede menos movimento (`prefers-reduced-motion`) recebe tudo desligado.

## Onde mexer

| O quê | Onde |
|---|---|
| Handle, bio, avatar, assinatura | `src/content.js` → `cartao` |
| Frases que se redigitam | `src/content.js` → `typed` |
| Links das redes | `src/content.js` → `links` |
| Música, ponto de entrada, capa | `src/content.js` → `musica` |
| Texto da tela de entrada | `src/content.js` → `entrada` |
| Cores e vidro do card | `src/styles/index.css`, bloco `:root` |

### Trocar a música

```js
export const musica = {
  video: '5EpyN_6dqyk',   // id do vídeo no YouTube
  start: 24,              // segundo em que entra
  titulo: 'Timeless',
  artista: 'The Weeknd, Playboi Carti',
  capa: 'https://i.ytimg.com/vi/5EpyN_6dqyk/hqdefault.jpg'
}
```

O áudio nunca é baixado: toca do player oficial do YouTube, que fica no DOM invisível
(`src/hooks/usePlayer.js`). Quando a faixa acaba, volta pro `start`, não pro zero.

### Trocar o avatar

Coloque o arquivo em `public/assets/` e aponte `cartao.avatar`. A mesma imagem serve de
fundo borrado, então uma foto de rosto funciona melhor que um logo.

## Visitas

O contador conta as aberturas **deste navegador**, via `localStorage`. Não é um número
global: sem servidor, não teria como ser. Pra contagem real, precisa de um backend.

## O site anterior

As seções do site-manifesto (pêndulo, dose, escolha mimética, meta, teste do silêncio,
rastreio) estão guardadas em `src/_antigo/`, junto com o CSS e os textos delas. Nada foi
apagado: dá pra trazer qualquer peça de volta.

## Estrutura

```
src/
  App.jsx              entrada + cartão
  content.js           todo o texto e os links
  components/
    Entrada.jsx        tela de "clique para entrar"
    Cartao.jsx         o card, tilt e visitas
    Player.jsx         capa, barra, play, volume
    Fundo.jsx          avatar borrado, poeira, grain
    Icones.jsx         svg dos ícones
    Cursor.jsx         cursor próprio (ponto + anel)
  hooks/usePlayer.js   player do YouTube
  styles/index.css
  _antigo/             site anterior, fora do ar
```
