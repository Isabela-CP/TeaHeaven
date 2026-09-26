/* ======================= DADOS DO JOGO ======================= */
const INGREDIENTES = [
  { id: 'hortela',   img: 'hortela.png',   emoji: '🌿' },
  { id: 'limao',     img: 'limao.png',     emoji: '🍋' },
  { id: 'camomila',  img: 'camomila.png',  emoji: '🌼' },
  { id: 'mel',       img: 'mel.png',       emoji: '🍯' },
  { id: 'cogumelos', img: 'cogumelos.png', emoji: '🍄' },
  { id: 'poMagico',  img: 'poMagico.png',  emoji: '✨' },
];
const AGUA = { id: 'agua', img: 'jarroAgua.png', emoji: '💧' };

const COPOS = [
  { id: 'xicaraAmarela', img: 'xicaraAmarela.png', emoji: '🟡' },
  { id: 'xicaraRoxa',    img: 'xicaraRoxa.png',    emoji: '🟣' },
  { id: 'xicaraVidro',   img: 'xicaraVidro.png',   emoji: '⚪' },
];

const CLIENTES = [
  { id: 'coelho',  img: 'coelho.png',  emoji: '🐰' },
  { id: 'sapinho', img: 'sapinho.png', emoji: '🐸' },
  { id: 'urso',    img: 'urso.png',    emoji: '🐻' },
];

const FRASES = [
  "Respire fundo. Este momento é só seu.",
  "Cuidar de alguém com carinho também é cuidar de si.",
  "Devagar também se chega longe, e com mais leveza.",
  "Um chá quentinho, um coração mais calmo.",
  "Você merece pausas gostosas como esta.",
  "A floresta agradece sua gentileza de hoje.",
  "Pequenos gestos de cuidado mudam o dia inteiro.",
  "Descansar não é preguiça, é sabedoria.",
  "Que este aroma traga paz para sua tarde.",
  "Cada xícara é um lembrete: vá com calma."
];

/* ======================= RECEITAS ESTRITAS ======================= */
const RECEITAS = [
  { copoVazio: 'xicaraAmarela.png', ingredientes: ['agua', 'limao',     'mel'],       imgPronta: 'chaAbracodeUrso.png'  },
  { copoVazio: 'xicaraAmarela.png', ingredientes: ['agua', 'camomila',  'limao'],     imgPronta: 'chaRaioDeSol.png'     },
  { copoVazio: 'xicaraAmarela.png', ingredientes: ['agua', 'hortela',   'mel'],       imgPronta: 'chaBrisaSuave.png'    },
  { copoVazio: 'xicaraRoxa.png',    ingredientes: ['agua', 'camomila',  'mel'],       imgPronta: 'chaBonsSonhos.png'    },
  { copoVazio: 'xicaraRoxa.png',    ingredientes: ['agua', 'cogumelos', 'hortela'],   imgPronta: 'chaDoBosque.png'      },
  { copoVazio: 'xicaraRoxa.png',    ingredientes: ['agua', 'cogumelos', 'camomila'],  imgPronta: 'chaTardeOutono.png'   },
  { copoVazio: 'xicaraVidro.png',   ingredientes: ['agua', 'poMagico',  'limao'],     imgPronta: 'chaEstelar.png'       },
  { copoVazio: 'xicaraVidro.png',   ingredientes: ['agua', 'poMagico',  'cogumelos'], imgPronta: 'chaBruxaBoa.png'      },
  { copoVazio: 'xicaraVidro.png',   ingredientes: ['agua', 'poMagico',  'hortela'],   imgPronta: 'chaAuroraBoreal.png'  },
];

/* ======================= ESTADO ======================= */
const state = {
  screen:       1,
  coins:        parseInt(localStorage.getItem('cha_coins') || '0', 10),
  receitaAtual: null,   // objeto de RECEITAS sorteado
  cauldron:     [],     // ids dentro do bule
  bulePos:      'counter',
  teaReady:     false,
  // Copo pronto: id do copo que ficará na tela 2 clicável
  cupFilledId:  null,   // id do copo (xicaraAmarela, xicaraRoxa, xicaraVidro)
  // O que o jogador está "segurando" para entregar (imgPronta da receita)
  imgNaMao:     null,
  musicOn:      false,
};

