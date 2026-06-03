/* --- UTILITÁRIO: GERA SLUG DO JOGO PARA info.html --- */
function toGameSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* --- UTILITÁRIO: EXTRAI ID DO VIMEO --- */
function getVimeoId(src) {
  if (!src) return null;
  if (src.includes('vimeo.com/')) {
    var match = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) return match[1];
  }
  return null;
}

/* ============================================================
   VÍDEO DE BANNER (VIMEO EXCLUSIVO) E CONTROLE DE SOM
   ============================================================ */
var vimeoPlayer = null;

function showUnmuteBtn() {
  var btn = document.getElementById('btn-unmute');
  if (btn) btn.style.display = 'block';
}

function hideUnmuteBtn() {
  var btn = document.getElementById('btn-unmute');
  if (btn) btn.style.display = 'none';
}

function setupUnmuteButton() {
  var btn = document.getElementById('btn-unmute');
  if (!btn) return;

  var newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener('click', function () {
    var iframe = document.querySelector('#banner-video iframe');
    if (iframe) {
      var player = vimeoPlayer || new Vimeo.Player(iframe);
      newBtn.style.display = 'none';
      document.getElementById('icon-vol-on').style.display = 'block';
      document.getElementById('icon-vol-off').style.display = 'none';

      // Ativa o overlay IMEDIATAMENTE ao clicar no botão de som
      var bannerOverlay = document.querySelector('[data-banner-overlay]');
      if (bannerOverlay) {
        bannerOverlay.style.pointerEvents = 'auto';
        bannerOverlay.addEventListener('click', function() {
          player.getVolume().then(function(vol) {
            var novoVol = vol > 0 ? 0 : 1;
            player.setVolume(novoVol);
            document.getElementById('icon-vol-on').style.display = novoVol > 0 ? 'block' : 'none';
            document.getElementById('icon-vol-off').style.display = novoVol > 0 ? 'none' : 'block';
          });
        });
      }

      player.setVolume(1).then(function() {
        return player.setCurrentTime(0);
      }).then(function() {
        return player.play();
      }).then(function() {
        player.off('ended');
        player.on('ended', function() {
          player.setVolume(0).then(function() {
            document.getElementById('icon-vol-on').style.display = 'none';
            document.getElementById('icon-vol-off').style.display = 'block';
            player.setCurrentTime(0).then(function() {
              player.play().catch(function(){});
            });
          });
        });
      }).catch(function(error) {
        console.error("Erro ao ativar som:", error);
        newBtn.style.display = 'block';
      });
    }
  });
}

var _bannerInitialized = false;

function setBannerVideo(videoSrc) {
  var vimeoId = getVimeoId(videoSrc);
  var section = document.getElementById('main-banner');
  if (!section || !vimeoId) return;

  if (!_bannerInitialized) {
    var existingWrapper = document.getElementById('banner-video');
    if (existingWrapper) {
      var nextEl = existingWrapper.nextElementSibling;
      if (nextEl && nextEl.dataset && nextEl.dataset.bannerOverlay) nextEl.remove();
      existingWrapper.remove();
    }

    var wrapper = document.createElement('div');
    wrapper.id = 'banner-video';
    wrapper.dataset.embedType = 'vimeo';
    wrapper.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:0;';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&muted=1&loop=0&background=1';
    iframe.style.cssText = 'position:absolute;top:50%;left:50%;width:177.78vh;height:100vh;min-width:100%;min-height:56.25vw;transform:translate(-50%,-50%);border:none;pointer-events:none;';
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');

    wrapper.appendChild(iframe);
    section.insertBefore(wrapper, section.firstChild);

    var overlay = document.createElement('div');
    overlay.dataset.bannerOverlay = '1';
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;background:transparent;';
    wrapper.insertAdjacentElement('afterend', overlay);

    vimeoPlayer = new Vimeo.Player(iframe);
    vimeoPlayer.off('ended');
vimeoPlayer.on('ended', function() {
  vimeoPlayer.setVolume(0).then(function() {
    vimeoPlayer.setCurrentTime(0).then(function() {
      vimeoPlayer.play().catch(function(){});
    });
  });
});
    _bannerInitialized = true;

  } else {
    if (vimeoPlayer) {
      vimeoPlayer.loadVideo(vimeoId).then(function() {
        vimeoPlayer.setVolume(0);
        vimeoPlayer.play();
        vimeoPlayer.off('ended');
        vimeoPlayer.on('ended', function() {
          vimeoPlayer.setVolume(0).then(function() {
            vimeoPlayer.setCurrentTime(0).then(function() {
              vimeoPlayer.play().catch(function(){});
            });
          });
        });
      }).catch(function(error) {
        console.warn('Erro ao carregar vídeo:', error);
      });
    }
  }

  setupUnmuteButton();
  showUnmuteBtn();
}

