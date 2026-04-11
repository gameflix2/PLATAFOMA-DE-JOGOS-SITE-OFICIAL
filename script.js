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
// sistema de busca
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('game-search');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const termoBusca = this.value.toLowerCase().trim();
            // Pega todos os cards de jogos do site
            const gameCards = document.querySelectorAll('.game-card, .card-container');

            gameCards.forEach(card => {
                // Ele busca o nome dentro do atributo 'data-title' ou no 'alt' da imagem
                const imgElement = card.querySelector('img');
                const nomeJogo = card.getAttribute('data-title')?.toLowerCase() || 
                                 imgElement?.getAttribute('alt')?.toLowerCase() || "";

                if (nomeJogo.includes(termoBusca)) {
                    card.style.display = "block"; // Mostra se encontrar
                    card.style.opacity = "1";
                } else {
                    card.style.display = "none";  // Esconde se não encontrar
                }
            });

            // Opcional: Se a busca estiver vazia, mostra tudo de volta
            if (termoBusca === "") {
                gameCards.forEach(card => card.style.display = "block");
            }
        });
    }
});