/* ======================= UTIL DOM ======================= */
function sprite(obj, cls, extraAttrs = '') {
  return `<div class="sprite ${cls || ''}" data-emoji="${obj.emoji}" ${extraAttrs}>
        <img src="${obj.img}" alt="${obj.id}" onerror="this.parentElement.classList.add('broken')">
      </div>`;
}
const el = id => document.getElementById(id);
el('coin-count').textContent = state.coins;

/* ======================= CURSOR ======================= */
document.body.addEventListener('mousedown',  () => document.body.classList.add('arrastando'));
document.body.addEventListener('mouseup',    () => document.body.classList.remove('arrastando'));
document.body.addEventListener('touchstart', () => document.body.classList.add('arrastando'), { passive: true });
document.body.addEventListener('touchend',   () => document.body.classList.remove('arrastando'));
document.body.addEventListener('dragstart',  () => document.body.classList.add('arrastando'));
document.body.addEventListener('dragend',    () => document.body.classList.remove('arrastando'));

/* ======================= NAVEGAÇÃO ======================= */
function goScreen(n) {
  state.screen = n;
  el('screen1').classList.toggle('active', n === 1);
  el('screen2').classList.toggle('active', n === 2);
}
el('nav-left').onclick  = () => goScreen(state.screen === 1 ? 2 : 1);
el('nav-right').onclick = () => goScreen(state.screen === 1 ? 2 : 1);

/* ======================= MÚSICA (YouTube IFrame API) ======================= */
// ID do vídeo/playlist: https://youtu.be/LgkOdKuauIU
const YT_VIDEO_ID = 'LgkOdKuauIU';
let ytPlayer = null;
let ytReady  = false;
let musicOn  = false;

// Callback global exigido pela API do YouTube
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('youtube-player', {
    height: '1',
    width:  '1',
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay:    0,
      loop:        1,
      playlist:    YT_VIDEO_ID, // necessário para loop funcionar
      controls:    0,
      disablekb:   1,
      fs:          0,
      rel:         0,
      modestbranding: 1,
    },
    events: {
      onReady: (e) => { ytReady = true; e.target.setVolume(50); },
    },
  });
};

el('record-player').onclick = () => {
  if (!ytReady) return; // API ainda carregando
  if (musicOn) {
    ytPlayer.pauseVideo();
    el('disco-img').classList.remove('girando');
    musicOn = false;
  } else {
    ytPlayer.playVideo();
    el('disco-img').classList.add('girando');
    musicOn = true;
  }
};

/* ======================= MOEDAS ======================= */
function addCoins(n) {
  state.coins += n;
  localStorage.setItem('cha_coins', state.coins);
  el('coin-count').textContent = state.coins;
}

/* ======================= PEDIDO ======================= */
function renderOrderBalloon() {
  const b = el('order-balloon');
  if (!state.receitaAtual) { b.classList.remove('show'); b.innerHTML = ''; return; }

  const r = state.receitaAtual;
  // ingredientes sem água para mostrar no balão (os 2 ingredientes especiais)
  const ingsExtra = r.ingredientes.filter(id => id !== 'agua');
  const i1 = INGREDIENTES.find(i => i.id === ingsExtra[0]);
  const i2 = INGREDIENTES.find(i => i.id === ingsExtra[1]);
  const copoObj = COPOS.find(c => c.img === r.copoVazio);

  b.innerHTML = `
    ${sprite(AGUA, 'icon')}
    <span class="plus">+</span>
    ${sprite(i1, 'icon')}
    <span class="plus">+</span>
    ${sprite(i2, 'icon')}
    <span class="plus">→</span>
    <div class="sprite icon" data-emoji="${copoObj ? copoObj.emoji : '🍵'}">
      <img src="${r.copoVazio}" alt="copo">
    </div>`;
  b.classList.add('show');
}

function newOrder() {
  state.receitaAtual = RECEITAS[Math.floor(Math.random() * RECEITAS.length)];
  renderOrderBalloon();
}

