/* ============================================================
   GAMEFLIX — FAVORITOS.JS
   Sistema completo de favoritos integrado ao Supabase.
   Persistência real por usuário via banco de dados.
   ============================================================ */

/* ── ESTADO LOCAL (cache para performance) ─────────────────── */
var _favoritosCache = null; // array de game_names favoritados pelo usuário

/* ── HELPER: USUÁRIO LOGADO ────────────────────────────────── */
function getFavUsuario() {
  try {
    var raw = localStorage.getItem('gameflix_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* ── HELPER: REQUISIÇÃO SUPABASE (reutiliza a do supabase.js) ─ */
function favSupabaseReq(metodo, filtro, corpo) {
  var url = SUPABASE_URL + '/rest/v1/favoritos' + (filtro || '');
  var headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Prefer': 'return=representation'
  };
  var opts = { method: metodo, headers: headers };
  if (corpo) opts.body = JSON.stringify(corpo);
  return fetch(url, opts).then(function(r) {
    if (!r.ok && r.status !== 204) throw new Error('Favoritos API: ' + r.status);
    return r.status === 204 ? [] : r.json().catch(function() { return []; });
  });
}

/* ── CARREGAR FAVORITOS DO USUÁRIO ─────────────────────────── */
function carregarFavoritos() {
  var usuario = getFavUsuario();
  if (!usuario) return Promise.resolve([]);

  return favSupabaseReq('GET', '?user_email=eq.' + encodeURIComponent(usuario.email) + '&order=created_at.desc')
    .then(function(rows) {
      _favoritosCache = rows.map(function(r) { return r.game_name; });
      return _favoritosCache;
    })
    .catch(function() { return []; });
}

/* ── VERIFICAR SE JÁ É FAVORITO ────────────────────────────── */
function isFavorito(nomeJogo) {
  if (!_favoritosCache) return false;
  return _favoritosCache.indexOf(nomeJogo) !== -1;
}

/* ── ADICIONAR FAVORITO ────────────────────────────────────── */
function adicionarFavorito(nomeJogo, imgUrl) {
  var usuario = getFavUsuario();
  if (!usuario) return Promise.resolve(false);
  if (isFavorito(nomeJogo)) return Promise.resolve(false);

  var payload = {
    user_email:    usuario.email,
    primeiro_nome: usuario.primeiro_nome,
    whatsapp:      usuario.whatsapp,
    game_name:     nomeJogo,
    game_img:      imgUrl || '',
    created_at:    new Date().toISOString()
  };

  return favSupabaseReq('POST', '', payload)
    .then(function() {
      if (_favoritosCache) _favoritosCache.push(nomeJogo);
      else _favoritosCache = [nomeJogo];
      atualizarBotaoFavorito(nomeJogo, true);
      renderizarMeusFavoritos();
      mostrarToastFavorito(nomeJogo, true);
      return true;
    })
    .catch(function(e) {
      console.warn('[Favoritos] Erro ao adicionar:', e);
      return false;
    });
}

/* ── REMOVER FAVORITO ──────────────────────────────────────── */
function removerFavorito(nomeJogo) {
  var usuario = getFavUsuario();
  if (!usuario) return Promise.resolve(false);

  return favSupabaseReq('DELETE', '?user_email=eq.' + encodeURIComponent(usuario.email) + '&game_name=eq.' + encodeURIComponent(nomeJogo))
    .then(function() {
      if (_favoritosCache) {
        _favoritosCache = _favoritosCache.filter(function(g) { return g !== nomeJogo; });
      }
      atualizarBotaoFavorito(nomeJogo, false);
      renderizarMeusFavoritos();
      mostrarToastFavorito(nomeJogo, false);
      return true;
    })
    .catch(function(e) {
      console.warn('[Favoritos] Erro ao remover:', e);
      return false;
    });
}

/* ── TOGGLE FAVORITO (adicionar ou remover) ────────────────── */
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
    btn.innerHTML = '♡ Minha Lista';
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
    btn.innerHTML = '♡ Minha Lista';
    btn.classList.remove('favorito-ativo');
  }
}

