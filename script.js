/* --- SCROLL INTELIGENTE DO TOP 10 CORRIGIDO --- */
const top10 = document.getElementById('top10'); // Certifique-se que o ID no HTML é 'top10'

function scrollTop10Left() {
  const el = document.getElementById('top10');

  if (el.scrollLeft <= 0) {
    el.scrollLeft = el.scrollWidth;
  } else {
    el.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollTop10Right() {
  const el = document.getElementById('top10');

  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
    el.scrollLeft = 0;
  } else {
    el.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

function scrollTop20Left() {
  const el = document.getElementById('top20');

  if (el.scrollLeft <= 0) {
    el.scrollLeft = el.scrollWidth;
  } else {
    el.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollTop20Right() {
  const el = document.getElementById('top20');

  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
    el.scrollLeft = 0;
  } else {
    el.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

function scrollCategory(button, direction) {
  const container = button.parentElement.querySelector('.games-scroll');
  container.scrollLeft += direction * 300;
}
  

/* --- EFEITO DO HEADER NO SCROLL --- */
window.addEventListener('scroll', ()=>{
  const header = document.getElementById('header');
  if(window.scrollY > 50) {
    header.style.background = 'rgba(20,20,20,0.95)';
  } else {
    header.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, transparent)';
  }
});

/* --- CONTROLE DO VÍDEO DO BANNER (LOOP INTELIGENTE) --- */
window.addEventListener("DOMContentLoaded", ()=>{
  const bannerSection = document.getElementById("main-banner");
  const bannerVideo = document.getElementById("banner-video");
  if(!bannerVideo || !bannerSection) return;

  // 1. Removemos o loop padrão do HTML para o JavaScript assumir o controle
  bannerVideo.removeAttribute("loop");

  // 2. Quando o vídeo terminar, ele muta o som e começa de novo!
  bannerVideo.addEventListener("ended", () => {
    bannerVideo.muted = true; // Fica mudo
    bannerVideo.play().catch(()=>{}); // Recomeça o vídeo
  });

  // 3. Clique no banner para ligar/desligar o som manualmente, se o usuário quiser
  bannerSection.addEventListener("click", ()=>{
    if(bannerVideo.muted){
      bannerVideo.muted = false;
      bannerVideo.volume = 0.3; // Volume agradável
    } else {
      bannerVideo.muted = true;
    }
  });
});

function openModal(title, desc, videoSrc) {
  const modal = document.getElementById("netflixModal");
  const modalContent = modal.querySelector(".modal-content");
  const iframe = document.getElementById("modalVideo");
  const bannerVideo = document.getElementById("banner-video");

  // PAUSA O VÍDEO DE FUNDO
  if(bannerVideo) {
    bannerVideo.pause();
    bannerVideo.muted = true; 
  }

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;

  // LÓGICA DE VÍDEO (Mantendo sua estrutura original)
  if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be") || videoSrc.length < 15) {
    const youtubeId = videoSrc.includes("v=") ? videoSrc.split("v=")[1] : videoSrc;
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&rel=0`;
  } else {
    iframe.src = videoSrc; 
  }
  
  // --- EFEITO AMBILIGHT MASTER ---
  // Aplica um brilho neon baseado na identidade visual da GAMEFLIX (Vermelho)
  // ou você pode personalizar por jogo aqui
  modalContent.style.boxShadow = "0 0 80px rgba(229, 9, 20, 0.6)";

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  const modal = document.getElementById("netflixModal");
  const iframe = document.getElementById("modalVideo");
  const bannerVideo = document.getElementById("banner-video");

  // Remove o vídeo do YouTube para ele parar de tocar
  iframe.src = "";

  modal.classList.remove("active");
  document.body.style.overflow = "";

  // Volta a rodar o vídeo de fundo, mas MUTADO para não atrapalhar a paz
  if(bannerVideo) {
    bannerVideo.muted = true;
    bannerVideo.play().catch(()=>{});
  }
}

/* Fecha o modal clicando fora dele (na parte escura) */
document.getElementById("netflixModal").addEventListener("click", e => {
  if(e.target.id === "netflixModal") closeModal();
});

/* --- LÓGICA DE TROCA DO BANNER (TUDO VOLTA AO NORMAL) --- */
document.querySelectorAll('.free-game-trigger').forEach(card => {
  card.addEventListener('click', function() {
    // 1. Captura os dados (Isso garante que o trailer e logo voltem)
    const novaLogo = this.getAttribute('data-logo');
    const novaDesc = this.getAttribute('data-desc');
    const novoVideo = this.getAttribute('data-video');
    const linkDrive = this.getAttribute('data-drive'); 

    // 2. Atualiza o banner normalmente (Logo e Descrição)
    document.getElementById('banner-logo').src = novaLogo;
    document.getElementById('banner-desc').textContent = novaDesc;
    
    // 3. Reinicia o Vídeo do Trailer
    const videoElement = document.getElementById('banner-video');
    if (videoElement) {
      videoElement.src = novoVideo;
      videoElement.load(); 
      videoElement.play().catch(()=>{});
    }

    // 4. CONFIGURAÇÃO DO BOTÃO (O segredo está aqui)
    const downloadAnchor = document.getElementById('banner-link');
    const actionBtn = document.getElementById('btn-main-action'); // Captura o botão visual
    
    if (linkDrive) {
      // Caso FarCry: Libera o link do Drive
      downloadAnchor.href = linkDrive;
      downloadAnchor.target = "_blank";
      downloadAnchor.onclick = null; 
    } else {
      // Outros jogos: Bloqueia o link e mostra o seu alerta
      downloadAnchor.href = "javascript:void(0)";
      downloadAnchor.target = "_self";
      downloadAnchor.onclick = function(e) {
        e.preventDefault(); // Garante que a página não recarregue
        alert("Este jogo libera em breve para download, enquanto isso vc pode baixar o FARCRY PRIMAL que ja esta disponivel para download");
      };
    }

    // 5. Garante que o texto do botão mude para Download (como no seu original)
    if (actionBtn) {
      actionBtn.innerHTML = "▶ DOWNLOAD GRATIS";
    }

    // Sobe para o topo para mostrar a troca do banner
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
/* --- LÓGICA DE LOGIN COM VÍDEO E SOM AJUSTADA --- */
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); 

  const emailInput = document.getElementById('user-email').value;
  const passwordInput = document.getElementById('user-password').value;

  const emailCorreto = "testegratis@gameflix.com";
  const senhaCorreta = "a";

  if (emailInput === emailCorreto && passwordInput === senhaCorreta) {
    // 1. Esconde a tela de login
    document.getElementById('login-screen').classList.add('hidden');
    
    // 2. Localiza os elementos
    const bannerVideo = document.getElementById("banner-video");
    const unmuteBtn = document.getElementById('btn-unmute');

    if (bannerVideo) {
      // Inicia o vídeo mudo (necessário para o autoplay funcionar)
      bannerVideo.muted = true; 
      bannerVideo.play().catch(err => console.log("Erro no autoplay:", err));

      if (unmuteBtn) {
        // Mostra o botão pulsante
        unmuteBtn.style.display = 'block'; 

        unmuteBtn.addEventListener('click', function() {
          // AÇÃO PARA ATIVAR O SOM
          bannerVideo.muted = false;       // Desativa o mudo
          bannerVideo.volume = 0.7;        // Garante que o volume está alto
          
          // Recomeça o vídeo
          bannerVideo.currentTime = 0;     
          
          // Tenta dar o play novamente agora com som
          const playPromise = bannerVideo.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Som ativado com sucesso!");
            }).catch(error => {
              console.log("O navegador bloqueou o áudio:", error);
            });
          }

          // Esconde o botão após o clique
          unmuteBtn.style.display = 'none'; 
        }, { once: true });
      }
    }
    
    console.log("Bem-vindo ao GAMEFLIX!");
  } else {
    alert("Email ou senha incorretos. Tente novamente.");
  }
});
/* --- AJUSTE EXCLUSIVO PARA O POPUP WHATSAPP --- */
function openWppModal() {
  const modalWpp = document.getElementById("wppModal");
  if(modalWpp) {
      modalWpp.style.display = "flex";
      document.body.style.overflow = "hidden";
      document.body.classList.add('modal-open'); // Aplica o desfoque do CSS
  }
}

function closeWppModal() {
  const modalWpp = document.getElementById("wppModal");
  if(modalWpp) {
      modalWpp.style.display = "none";
      document.body.style.overflow = "auto";
      document.body.classList.remove('modal-open'); // Remove o desfoque
  }
}
/* FECHAR MODAIS CLICANDO FORA */
window.addEventListener('click', function(event) {
    const modalWpp = document.getElementById("wppModal");
    const modalNetflix = document.getElementById("netflixModal");
    if (event.target === modalWpp) closeWppModal();
    if (event.target === modalNetflix) closeModal();
});




/* --- NOVO GERENCIADOR DE CLIQUES PADRONIZADO --- */
document.addEventListener('click', function(e) {
    // 1. Não interfere no sistema de Login
    if (e.target.closest('#login-screen') || e.target.closest('#login-form')) {
        return; 
    }

    // Busca o card clicado (seja da lista especial ou do Top 10)
    const card = e.target.closest('.game-card, .card-container');
    if (!card) return;

    // Tenta pegar a imagem que contém os dados (data-attributes)
    const gameData = card.querySelector('img') || card;
    
    const title = gameData.getAttribute('data-title');
    const desc = gameData.getAttribute('data-desc');
    const video = gameData.getAttribute('data-video');
    const logo = gameData.getAttribute('data-logo');

    // Se o card tiver os dados, ele executa a subida do trailer
    if (title && video) {
        e.preventDefault();
        e.stopPropagation();

        const bannerVideo = document.getElementById('banner-video');
        const bannerTitle = document.getElementById('banner-logo');
        const bannerDesc = document.getElementById('banner-desc');

        // Troca o vídeo no topo e ativa o som
        if (bannerVideo) {
            bannerVideo.src = video;
            bannerVideo.load(); // Garante que o novo vídeo carregue
            bannerVideo.play();
            bannerVideo.muted = false; 
            bannerVideo.volume = 0.5;
        }

        // Troca o Logo e a Descrição no topo
        if (bannerDesc) bannerDesc.textContent = desc;
        if (bannerTitle) bannerTitle.src = logo;

        // Sobe a página para o topo para o usuário ver o trailer
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        return;
    }
}, true);

/* ============================================================
   MODAIS DE CATEGORIA - SISTEMA COMPLETO
   ============================================================ */
function openCategoryModal(cat) {
  const modal = document.getElementById('modal-' + cat);
  if (!modal) return;
  document.body.style.overflow = 'hidden';
  modal.classList.add('active');

  // Inicia contagem regressiva no modal de sorteios
  if (cat === 'sorteios') startRaffleCountdown();
}

function closeCategoryModal(cat) {
  const modal = document.getElementById('modal-' + cat);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Fecha clicando no overlay escuro
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.cat-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC fecha qualquer modal de categoria
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.cat-modal-overlay.active').forEach(m => {
        m.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
});

/* --- FAQ Accordion --- */
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  // Fecha todos
  document.querySelectorAll('.cat-faq-item.open').forEach(i => i.classList.remove('open'));
  // Abre o clicado, se não estava aberto
  if (!isOpen) item.classList.add('open');
}

/* --- Countdown Sorteio --- */
function startRaffleCountdown() {
  function update() {
    const now = new Date();
    // Próximo dia 30 do mês atual (ou próximo mês)
    let target = new Date(now.getFullYear(), now.getMonth(), 30, 20, 0, 0);
    if (now >= target) target = new Date(now.getFullYear(), now.getMonth() + 1, 30, 20, 0, 0);

    const diff = target - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    const dEl = document.getElementById('raffle-days');
    const hEl = document.getElementById('raffle-hours');
    const mEl = document.getElementById('raffle-mins');
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
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('game-search');
  const dropdown = document.getElementById('search-results-dropdown');
  if (!searchInput || !dropdown) return;

  // Coleta todos os jogos do site ao carregar
  function getAllGames() {
    const games = [];
    const seen = new Set();
    document.querySelectorAll('.game-card, .poster-img, .card-container img').forEach(el => {
      const title = el.getAttribute('data-title') || el.getAttribute('alt') || '';
      const desc = el.getAttribute('data-desc') || '';
      const img = el.getAttribute('src') || '';
      const video = el.getAttribute('data-video') || '';
      const logo = el.getAttribute('data-logo') || '';

      if (title && title !== 'NOME DO JOGO' && !seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        games.push({ title, desc, img, video, logo, el });
      }
    });
    return games;
  }

  let allGames = [];
  // pequeno delay para garantir que o DOM está completo
  setTimeout(() => { allGames = getAllGames(); }, 500);

  function renderResults(term) {
    if (!term) {
      dropdown.classList.remove('active');
      return;
    }

    const filtered = allGames.filter(g => g.title.toLowerCase().includes(term.toLowerCase()));

    if (filtered.length === 0) {
      dropdown.innerHTML = `<div class="search-no-results"><span>🎮</span>Nenhum jogo encontrado para "<strong>${term}</strong>"</div>`;
    } else {
      dropdown.innerHTML = filtered.slice(0, 8).map(g => `
        <div class="search-result-item" 
             data-title="${g.title}" 
             data-desc="${g.desc}" 
             data-img="${g.img}" 
             data-video="${g.video}" 
             data-logo="${g.logo}">
          <img class="search-result-img" src="${g.img}" alt="${g.title}" onerror="this.style.display='none'">
          <div class="search-result-info">
            <div class="search-result-title">${g.title}</div>
            <div class="search-result-desc">${g.desc || 'Clique para ver o trailer'}</div>
          </div>
          <span class="search-result-arrow">▶</span>
        </div>
      `).join('');
    }

    dropdown.classList.add('active');

    // Clique em cada resultado — replica a ação já existente no site
    dropdown.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', function() {
        const title = this.dataset.title;
        const desc = this.dataset.desc;
        const img = this.dataset.img;
        const video = this.dataset.video;
        const logo = this.dataset.logo;

        const bannerVideo = document.getElementById('banner-video');
        const bannerLogo = document.getElementById('banner-logo');
        const bannerDesc = document.getElementById('banner-desc');

        if (bannerVideo && video) {
          bannerVideo.src = video;
          bannerVideo.load();
          bannerVideo.play().catch(() => {});
          bannerVideo.muted = false;
          bannerVideo.volume = 0.5;
        }
        if (bannerDesc && desc) bannerDesc.textContent = desc;
        if (bannerLogo && logo) bannerLogo.src = logo;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Limpa e fecha
        searchInput.value = '';
        dropdown.classList.remove('active');
      });
    });
  }

  searchInput.addEventListener('input', function() {
    const term = this.value.trim();
    // Recoleta caso novos cards tenham sido adicionados
    if (allGames.length === 0) allGames = getAllGames();
    renderResults(term);
  });

  // Fecha clicando fora
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#search-container') && !e.target.closest('.search-wrapper')) {
      dropdown.classList.remove('active');
    }
  });

  // Não propaga o clique dentro da busca
  document.getElementById('search-container').addEventListener('click', function(e) {
    e.stopPropagation();
  });
});