/* ======================= TELA 1: CLIENTE E ENTREGA ======================= */
function spawnCustomer() {
  const c = CLIENTES[Math.floor(Math.random() * CLIENTES.length)];
  const area = el('customer-area');
  area.innerHTML = sprite(c, '', 'id="current-customer"');
  area.classList.add('bounce');
  setTimeout(() => area.classList.remove('bounce'), 500);
  area.dataset.id = c.id;
  area.onclick = tryDeliver;
  newOrder();
  state.imgNaMao = null;
  el('ready-cup-area').style.display = 'none';
  el('ready-cup-area').innerHTML = '';
}

function tryDeliver() {
  if (!state.imgNaMao) return; // nada na mão

  if (state.imgNaMao === state.receitaAtual.imgPronta) {
    // ✅ Entrega correta
    const frase = FRASES[Math.floor(Math.random() * FRASES.length)];
    el('reward-phrase').textContent = frase;
    el('reward-modal').classList.add('show');
    addCoins(10);
    el('customer-area').innerHTML = '';
    state.receitaAtual = null;
    state.imgNaMao = null;
    el('ready-cup-area').style.display = 'none';
    el('ready-cup-area').innerHTML = '';
    renderOrderBalloon();
    renderCups();
  } else {
    // ❌ Receita errada — devolve o copo e pede para tentar novamente
    el('customer-area').classList.add('bounce');
    setTimeout(() => el('customer-area').classList.remove('bounce'), 500);
    state.imgNaMao = null;
    el('ready-cup-area').style.display = 'none';
    el('ready-cup-area').innerHTML = '';
    renderCups();
  }
}

el('reward-close').onclick = () => {
  el('reward-modal').classList.remove('show');
  spawnCustomer();
};

/* ======================= TELA 2: INGREDIENTES ======================= */
function renderIngredients() {
  const shelf = el('ingredients-shelf');
  shelf.innerHTML = '';

  const waterArea = el('water-area');
  if (waterArea) {
    waterArea.innerHTML = '';
    const dWater = document.createElement('div');
    dWater.className = 'ingredient sprite';
    dWater.dataset.emoji = AGUA.emoji;
    dWater.dataset.id   = AGUA.id;
    dWater.draggable    = true;
    dWater.innerHTML    = `<img src="${AGUA.img}" alt="${AGUA.id}" onerror="this.parentElement.classList.add('broken')">`;
    dWater.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', 'ing|' + AGUA.id));
    dWater.addEventListener('click',     () => addToCauldron(AGUA.id));
    waterArea.appendChild(dWater);
  }

  INGREDIENTES.forEach(item => {
    const d = document.createElement('div');
    d.className      = 'ingredient sprite';
    d.dataset.emoji  = item.emoji;
    d.dataset.id     = item.id;
    d.draggable      = true;
    d.innerHTML      = `<img src="${item.img}" alt="${item.id}" onerror="this.parentElement.classList.add('broken')">`;
    d.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', 'ing|' + item.id));
    d.addEventListener('click',     () => addToCauldron(item.id));
    shelf.appendChild(d);
  });
}

function addToCauldron(id) {
  if (state.teaReady) return;
  if (id === 'agua') {
    if (state.cauldron.includes('agua')) return;
    state.cauldron.unshift('agua');
  } else {
    if (state.cauldron.filter(x => x !== 'agua').length >= 2) return;
    state.cauldron.push(id);
  }
  renderCauldronHud();
}

function renderCauldronHud() {
  const hud = el('teapot-hud');
  hud.innerHTML = state.cauldron.map(id => {
    const item = id === 'agua' ? AGUA : INGREDIENTES.find(i => i.id === id);
    return sprite(item, 'icon');
  }).join('');
}

function clearCauldron() {
  state.cauldron  = [];
  state.teaReady  = false;
  state.bulePos   = 'counter';
  updateTeapotPosition();
  el('teapot-wrap').classList.remove('pronto');
  document.querySelectorAll('.fire').forEach(f => f.classList.remove('burning'));
  renderCauldronHud();
}
el('clear-cauldron').onclick = clearCauldron;

/* ======================= BULE: ARRASTAR INGREDIENTE ======================= */
const teapotWrap = el('teapot-wrap');
teapotWrap.addEventListener('dragover', e => { e.preventDefault(); });
teapotWrap.addEventListener('drop', e => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  if (data && data.startsWith('ing|')) addToCauldron(data.split('|')[1]);
});