/* --- SCROLL INTELIGENTE DO TOP 10 CORRIGIDO --- */
var top10 = document.getElementById('top10');

function scrollTop10Left() {
  var el = document.getElementById('top10');
  if (el.scrollLeft <= 0) { el.scrollLeft = el.scrollWidth; }
  else { el.scrollBy({ left: -400, behavior: 'smooth' }); }
}

function scrollTop10Right() {
  var el = document.getElementById('top10');
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) { el.scrollLeft = 0; }
  else { el.scrollBy({ left: 400, behavior: 'smooth' }); }
}

function scrollTop20Left() {
  var el = document.getElementById('top20');
  if (el.scrollLeft <= 0) { el.scrollLeft = el.scrollWidth; }
  else { el.scrollBy({ left: -400, behavior: 'smooth' }); }
}

function scrollTop20Right() {
  var el = document.getElementById('top20');
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) { el.scrollLeft = 0; }
  else { el.scrollBy({ left: 400, behavior: 'smooth' }); }
}

function scrollCategory(button, direction) {
  var container = button.parentElement.querySelector('.games-scroll');
  container.scrollLeft += direction * 300;
}

/* --- EFEITO DO HEADER NO SCROLL --- */
window.addEventListener('scroll', function() {
  var header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.style.background = 'rgba(20,20,20,0.95)';
  } else {
    header.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, transparent)';
  }
});

/* --- EVENTOS DO BANNER VIDEO CLOUDINARY --- */
function registerBannerVideoEvents(videoEl) {
  if (!videoEl || videoEl._eventsRegistered) return;
  videoEl._eventsRegistered = true;

  videoEl.removeAttribute('loop');

  videoEl.addEventListener('ended', function() {
    videoEl.muted = true;
    videoEl.play().catch(function(){});
  });
}
/* --- LÓGICA DO MODAL DE VÍDEO (NETFLIX STYLE) --- */
function openModal(title, desc, videoSrc) {
  var modal = document.getElementById("netflixModal");
  var modalContent = modal.querySelector(".modal-content");
  var iframe = document.getElementById("modalVideo");

  if (vimeoPlayer) {
    vimeoPlayer.pause();
  }

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;

  var vimeoId = getVimeoId(videoSrc);
  if (vimeoId) {
    iframe.src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&muted=0&controls=1&color=e50914';
  } else {
    iframe.src = videoSrc;
  }

  modalContent.style.boxShadow = "0 0 80px rgba(229, 9, 20, 0.6)";
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  var modal = document.getElementById("netflixModal");
  var iframe = document.getElementById("modalVideo");

  iframe.src = "";
  modal.classList.remove("active");
  document.body.style.overflow = "";

  if (vimeoPlayer) {
    vimeoPlayer.play().catch(function(){});
  }
}

document.getElementById("netflixModal").addEventListener("click", function(e) {
  if (e.target.id === "netflixModal") closeModal();
});

/* --- DEFINE O BOTÃO "MAIS INFORMAÇÕES" PARA info.html?id=SLUG --- */
function setBannerInfoLink(title) {
  var downloadAnchor = document.getElementById('banner-link');
  var actionBtn = document.getElementById('btn-main-action');
  if (downloadAnchor && title) {
    downloadAnchor.href = 'info.html?id=' + toGameSlug(title);
    downloadAnchor.target = '_blank';
    downloadAnchor.rel = 'noopener noreferrer';
    downloadAnchor.onclick = null;
  }
  if (actionBtn) {
    actionBtn.innerHTML = "ⓘ OBTER JOGO AGORA";
  }
}