/* ── TOAST DE NOTIFICAÇÃO ──────────────────────────────────── */
function mostrarToastFavorito(nomeJogo, adicionado) {
  var toast = document.getElementById('fav-toast');
  if (!toast) return;
  toast.textContent = adicionado
    ? '♥ "' + nomeJogo + '" adicionado aos favoritos!'
    : '♡ "' + nomeJogo + '" removido dos favoritos.';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

/* ── RENDERIZAR MODAL "MEUS FAVORITOS" ─────────────────────── */
function renderizarMeusFavoritos() {
  var container = document.getElementById('favoritos-grid');
  if (!container) return;

  carregarFavoritos().then(function() {
    favSupabaseReq('GET', '?user_email=eq.' + encodeURIComponent((getFavUsuario() || {}).email || '') + '&order=created_at.desc')
      .then(function(rows) {
        if (!rows || rows.length === 0) {
          container.innerHTML =
            '<div class="fav-empty">' +
              '<div class="fav-empty-icon">♡</div>' +
              '<p>Sua lista está vazia.</p>' +
              '<span>Clique em "Minha Lista" em qualquer jogo para salvar aqui.</span>' +
            '</div>';
          return;
        }

        container.innerHTML = rows.map(function(fav) {
          var img = fav.game_img || 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(fav.game_name);
          return (
            '<div class="fav-card" data-nome="' + fav.game_name + '">' +
              '<div class="fav-card-img-wrap">' +
                '<img src="' + img + '" alt="' + fav.game_name + '" loading="lazy">' +
                '<div class="fav-card-overlay">' +
                  '<button class="fav-remove-btn" onclick="removerFavorito(\'' + fav.game_name.replace(/'/g, "\\'") + '\')" title="Remover">✕</button>' +
                  '<a href="info.html?id=' + toGameSlug(fav.game_name) + '" class="fav-obter-btn" target="_blank">⚡ Obter</a>' +
                '</div>' +
              '</div>' +
              '<p class="fav-card-nome">' + fav.game_name + '</p>' +
            '</div>'
          );
        }).join('');
      });
  });
}

/* ── HELPER: slug igual ao do script.js ────────────────────── */
function toGameSlug(title) {
  if (typeof window.toGameSlug === 'function' && window.toGameSlug !== toGameSlug) {
    return window.toGameSlug(title);
  }
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Carrega favoritos do usuário logo ao iniciar */
  carregarFavoritos().then(function() {
    var btn = document.getElementById('btn-favorito');
    var nomeInicial = btn ? btn.getAttribute('data-jogo') : '';
    var imgInicial = btn ? btn.getAttribute('data-img') : '';
    sincronizarBotaoBanner(nomeInicial, imgInicial);
  });
  /* Clique no botão de favorito do banner */
  var btnFav = document.getElementById('btn-favorito');
  if (btnFav) {
    btnFav.addEventListener('click', function() {
      var nome = this.getAttribute('data-jogo');
      var img  = this.getAttribute('data-img');
      if (!nome) return;
      toggleFavorito(nome, img);
    });
  }

  /* Abrir modal Meus Favoritos */
  var btnNav = document.getElementById('nav-meus-favoritos');
  if (btnNav) {
    btnNav.addEventListener('click', function(e) {
      e.preventDefault();
      abrirModalFavoritos();
    });
  }

  /* Fechar modal */
  var modalOverlay = document.getElementById('modal-favoritos');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) fecharModalFavoritos();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') fecharModalFavoritos();
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
/* Intercepta a função setBannerInfoLink do script.js */
document.addEventListener('DOMContentLoaded', function() {
  (function waitForSetBanner() {
    if (typeof setBannerInfoLink !== 'function') {
      return setTimeout(waitForSetBanner, 100);
    }
    var _orig = setBannerInfoLink;
    window.setBannerInfoLink = function(title) {
  _orig(title);
  /* Pega a capa do card clicado */
  var cardImg = document.querySelector('.card-container .poster-img[data-title="' + title + '"], .game-card[data-title="' + title + '"]');
  var imgUrl = cardImg ? cardImg.src : '';
  sincronizarBotaoBanner(title, imgUrl);
};
  })();
});