/* ARRASTAR BULE */
teapotWrap.addEventListener('dragstart', e => {
  e.dataTransfer.setData('text/plain', 'teapot');
  teapotWrap.classList.add('dragging');
});
teapotWrap.addEventListener('dragend', () => teapotWrap.classList.remove('dragging'));

/* ======================= POSIÇÃO DO BULE ======================= */
function updateTeapotPosition() {
  const kitchenRight = el('kitchen-right');
  const screen2      = el('screen2');

  if (state.bulePos === 'counter') {
    if (teapotWrap.parentElement !== kitchenRight) {
      kitchenRight.insertBefore(teapotWrap, kitchenRight.firstChild);
    }
    teapotWrap.style.position  = 'relative';
    teapotWrap.style.left      = '';
    teapotWrap.style.top       = '';
    teapotWrap.style.bottom    = '';
    teapotWrap.style.right     = '';
    teapotWrap.style.transform = '';
  } else {
    if (teapotWrap.parentElement !== screen2) screen2.appendChild(teapotWrap);
    teapotWrap.style.position = 'absolute';

    // getBoundingClientRect devolve coords do viewport (já escaladas pelo CSS scale).
    // Para posicionar dentro do #app (espaço não-escalado) temos de dividir pelo scale.
    const appEl      = el('app');
    const appRect    = appEl.getBoundingClientRect();
    const scale      = appRect.width / BASE_W;   // BASE_W = 1280 definido no final do JS

    const burnerEl   = el(`burner-${state.bulePos}`);
    const burnerRect = burnerEl.getBoundingClientRect();

    // Centro do burner em coordenadas do viewport → converter para espaço do #app
    const cx = (burnerRect.left + burnerRect.width  / 2 - appRect.left) / scale;
    const cy = (burnerRect.top  + burnerRect.height / 2 - appRect.top)  / scale;

    // Posiciona o bule centrado sobre a boca do fogão
    teapotWrap.style.left   = `${cx - 100}px`;  // 100 = metade da largura do teapot-wrap
    teapotWrap.style.top    = `${cy - 130}px`;  // Desce o bule em 30px
    teapotWrap.style.right  = 'auto';
    teapotWrap.style.bottom = 'auto';
    teapotWrap.style.transform = '';
  }
}

/* ======================= FOGÃO: DROP + BOTÕES ======================= */
document.querySelectorAll('.burner').forEach(burner => {
  burner.addEventListener('dragover',  e  => { e.preventDefault(); burner.classList.add('dropzone-over'); });
  burner.addEventListener('dragleave', () => burner.classList.remove('dropzone-over'));
  burner.addEventListener('drop', e => {
    e.preventDefault();
    burner.classList.remove('dropzone-over');
    if (e.dataTransfer.getData('text/plain') === 'teapot') {
      state.bulePos = burner.dataset.id;
      updateTeapotPosition();
    }
  });
});

document.querySelectorAll('.stove-btn').forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.id;
    if (state.bulePos === id && !state.teaReady) {
      if (state.cauldron.includes('agua') && state.cauldron.length === 3) {
        brewTea(id);
      }
    }
  };
});

function brewTea(burnerId) {
  const burnerEl = el(`burner-${burnerId}`);
  const fire     = burnerEl.querySelector('.fire');

  // Indicador visual: glow laranja na boca do fogão
  burnerEl.classList.add('queimando');

  // Fogo animado acima da boca
  fire.style.zIndex = '300';
  fire.classList.add('burning');

  setTimeout(() => {
    fire.classList.remove('burning');
    burnerEl.classList.remove('queimando');
    state.teaReady = true;
    el('teapot-wrap').classList.add('pronto');
  }, 3000);
}

