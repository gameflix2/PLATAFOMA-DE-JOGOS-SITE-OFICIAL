/* ============================================================
   GAMEFLIX — FAVORITOS.JS
   Sistema de favoritos 100% local (localStorage).
   Sem Supabase, sem API externa.
   ============================================================ */

var FAV_KEY = 'gameflix_favoritos';

/* ── HELPER: USUÁRIO LOGADO ────────────────────────────────── */
function getFavUsuario() {
  try {
    var raw = localStorage.getItem('gameflix_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* ── CARREGAR FAVORITOS DO LOCALSTORAGE ────────────────────── */
function carregarFavoritos() {
  try {
    var raw = localStorage.getItem(FAV_KEY);
    return Promise.resolve(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return Promise.resolve([]);
  }
}

/* ── SALVAR FAVORITOS NO LOCALSTORAGE ──────────────────────── */
function salvarFavoritos(lista) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(lista));
  } catch (e) {
    console.warn('[Favoritos] Erro ao salvar:', e);
  }
}

/* ── VERIFICAR SE JÁ É FAVORITO ────────────────────────────── */
function isFavorito(nomeJogo) {
  try {
    var raw = localStorage.getItem(FAV_KEY);
    var lista = raw ? JSON.parse(raw) : [];
    return lista.some(function(f) { return f.game_name === nomeJogo; });
  } catch (e) { return false; }
}

/* ── ADICIONAR FAVORITO ────────────────────────────────────── */
function adicionarFavorito(nomeJogo, imgUrl) {
  if (isFavorito(nomeJogo)) return Promise.resolve(false);

  carregarFavoritos().then(function(lista) {
    lista.unshift({
      game_name: nomeJogo,
      game_img: imgUrl || '',
      created_at: new Date().toISOString()
    });
    salvarFavoritos(lista);
    atualizarBotaoFavorito(nomeJogo, true);
    renderizarMeusFavoritos();
    mostrarToastFavorito(nomeJogo, true);
  });

  return Promise.resolve(true);
}

/* ── REMOVER FAVORITO ──────────────────────────────────────── */
function removerFavorito(nomeJogo) {
  carregarFavoritos().then(function(lista) {
    var nova = lista.filter(function(f) { return f.game_name !== nomeJogo; });
    salvarFavoritos(nova);
    atualizarBotaoFavorito(nomeJogo, false);
    renderizarMeusFavoritos();
    mostrarToastFavorito(nomeJogo, false);
  });

  return Promise.resolve(true);
}

/* ── TOGGLE FAVORITO ───────────────────────────────────────── */
function toggleFavorito(nomeJogo, imgUrl) {
  if (isFavorito(nomeJogo)) {
    removerFavorito(nomeJogo);
  } else {
    adicionarFavorito(nomeJogo, imgUrl);
  }
}

/* ── ATUALIZAR VISUAL DO BOTÃO ─────────────────────────────── */
function atualizarBotaoFavorito(nomeJogo, ativo) {
  var btn = document.getElementById('btn-favorito');
  if (!btn) return;
  var jogoAtual = btn.getAttribute('data-jogo');
  if (jogoAtual !== nomeJogo) return;

  if (ativo) {
    btn.innerHTML = '♥ Adicionado';
    btn.classList.add('favorito-ativo');
  } else {
    btn.innerHTML = '♡ ADICIONAR JOGO AO PACK';
    btn.classList.remove('favorito-ativo');
  }
}

/* ── ATUALIZAR BOTÃO PARA O JOGO DO BANNER ATUAL ───────────── */
function sincronizarBotaoBanner(nomeJogo, imgUrl) {
  var btn = document.getElementById('btn-favorito');
  if (!btn) return;
  btn.setAttribute('data-jogo', nomeJogo || '');
  btn.setAttribute('data-img', imgUrl || '');
  var ativo = isFavorito(nomeJogo);
  if (ativo) {
    btn.innerHTML = '♥ Adicionado';
    btn.classList.add('favorito-ativo');
  } else {
    btn.innerHTML = '♡ ADICIONAR JOGO AO PACK';
    btn.classList.remove('favorito-ativo');
  }
}

/* ── TOAST DE NOTIFICAÇÃO ──────────────────────────────────── */
function mostrarToastFavorito(nomeJogo, adicionado) {
  var toast = document.getElementById('fav-toast');
  if (!toast) return;
  toast.textContent = adicionado
    ? '♥ "' + nomeJogo + '" adicionado ao pack!'
    : '♡ "' + nomeJogo + '" removido do pack.';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

/* ── RENDERIZAR MODAL "MEU PACK" ───────────────────────────── */
function renderizarMeusFavoritos() {
  var container = document.getElementById('favoritos-grid');
  if (!container) return;

  carregarFavoritos().then(function(lista) {
    if (!lista || lista.length === 0) {
      container.innerHTML =
        '<div class="fav-empty">' +
          '<div class="fav-empty-icon">♡</div>' +
          '<p>Seu pack está vazio.</p>' +
          '<span>Clique em "Adicionar ao Pack" em qualquer jogo para salvar aqui.</span>' +
        '</div>';
      return;
    }

    container.innerHTML = lista.map(function(fav) {
      var img = fav.game_img || 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(fav.game_name);
      var nomeEscapado = fav.game_name.replace(/'/g, "\\'");
      return (
        '<div class="fav-card" data-nome="' + fav.game_name + '">' +
          '<div class="fav-card-img-wrap">' +
            '<img src="' + img + '" alt="' + fav.game_name + '" loading="lazy">' +
            '<div class="fav-card-overlay">' +
              '<button class="fav-remove-btn" onclick="removerFavorito(\'' + nomeEscapado + '\')" title="Remover">✕</button>' +
              '<a href="info.html?id=' + toGameSlug(fav.game_name) + '" class="fav-obter-btn" target="_blank">⚡ Obter</a>' +
            '</div>' +
          '</div>' +
          '<p class="fav-card-nome">' + fav.game_name + '</p>' +
        '</div>'
      );
    }).join('');
  });
}

/* ── HELPER: SLUG ──────────────────────────────────────────── */
function toGameSlug(title) {
  if (typeof window.toGameSlug === 'function' && window.toGameSlug !== toGameSlug) {
    return window.toGameSlug(title);
  }
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ── ENVIAR PACK VIA WHATSAPP ──────────────────────────────── */
function abrirWhatsAppOrcamento() {
  carregarFavoritos().then(function(lista) {
    var jogos;

    if (lista && lista.length > 0) {
      jogos = lista.map(function(f) { return f.game_name; });
    } else {
      /* Pack vazio: envia todos os jogos do catálogo */
      if (typeof ofertasConfig !== 'undefined' && ofertasConfig.length > 0) {
        jogos = ofertasConfig.map(function(g) { return (g.titulo || '').trim(); }).filter(Boolean);
      } else {
        jogos = [];
      }
    }

    var mensagem = 'Gustavo, esse é o meu pack:\n' + jogos.join('\n');

    window.open(
      'https://wa.me/5553981021909?text=' + encodeURIComponent(mensagem),
      '_blank'
    );
  });
}

/* ============================================================
   TELA DE CONFIRMAÇÃO DO PACK (QR CODE)
   Substitui apenas o redirecionamento direto ao WhatsApp que
   ocorria no clique do botão "Enviar meu pack e liberar teste".
   Toda a lógica de favoritos acima permanece inalterada.
   ============================================================ */

var CONFIRMA_PACK_NUMERO = '5553981021909';

/* ── MONTA A MENSAGEM DINÂMICA COM OS JOGOS ESCOLHIDOS ─────── */
function montarMensagemPack(jogos) {
  var linhas = jogos.map(function (nome) { return '- ' + nome; }).join('\n');
  return 'Olá, Gameflix!\n\nOs meus jogos escolhidos são:\n\n' + linhas + '\n\nObrigado!';
}

/* ── MONTA A URL DO WHATSAPP COM A MENSAGEM PRONTA ─────────── */
function montarLinkWhatsAppPack(jogos) {
  var mensagem = montarMensagemPack(jogos);
  return 'https://wa.me/' + CONFIRMA_PACK_NUMERO + '?text=' + encodeURIComponent(mensagem);
}

/* ── ABRE A TELA DE CONFIRMAÇÃO ────────────────────────────── */
function abrirTelaConfirmacaoPack() {
  carregarFavoritos().then(function (lista) {
    var jogos;

    if (lista && lista.length > 0) {
      jogos = lista.map(function (f) { return f.game_name; });
    } else if (typeof ofertasConfig !== 'undefined' && ofertasConfig.length > 0) {
      jogos = ofertasConfig.map(function (g) { return (g.titulo || '').trim(); }).filter(Boolean);
    } else {
      jogos = [];
    }

    var link = montarLinkWhatsAppPack(jogos);

    // Guarda o link atual para o botão "Confirmar"
    var btnConfirmar = document.getElementById('btn-confirmar-pack');
    if (btnConfirmar) btnConfirmar.setAttribute('data-link', link);

    // Gera o QR Code apontando para o link do WhatsApp
    var qrImg = document.getElementById('confirma-pack-qr');
    if (qrImg) {
      qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=' + encodeURIComponent(link);
    }

    // Renderiza a galeria com as capas dos jogos escolhidos
    var grid = document.getElementById('confirma-pack-grid');
    if (grid) {
      if (lista && lista.length > 0) {
        grid.innerHTML = lista.map(function (f) {
          var img = f.game_img || '';
          return '<div class="confirma-pack-item"><img src="' + img + '" alt="' + f.game_name + '" loading="lazy"></div>';
        }).join('');
      } else {
        grid.innerHTML = '';
      }
    }

    var modal = document.getElementById('modal-confirmacao-pack');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
}

/* ── FECHA A TELA DE CONFIRMAÇÃO ───────────────────────────── */
function fecharConfirmacaoPack() {
  var modal = document.getElementById('modal-confirmacao-pack');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── BOTÃO "CONFIRMAR": MESMA AÇÃO DO QR CODE ──────────────── */
function confirmarEnvioPack() {
  var btnConfirmar = document.getElementById('btn-confirmar-pack');
  var link = btnConfirmar ? btnConfirmar.getAttribute('data-link') : null;
  if (!link) return;
  window.open(link, '_blank');
}

/* Fecha a tela de confirmação clicando fora do card */
document.addEventListener('DOMContentLoaded', function () {
  var confirmaOverlay = document.getElementById('modal-confirmacao-pack');
  if (confirmaOverlay) {
    confirmaOverlay.addEventListener('click', function (e) {
      if (e.target === this) fecharConfirmacaoPack();
    });
  }
});

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Sincroniza botão do banner ao carregar */
  var btn = document.getElementById('btn-favorito');
  var nomeInicial = btn ? btn.getAttribute('data-jogo') : '';
  var imgInicial  = btn ? btn.getAttribute('data-img')  : '';
  sincronizarBotaoBanner(nomeInicial, imgInicial);

  /* Clique no botão de favorito do banner */
  if (btn) {
    btn.addEventListener('click', function() {
      var nome = this.getAttribute('data-jogo');
      var img  = this.getAttribute('data-img');
      if (!nome) return;
      toggleFavorito(nome, img);
    });
  }

  /* Abrir modal MEU PACK */
  var btnNav = document.getElementById('nav-meus-favoritos');
  if (btnNav) {
    btnNav.addEventListener('click', function(e) {
      e.preventDefault();
      abrirModalFavoritos();
    });
  }

  /* Fechar modal clicando fora */
  var modalOverlay = document.getElementById('modal-favoritos');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) fecharModalFavoritos();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharModalFavoritos();
      fecharConfirmacaoPack();
    }
  });
});

function abrirModalFavoritos() {
  var modal = document.getElementById('modal-favoritos');
  if (!modal) return;
  renderizarMeusFavoritos();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharModalFavoritos() {
  var modal = document.getElementById('modal-favoritos');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── HOOK: QUANDO O BANNER MUDA DE JOGO ───────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  (function waitForSetBanner() {
    if (typeof setBannerInfoLink !== 'function') {
      return setTimeout(waitForSetBanner, 100);
    }
    var _orig = setBannerInfoLink;
    window.setBannerInfoLink = function(title) {
      _orig(title);
      var cardImg = document.querySelector('[data-title="' + title + '"]');
      var imgUrl = cardImg ? cardImg.src : '';
      sincronizarBotaoBanner(title, imgUrl);
    };
  })();
});