document.querySelectorAll('.free-game-trigger').forEach(function(card) {
  card.addEventListener('click', function () {
    var novaLogo = this.getAttribute('data-logo');
    var novaDesc = this.getAttribute('data-desc');
    var novoVideo = this.getAttribute('data-video');
    var dataTitle = this.getAttribute('data-title');

    document.getElementById('banner-logo').src = novaLogo;
    document.getElementById('banner-desc').textContent = novaDesc;

    setBannerVideo(novoVideo);
    setBannerInfoLink(dataTitle);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* --- LÓGICA DE LOGIN ---
   Substituída por auth.js (login obrigatório com nome + email + whatsapp).
   Este bloco foi removido para evitar conflito.
   ------------------------------------------------------------------ */


function openWppModal() {
  var modalWpp = document.getElementById("wppModal");
  if (modalWpp) {
    modalWpp.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.body.classList.add('modal-open');
  }
}

function closeWppModal() {
  var modalWpp = document.getElementById("wppModal");
  if (modalWpp) {
    modalWpp.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.classList.remove('modal-open');
  }
}

window.addEventListener('click', function (event) {
  var modalWpp = document.getElementById("wppModal");
  var modalNetflix = document.getElementById("netflixModal");
  if (event.target === modalWpp) closeWppModal();
  if (event.target === modalNetflix) closeModal();
});

/* --- GERENCIADOR DE CLIQUES PADRONIZADO (TOP 10 + CATEGORIAS) --- */
document.addEventListener('click', function (e) {
  if (e.target.closest('#login-screen') || e.target.closest('#login-form')) return;

  var card = e.target.closest('.game-card, .card-container');
  if (!card) return;

  var gameData = card.querySelector('img') || card;

  var title = gameData.getAttribute('data-title');
  var desc = gameData.getAttribute('data-desc');
  var video = gameData.getAttribute('data-video');
  var logo = gameData.getAttribute('data-logo');

  if (title && video) {
    e.preventDefault();
    e.stopPropagation();

    setBannerVideo(video);

    var bannerDesc = document.getElementById('banner-desc');
    var bannerTitle = document.getElementById('banner-logo');
    if (bannerDesc) bannerDesc.textContent = desc;
    if (bannerTitle) bannerTitle.src = logo;

    setBannerInfoLink(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
}, true);

/* ============================================================
   MODAIS DE CATEGORIA
   ============================================================ */
function openCategoryModal(cat) {
  var modal = document.getElementById('modal-' + cat);
  if (!modal) return;
  document.body.style.overflow = 'hidden';
  modal.classList.add('active');
  if (cat === 'sorteios') startRaffleCountdown();
}

function closeCategoryModal(cat) {
  var modal = document.getElementById('modal-' + cat);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cat-modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.cat-modal-overlay.active').forEach(function(m) {
        m.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
});

/* --- FAQ Accordion --- */
function toggleFaq(item) {
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.cat-faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

/* --- Countdown Sorteio --- */
function startRaffleCountdown() {
  function update() {
    var now = new Date();
    var target = new Date(now.getFullYear(), now.getMonth(), 30, 20, 0, 0);
    if (now >= target) target = new Date(now.getFullYear(), now.getMonth() + 1, 30, 20, 0, 0);
    var diff = target - now;
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var dEl = document.getElementById('raffle-days');
    var hEl = document.getElementById('raffle-hours');
    var mEl = document.getElementById('raffle-mins');
    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
  }
  update();
  setInterval(update, 30000);
}

/* ============================================================
   BUSCA ESTILO STEAM COM DROPDOWN
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('game-search');
  var dropdown = document.getElementById('search-results-dropdown');
  if (!searchInput || !dropdown) return;

  function getAllGames() {
    var games = [];
    var seen = new Set();
    document.querySelectorAll('.game-card, .poster-img, .card-container img').forEach(function(el) {
      var title = el.getAttribute('data-title') || el.getAttribute('alt') || '';
      var desc = el.getAttribute('data-desc') || '';
      var img = el.getAttribute('src') || '';
      var video = el.getAttribute('data-video') || '';
      var logo = el.getAttribute('data-logo') || '';
      var dataLink = el.getAttribute('data-link') || '';
      if (title && title !== 'NOME DO JOGO' && !seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        games.push({ title: title, desc: desc, img: img, video: video, logo: logo, dataLink: dataLink, el: el });
      }
    });
    return games;
  }

  var allGames = [];
  setTimeout(function() { allGames = getAllGames(); }, 500);

  function renderResults(term) {
    if (!term) { dropdown.classList.remove('active'); return; }
    var filtered = allGames.filter(function(g) { return g.title.toLowerCase().includes(term.toLowerCase()); });
    if (filtered.length === 0) {
      dropdown.innerHTML = '<div class="search-no-results"><span>🎮</span>Nenhum jogo encontrado para "<strong>' + term + '</strong>"</div>';
    } else {
      dropdown.innerHTML = filtered.slice(0, 8).map(function(g) {
        return '<div class="search-result-item" data-title="' + g.title + '" data-desc="' + g.desc + '" data-img="' + g.img + '" data-video="' + g.video + '" data-logo="' + g.logo + '" data-link="' + g.dataLink + '">' +
        '<img class="search-result-img" src="' + g.img + '" alt="' + g.title + '" onerror="this.style.display=\'none\'">' +
        '<div class="search-result-info"><div class="search-result-title">' + g.title + '</div>' +
        '<div class="search-result-desc">' + (g.desc || 'Clique para ver o trailer') + '</div></div>' +
        '<span class="search-result-arrow">▶</span></div>';
      }).join('');
    }
    dropdown.classList.add('active');
    dropdown.querySelectorAll('.search-result-item').forEach(function(item) {
      item.addEventListener('click', function () {
        var title = this.dataset.title;
        var desc = this.dataset.desc;
        var video = this.dataset.video;
        var logo = this.dataset.logo;
        setBannerVideo(video);
        var bannerDesc = document.getElementById('banner-desc');
        var bannerLogo = document.getElementById('banner-logo');
        if (bannerDesc && desc) bannerDesc.textContent = desc;
        if (bannerLogo && logo) bannerLogo.src = logo;
        setBannerInfoLink(title);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        searchInput.value = '';
        dropdown.classList.remove('active');
      });
    });
  }

  searchInput.addEventListener('input', function () {
    var term = this.value.trim();
    if (allGames.length === 0) allGames = getAllGames();
    renderResults(term);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#search-container') && !e.target.closest('.search-wrapper')) {
      dropdown.classList.remove('active');
    }
  });

  document.getElementById('search-container').addEventListener('click', function (e) {
    e.stopPropagation();
  });
});

// botao logo volta para o topo
document.getElementById('logo-back-to-top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   JOGOS EM PROMOÇÃO — CONFIGURAÇÃO ADMIN
   ============================================================ */
var promoGamesConfig = [
  {
    emPromocao: true,
    id: 'days-gone',
    titulo: 'Days Gone',
    imagem: 'https://res.cloudinary.com/dnponjtdn/image/upload/v1777349196/days-gone-remastered-2025--30418_bydcux.jpg',
    precoOriginal: 'R$149,90',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  },
  {
    emPromocao: true,
    id: 'assassins-creed-black-flag',
    titulo: "Assassin's Creed Black Flag",
    imagem: 'https://image.api.playstation.com/cdn/UP0001/CUSA00010_00/gRQIIOrW2ijiWUUnpmgUIwDv9L9UE4XV.png',
    precoOriginal: 'R$89,90',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  },
  {
    emPromocao: true,
    id: 'far-cry-4',
    titulo: 'Far Cry 4',
    imagem: 'https://cdn1.epicgames.com/offer/cf87285950ba492bbdc370b9d265ea36/FC4_StorePortrait_1200x1600_1200x1600-7f366d878f5553dae499860243c537ee',
    precoOriginal: 'R$79,90',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  },
  {
    emPromocao: true,
    id: 'need-for-speed-payback',
    titulo: 'Need for Speed Payback',
    imagem: 'https://images.steamusercontent.com/ugc/5109928331639408171/D260688DBD1EBFEF65BABF0D2E6956D8391E72B3/',
    precoOriginal: 'R$89,99',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  },
  {
    emPromocao: true,
    id: 'mad-max',
    titulo: 'Mad Max',
    imagem: 'https://bdjogos.com.br/capas/5689-mad-max-capa-1.jpg',
    precoOriginal: 'R$59,90',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  },
  {
    emPromocao: true,
    id: 'mortal-kombat-x',
    titulo: 'Mortal Kombat X',
    imagem: 'https://images.gog.com/3272c0976e5651c0629daf5eab1ac4b2c49d7154b0a316886a1c7fa8b26af702_glx_vertical_cover.webp?namespace=gamesdb',
    precoOriginal: 'R$99,90',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  },
  {
    emPromocao: true,
    id: 'plants-vs-zombies',
    titulo: 'Plants vs. Zombies',
    imagem: 'https://cdn.kobo.com/book-images/6174c893-747b-449e-9794-fc9dcca86036/1200/1200/False/plants-vs-zombies-volume-3-bully-for-you.jpg',
    precoOriginal: 'R$59,90',
    precoPromocao: 'GRÁTIS',
    desconto: '100%'
  }
];
/* ============================================================
   RENDERIZAÇÃO AUTOMÁTICA — não precisa editar abaixo
   ============================================================ */
function renderPromoGames() {
  var grid = document.getElementById('promo-games-grid');
  var emptyMsg = document.getElementById('promo-empty-msg');
  if (!grid) return;

  var ativos = promoGamesConfig.filter(function(g) { return g.emPromocao; });

  if (ativos.length === 0) {
    grid.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  grid.style.display = '';
  if (emptyMsg) emptyMsg.style.display = 'none';

  grid.innerHTML = ativos.map(function(g) {
    var infoLink = 'baixar.html?id=' + g.id;   // ← Aqui está a mudança principal
    return '<a href="' + infoLink + '" target="_blank" rel="noopener noreferrer" class="promo-card" style="text-decoration:none;">'
      + '<span class="promo-card-badge">-' + (g.desconto || '') + '</span>'
      + '<img class="promo-card-img" src="' + g.imagem + '" alt="' + g.titulo + '" loading="lazy" onerror="this.style.opacity=\'0.3\'">'
      + '<div class="promo-card-info">'
      +   '<h3 class="promo-card-title">' + g.titulo + '</h3>'
      +   '<div class="promo-card-prices">'
      +     '<span class="promo-card-original">' + (g.precoOriginal || '') + '</span>'
      +     '<span class="promo-card-promo">' + (g.precoPromocao || '') + '</span>'
      +   '</div>'
      +   '<span class="promo-card-btn">⬇️BAIXAR</span>'
      + '</div>'
      + '</a>';
  }).join('');
}

/* Roda ao abrir o modal de promoções */
(function() {
  var _origOpen = window.openCategoryModal;
  window.openCategoryModal = function(cat) {
    if (cat === 'promocoes') renderPromoGames();
    _origOpen(cat);
  };
})();

/* ================================================================
   GAMEFLIX — MELHORES OFERTAS (JavaScript) — VERSÃO CORRIGIDA
   Cole este bloco no FINAL do seu script.js.

   COMO O BOTÃO "OBTER AGORA" FUNCIONA:
   - Abre info.html?id=SLUG em nova aba — exatamente a mesma página
     de vendas que o usuário vê ao clicar em "OBTER JOGO AGORA" no banner.
   - Preços e slugs extraídos diretamente do GAMES_DB do info.html.
   - Trilogia Crash (sem slug próprio) redireciona ao WhatsApp.
   ================================================================ */

/* ── CATÁLOGO — IDs e preços 100% vindos do GAMES_DB de info.html ── */
var ofertasConfig = [
  {
    /* slug: 'resident-evil-requiem'  |  info.html: R$49,90 / R$249,90 */
    id: 'resident-evil-requiem',
    titulo: 'Resident Evil Requiem',
    imagem: 'https://cdn.loaded.com/496x700/media/catalog/product/r/e/resident_evil_requiem_cdkeys_1.png',
    logo: 'https://cdn2.steamgriddb.com/logo/5b91726d21e05916d2eb308f2fd0444e.png',
    desc: 'O terror voltou mais assustador do que nunca. Deluxe Edition.',
    video: 'https://vimeo.com/1187563729?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,90',
    desconto: '-70%',
    hot: true
  },
  {
    /* slug: 'god-of-war-ragnarok'  |  info.html: R$74,90 / R$249,90 */
    id: 'god-of-war-ragnarok',
    titulo: 'God of War Ragnarök',
    imagem: 'https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-store-art-01-10sep21$ru?$800px--t$',
    logo: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/92554480-bde6-4f5c-9861-7022237da1ce/dfk2top-494d7ab4-4d24-4455-bcda-402bf76378d6.png',
    desc: 'Pai e filho contra o impossível. Atravesse os Nove Reinos.',
    video: 'https://vimeo.com/1187555294?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,90',
    desconto: '-70%',
    hot: true
  },
  {
    /* slug: 'red-dead-redemption-2'  |  info.html: R$89,90 / R$299,90 */
    id: 'red-dead-redemption-2',
    titulo: 'Red Dead Redemption 2',
    imagem: 'https://upload.wikimedia.org/wikipedia/pt/e/e7/Red_Dead_Redemption_2.png',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Red_Dead_Redemption_2_Logo.png/1280px-Red_Dead_Redemption_2_Logo.png',
    desc: 'A lenda do oeste. Lealdade, perda e redenção no pôr do sol mais épico.',
    video: 'https://vimeo.com/1187556626?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,90',
    desconto: '-70%',
    hot: false
  },
  {
    /* slug: 'crimson-desert'  |  info.html: R$89,97 / R$299,90 */
    id: 'crimson-desert',
    titulo: 'Crimson Desert',
    imagem: 'https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc5/image_2025-09-24_193459770.png',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/6/6c/Crimson_Desert_Logo.png',
    desc: 'Mundo aberto colossal. Explore, conquiste e descubra cada segredo.',
    video: 'https://vimeo.com/1187774922?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,97',
    desconto: '-70%',
    hot: false
  },
  {
    /* slug: 'battlefield-6'  |  info.html: R$89,90 / R$299,90 */
    id: 'battlefield-6',
    titulo: 'Battlefield 6',
    imagem: 'https://cdn1.epicgames.com/offer/a14a02aa3c8143729605eaf7c93d7501/EGS_Battlefield6_BattlefieldStudios_S2_1200x1600-a88625a836120c55650c83d17a010c25',
    logo: 'https://cdn2.steamgriddb.com/logo/4c25257cc0a490730dee6fe6a528accc.png',
    desc: 'O mais baixado da Gameflix. Destruição total e gráficos fotorrealistas.',
    video: 'https://vimeo.com/1189613164?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,90',
    desconto: '-70%',
    hot: true
  },
  {
    /* slug: 'cyberpunk-2077'  |  info.html: R$59,90 / R$199,90 */
    id: 'cyberpunk-2077',
    titulo: 'Cyberpunk 2077',
    imagem: 'https://www.productsleutels.nl/wp-content/uploads/2021/01/Cyberpunk-2077-PC-COVER.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 199,90',
    precoNovo: 'R$ 74,90',
    desconto: '-62%',
    hot: true
  },
   {
  
    id: 'the-last-of-us-ii',
    titulo: 'The Last Of Us II',
    imagem: 'https://m.media-amazon.com/images/M/MV5BODIwYWZmYWMtYTliNC00YWQ5LTg5ZmEtNTZhNmUxNjdiMzNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 249,90',
    precoNovo: 'R$ 74,90',
    desconto: '-70%',
    hot: true
  }, 
  {
  
    id: '     spider-man-2     ',
    titulo: ' Spider Man 2  ',
    imagem: '  https://cdn1.epicgames.com/offer/b2818b59c0bb420e9647983dfd254931/EGS_MarvelsSpiderManDigitalDeluxeEdition_InsomniacGamesNixxesSoftware_Editions_S2_1200x1600-148e0014e79aa7c2cb23ae2414b11a16 ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,90',
    desconto: '-70%',
    hot: true
  }, 

  {
  
    id: '    forza-horizon-6    ',
    titulo: ' Forza Horizon 6',
    imagem: 'https://upload.wikimedia.org/wikipedia/pt/0/03/Forza_Horizon_6.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 549,90',
    precoNovo: 'R$ 109,80',
    desconto: '-80%',
    hot: true
  }, 

  {
  
    id: '   black-myth-wukong  ',
    titulo: ' Black Myth: Wukong  ',
    imagem: '  https://hobbygames.ru/image/enaza/19184698/box2.jpg.jpg ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 299,90',
    precoNovo: 'R$ 89,90',
    desconto: '-70%',
    hot: true
  }, 


  {
  
    id: '    elden-ring   ',
    titulo: ' ELDEN RING  ',
    imagem: '   https://assets.xboxservices.com/assets/7b/54/7b54f5e4-0857-4ce3-8a18-2b8c431e8a9e.jpg?n=Elden-Ring_GLP-Page-Hero-0_1083x1222_01.jpg  ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 279,90',
    precoNovo: 'R$ 74,90',
    desconto: '-73%',
    hot: true
  }, 



  

  {
  
    id: '    assassin-s-creed-origins    ',
    titulo: '  Assassins Creed Origins   ',
    imagem: '  https://cdn1.epicgames.com/offer/camellia/ACOrigins_STD_Store_Portrait_1200x1600_1200x1600-4a79f9f393f7a3a9e5be3a0ae581f3d5 ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 249,90',
    precoNovo: 'R$ 74,97',
    desconto: '-70%',
    hot: true
  }, 



  {
  
    id: '      the-last-of-us-part-i  ',
    titulo: 'The Last of Us Part I  ',
    imagem: ' https://cdn1.epicgames.com/offer/0c40923dd1174a768f732a3b013dcff2/EGS_TheLastofUsPartIDigitalDeluxeEdition_NaughtyDogLLC_Editions_S2_1200x1600-6db4887c7913c5a43ae3a086de2ad29c ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 249,90',
    precoNovo: 'R$ 74,90',
    desconto: '-70%',
    hot: true
  }, 

  
  {
  
    id: '    ghost-of-tsushima    ',
    titulo: ' Ghost of Tsushima   ',
    imagem: '  https://cdn1.epicgames.com/offer/6e6aa039c73347b885803de65ac5d3db/EGS_GhostofTsushima_SuckerPunchProductions_S2_1200x1600-e23e02c1d70be7b528dba50860f87d39  ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 279,90',
    precoNovo: 'R$ 83,90',
    desconto: '-70%',
    hot: true
  }, 


{
  
    id: '   resident-evil-4-remake    ',
    titulo: '  Resident Evil 4 Remake  ',
    imagem: '   https://upload.wikimedia.org/wikipedia/pt/3/30/Resident_Evil_4_%28remake%29.png  ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png',
    desc: 'RPG em mundo aberto em Night City. Edição completa com DLC Phantom Liberty.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 169,90',
    precoNovo: 'R$ 69,70',
    desconto: '-59%',
    hot: true
  }, 






  {
    /* slug: 'far-cry-3'  |  info.html: R$22,90 / R$74,90 */
    id: 'far-cry-3',
    titulo: 'Far Cry 3',
    imagem: 'https://upload.wikimedia.org/wikipedia/pt/5/59/Far_cry_3_box_art.jpg',
    logo: '',
    desc: 'Sobreviva ao paraíso selvagem. O atirador de mundo aberto que definiu uma geração.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 99,67',
    precoNovo: 'R$ 44,85',
    desconto: '-55%',
    hot: false
  },
  {
    /* slug: 'farcry-primal'  |  info.html: R$29,90 / R$99,90 */
    id: 'farcry-primal',
    titulo: 'Far Cry Primal',
    imagem: 'https://upload.wikimedia.org/wikipedia/pt/b/be/Farcry_primal_box.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Far_Cry_Primal_Logo.png',
    desc: 'A era do gelo. Caçador ou presa — a lei é a sua.',
    video: 'https://vimeo.com/1187562867?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 87,90',
    precoNovo: 'R$ 44,90',
    desconto: '-49%',
    hot: false
  },
  {
    /* slug: 'resident-evil-3'  |  info.html: R$44,90 / R$149,90 */
    id: 'resident-evil-3',
    titulo: 'Resident Evil 3',
    imagem: 'https://howlongtobeat.com/games/72822_Resident_Evil_3_(2020).jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/archive/b/b4/20221107130840%21Resident_Evil_3_Logo.png',
    desc: 'Jill Valentine contra o implacável Nemesis. Fuga ou confronto?',
    video: 'https://vimeo.com/1187557074?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 99,82',
    precoNovo: 'R$ 54,90',
    desconto: '-45%',
    hot: false
  },
  {
    /* Trilogia Crash — sem slug no GAMES_DB → redireciona ao WhatsApp */
    id: 'crash-bandicoot',
    titulo: ' Crash Bandicoot N. Sane Trilogy  ',
    imagem: 'https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000002090/ecfc64f339579b17ed8d12d5bdb4acd0cad2811cb2ff7dd0a02ce7e512c2d26a',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/archive/b/b4/20221107130840%21Resident_Evil_3_Logo.png',
    desc: 'Jill Valentine contra o implacável Nemesis. Fuga ou confronto?',
    video: 'https://vimeo.com/1187557074?share=copy&fl=sv&fe=ci',
    precoAntigo: 'R$ 199,00',
    precoNovo: 'R$ 69,90',
    desconto: '-65%',
    hot: false
  },
];

/* ── RENDERIZAÇÃO DO GRID ────────────────────────────────────────── */
function renderOfertasGames() {
  var grid = document.getElementById('gfo-games-grid');
  if (!grid) return;

  grid.innerHTML = ofertasConfig.map(function(g) {
    var hotBadge = g.hot ? '' : '';

    /*
     * Destino do clique:
     *   - Jogo com slug  → info.html?id=SLUG  (página de vendas real)
     *   - Trilogia Crash → WhatsApp (não existe no GAMES_DB)
     */
    var href = g.id
      ? 'info.html?id=' + g.id
      : (g.wppLink || 'https://wa.me/55981021909');

    return (
      '<div class="gfo-card">' +
        '<div class="gfo-card-img-wrap">' +
          hotBadge +
          '<img src="' + g.imagem + '" alt="' + g.titulo + '" loading="lazy" onerror="this.style.opacity=\'0.25\'">' +
          '<div class="gfo-card-img-overlay"></div>' +
          '<span class="gfo-discount-badge">' + g.desconto + '</span>' +
        '</div>' +
        '<div class="gfo-card-info">' +
          '<h3 class="gfo-card-title">' + g.titulo + '</h3>' +
          '<div class="gfo-card-prices">' +
            '<span class="gfo-price-old">' + g.precoAntigo + '</span>' +
            '<span class="gfo-price-new">' + g.precoNovo + '</span>' +
          '</div>' +
          '<a class="gfo-get-btn" href="' + href + '" target="_blank" rel="noopener noreferrer">' +
            '⚡ Obter Agora' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ── HOOK NO openCategoryModal EXISTENTE ────────────────────────── */
(function waitForModal() {
  if (typeof window.openCategoryModal !== 'function') {
    setTimeout(waitForModal, 80);
    return;
  }
  var _origOpen = window.openCategoryModal;
  window.openCategoryModal = function(cat) {
    if (cat === 'ofertas') renderOfertasGames();
    _origOpen(cat);
  };
})();