/* ======================= COPOS: RENDERIZAR ======================= */
function renderCups() {
  const area = el('cups-area');
  area.innerHTML = '';
  COPOS.forEach(cup => {
    const wrap = document.createElement('div');
    wrap.className   = 'cup-slot';
    wrap.dataset.id  = cup.id;

    // Imagem do copo: se já foi preenchido com aquele copo, usa a imgPronta
    const imgSrc = (state.cupFilledId === cup.id && state.cupImgPronta)
      ? state.cupImgPronta
      : cup.img;

    wrap.innerHTML = `<img src="${imgSrc}" alt="${cup.id}" onerror="this.parentElement.classList.add('broken')">`;

    // Drop do bule → serve o chá
    wrap.addEventListener('dragover',  e  => { e.preventDefault(); wrap.classList.add('dropzone-over'); });
    wrap.addEventListener('dragleave', () => wrap.classList.remove('dropzone-over'));
    wrap.addEventListener('drop', e => {
      e.preventDefault();
      wrap.classList.remove('dropzone-over');
      if (e.dataTransfer.getData('text/plain') === 'teapot' && state.teaReady) {
        fillCup(cup.id);
      }
    });

    // Clique no bule → também serve
    wrap.addEventListener('click', () => {
      if (state.teaReady) fillCup(cup.id);
    });

    area.appendChild(wrap);
  });
}

/* ======================= SERVIR O CHÁ ======================= */
function matchReceita(cupId) {
  // Verifica se o conteúdo do bule bate com alguma receita que usa esse copo
  const cupObj  = COPOS.find(c => c.id === cupId);
  const ingsBule = [...state.cauldron].sort();

  return RECEITAS.find(r => {
    if (r.copoVazio !== cupObj.img) return false;
    const rIngs = [...r.ingredientes].sort();
    return JSON.stringify(rIngs) === JSON.stringify(ingsBule);
  }) || null;
}

function fillCup(cupId) {
  if (!state.teaReady) return;

  const receita = matchReceita(cupId);

  if (!receita) {
    // Ingredientes errados para este copo → reseta sem punição
    clearCauldron();
    renderCups();
    return;
  }

  // Troca a imagem do copo pela imgPronta
  state.cupFilledId   = cupId;
  state.cupImgPronta  = receita.imgPronta;
  state.teaReady      = false;
  el('teapot-wrap').classList.remove('pronto');
  state.bulePos       = 'counter';
  updateTeapotPosition();

  // Esvazia o bule
  state.cauldron = [];
  renderCauldronHud();
  document.querySelectorAll('.fire').forEach(f => f.classList.remove('burning'));

  // Re-renderiza os copos (o copo preenchido mostrará imgPronta)
  renderCups();

  // Torna o copo cheio clicável para "pegar na mão"
  const cupsArea = el('cups-area');
  const filledSlot = cupsArea.querySelector(`[data-id="${cupId}"]`);
  if (filledSlot) {
    filledSlot.style.cursor = 'pointer';
    filledSlot.style.outline = '3px solid gold';
    filledSlot.addEventListener('click', pegarCopoPronto);
    filledSlot.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', 'copo-pronto');
      pegarCopoPronto();
    });
    filledSlot.draggable = true;
  }
}

function pegarCopoPronto() {
  if (!state.cupImgPronta) return;
  state.imgNaMao      = state.cupImgPronta;
  state.cupFilledId   = null;
  state.cupImgPronta  = null;

  // Mostra o copo na "mão" na Tela 1 (ready-cup-area)
  el('ready-cup-area').innerHTML = `<img src="${state.imgNaMao}" alt="cha pronto" style="width:100%;height:100%;object-fit:contain;">`;
  el('ready-cup-area').style.display = 'block';

  // Volta os copos ao estado vazio
  renderCups();

  // Navega para a Tela 1 automaticamente
  goScreen(1);
}

/* ======================= START ======================= */
el('start-btn').onclick = () => {
  el('welcome-modal').classList.remove('show');
  renderIngredients();
  renderCups();
  spawnCustomer();
};

/* ======================= RESPONSIVO ======================= */
// O jogo foi projetado para 1280×720.
// Esta função escala o #app para caber em qualquer tamanho de janela,
// mantendo as proporções perfeitas em qualquer tela.
const BASE_W = 1280;
const BASE_H = 720;

function scaleGame() {
  const app     = el('app');
  const scaleX  = window.innerWidth  / BASE_W;
  const scaleY  = window.innerHeight / BASE_H;
  const scale   = Math.min(scaleX, scaleY); // cabe sem cortar

  const offsetX = (window.innerWidth  - BASE_W * scale) / 2;
  const offsetY = (window.innerHeight - BASE_H * scale) / 2;

  app.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

scaleGame();
window.addEventListener('resize', scaleGame);
