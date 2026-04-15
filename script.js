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

/* ============================================
   GAMEFLIX GAME DETAIL MODAL - JAVASCRIPT
   ============================================ */

// Screenshots por jogo (chave = data-title em lowercase)
const gdScreenshots = {
  "battlefield 6": [
    "https://cdn1.epicgames.com/offer/a14a02aa3c8143729605eaf7c93d7501/EGS_Battlefield6_BattlefieldStudios_S2_1200x1600-a88625a836120c55650c83d17a010c25",
    "https://meups.com.br/wp-content/uploads/2025/10/Battlefield-6-REVIEW-PS5-scaled.jpg",
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1771886278/Captura_de_tela_2026-02-23_185713_cljm2d.png"
  ],
  "resident evil 3": [
    "https://howlongtobeat.com/games/72822_Resident_Evil_3_(2020).jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/952060/capsule_616x353.jpg",
    "https://www.residentevil.com/re3/assets/images/common/re3_og_img.jpg"
  ],
  "resident evil 3 (2020)": [
    "https://howlongtobeat.com/games/72822_Resident_Evil_3_(2020).jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/952060/capsule_616x353.jpg",
    "https://www.residentevil.com/re3/assets/images/common/re3_og_img.jpg"
  ],
  "far cry 3": [
    "https://upload.wikimedia.org/wikipedia/pt/5/59/Far_cry_3_box_art.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220240/capsule_616x353.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/ss_d56a5e7c71eb7d81be9c12aa53f08c40c06ba3cf.jpg"
  ],
  "far cry 3": [
    "https://upload.wikimedia.org/wikipedia/pt/5/59/Far_cry_3_box_art.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220240/capsule_616x353.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/ss_d56a5e7c71eb7d81be9c12aa53f08c40c06ba3cf.jpg"
  ],
  "far cry 3": [
    "https://upload.wikimedia.org/wikipedia/pt/5/59/Far_cry_3_box_art.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220240/capsule_616x353.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/ss_d56a5e7c71eb7d81be9c12aa53f08c40c06ba3cf.jpg"
  ],
  "farcry primal": [
    "https://upload.wikimedia.org/wikipedia/pt/b/be/Farcry_primal_box.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/371660/capsule_616x353.jpg",
    "https://images.squarespace-cdn.com/content/v1/58bedb0ab3db2bd0463e552b/1488928090199-81WOQR4N03UFM3MBW3OQ/BLOG_FARCRY_1280X788_001A.jpg"
  ],
  "far cry primal": [
    "https://upload.wikimedia.org/wikipedia/pt/b/be/Farcry_primal_box.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/371660/capsule_616x353.jpg",
    "https://images.squarespace-cdn.com/content/v1/58bedb0ab3db2bd0463e552b/1488928090199-81WOQR4N03UFM3MBW3OQ/BLOG_FARCRY_1280X788_001A.jpg"
  ],
  "batman arkham": [
    "https://wallpapers.com/images/featured/imagens-do-batman-arkham-asylum-22kjoifinq2vbfqv.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/35140/capsule_616x353.jpg",
    "https://img.elo7.com.br/product/zoom/3A58354/poster-adesivo-decorativo-batman-arkham-origins-b-42-5x60cm-adesivo.jpg"
  ],
  "batman: arkham knight": [
    "https://img.elo7.com.br/product/685x685/3A5833F/poster-adesivo-decorativo-batman-arkham-knight-a-42-5x60cm-enfeite.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/208650/capsule_616x353.jpg",
    "https://wallpapers.com/images/featured/imagens-do-batman-arkham-asylum-22kjoifinq2vbfqv.jpg"
  ],
  "batman: arkham origins": [
    "https://img.elo7.com.br/product/zoom/3A58354/poster-adesivo-decorativo-batman-arkham-origins-b-42-5x60cm-adesivo.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/209000/capsule_616x353.jpg",
    "https://wallpapers.com/images/featured/imagens-do-batman-arkham-asylum-22kjoifinq2vbfqv.jpg"
  ],
  "grand theft auto v": [
    "https://upload.wikimedia.org/wikipedia/pt/8/80/Grand_Theft_Auto_V_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/capsule_616x353.jpg",
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1775395124/pngimg.com_-_gta_PNG13_s7ewdi.png"
  ],
  "forza motorsport": [
    "https://cms-assets.xboxservices.com/assets/b3/1b/b31bda8d-5ff9-48a8-a57b-2ea6287f4fef.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1781650/capsule_616x353.jpg",
    "https://m.media-amazon.com/images/M/MV5BNDk2NmRkOTQtYWM5Zi00MTBjLWEwZjktM2FmY2U5YWNkZGM0XkEyXkFqcGc@._V1_.jpg"
  ],
  "crash bandicoot™": [
    "https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000002090/ecfc64f339579b17ed8d12d5bdb4acd0cad2811cb2ff7dd0a02ce7e512c2d26a",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/731490/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/fr/7/75/Crash_Bandicoot_N_Sane_Trilogy_Logo.png"
  ],
  "crash bandicoot n. sane trilogy": [
    "https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000002090/ecfc64f339579b17ed8d12d5bdb4acd0cad2811cb2ff7dd0a02ce7e512c2d26a",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/731490/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/fr/7/75/Crash_Bandicoot_N_Sane_Trilogy_Logo.png"
  ],
  "resident evil requiem": [
    "https://cdn.loaded.com/496x700/media/catalog/product/r/e/resident_evil_requiem_cdkeys_1.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/952060/capsule_616x353.jpg",
    "https://www.residentevil.com/re3/assets/images/common/re3_og_img.jpg"
  ],
  "resident evil 9: requiem": [
    "https://cdn.loaded.com/496x700/media/catalog/product/r/e/resident_evil_requiem_cdkeys_1.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/952060/capsule_616x353.jpg",
    "https://www.residentevil.com/re3/assets/images/common/re3_og_img.jpg"
  ],
  "red dead redemption 2": [
    "https://upload.wikimedia.org/wikipedia/pt/e/e7/Red_Dead_Redemption_2.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Red_Dead_Redemption_2_Logo.png/1280px-Red_Dead_Redemption_2_Logo.png"
  ],
  "fifa 26": [
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1771886278/Captura_de_tela_2026-02-23_185713_cljm2d.png",
    "https://fifauteam.com/images/fc26/logo/long-green.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/capsule_616x353.jpg"
  ],
  "ea sports fc 26": [
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1771886278/Captura_de_tela_2026-02-23_185713_cljm2d.png",
    "https://fifauteam.com/images/fc26/logo/long-green.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/capsule_616x353.jpg"
  ],
  "god of war ragnarok": [
    "https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-store-art-01-10sep21$ru?$800px--t$",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/capsule_616x353.jpg",
    "https://static.posters.cz/image/750/116582.jpg"
  ],
  "god of war ragnarök": [
    "https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-store-art-01-10sep21$ru?$800px--t$",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/capsule_616x353.jpg",
    "https://static.posters.cz/image/750/116582.jpg"
  ],
  "god of war (2018)": [
    "https://static.posters.cz/image/750/116582.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/capsule_616x353.jpg",
    "https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-store-art-01-10sep21$ru?$800px--t$"
  ],
  "cyberpunk 2077": [
    "https://www.productsleutels.nl/wp-content/uploads/2021/01/Cyberpunk-2077-PC-COVER.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/3840px-Cyberpunk_2077_logo.svg.png"
  ],
  "the last of us ii": [
    "https://m.media-amazon.com/images/M/MV5BODIwYWZmYWMtYTliNC00YWQ5LTg5ZmEtNTZhNmUxNjdiMzNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2531310/capsule_616x353.jpg",
    "https://cdn1.epicgames.com/offer/7713e3fa4b234e0d8f553044205d53b6/EGS_TheLastofUsPartIIRemastered_NaughtyDogLLCNixxesSoftwareIronGalaxy_S2_1200x1600-2e13755a6b3fec2ee9dbcc231a1cf39c"
  ],
  "the last of us part ii": [
    "https://m.media-amazon.com/images/M/MV5BODIwYWZmYWMtYTliNC00YWQ5LTg5ZmEtNTZhNmUxNjdiMzNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "https://cdn1.epicgames.com/offer/7713e3fa4b234e0d8f553044205d53b6/EGS_TheLastofUsPartIIRemastered_NaughtyDogLLCNixxesSoftwareIronGalaxy_S2_1200x1600-2e13755a6b3fec2ee9dbcc231a1cf39c",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2531310/capsule_616x353.jpg"
  ],
  "the last of us part i": [
    "https://cdn1.epicgames.com/offer/0c40923dd1174a768f732a3b013dcff2/EGS_TheLastofUsPartIDigitalDeluxeEdition_NaughtyDogLLC_Editions_S2_1200x1600-6db4887c7913c5a43ae3a086de2ad29c",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888930/capsule_616x353.jpg",
    "https://m.media-amazon.com/images/M/MV5BODIwYWZmYWMtYTliNC00YWQ5LTg5ZmEtNTZhNmUxNjdiMzNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  ],
  "black ops 6": [
    "https://bdjogos.com.br/capas/24175-call-of-duty-black-ops-6-capa-1.webp",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2933620/capsule_616x353.jpg",
    "https://pbs.twimg.com/media/GORUbGjWIAEDNY6.png"
  ],
  "spider-man 2": [
    "https://cdn1.epicgames.com/offer/b2818b59c0bb420e9647983dfd254931/EGS_MarvelsSpiderManDigitalDeluxeEdition_InsomniacGamesNixxesSoftware_Editions_S2_1200x1600-148e0014e79aa7c2cb23ae2414b11a16",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2329090/capsule_616x353.jpg",
    "https://image.api.playstation.com/vulcan/ap/rnd/202306/1301/0a5face6e59f61c2ed7f9423c778b10f2e4b8cada54d164f.png"
  ],
  "marvel's spider-man 2": [
    "https://image.api.playstation.com/vulcan/ap/rnd/202306/1301/0a5face6e59f61c2ed7f9423c778b10f2e4b8cada54d164f.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2329090/capsule_616x353.jpg",
    "https://cdn1.epicgames.com/offer/b2818b59c0bb420e9647983dfd254931/EGS_MarvelsSpiderManDigitalDeluxeEdition_InsomniacGamesNixxesSoftware_Editions_S2_1200x1600-148e0014e79aa7c2cb23ae2414b11a16"
  ],
  "the whitcher 3": [
    "https://bdjogos.com.br/capas/6265-the-witcher-3-wild-hunt-capa-1.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg",
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1775455305/pngimg.com_-_witcher_PNG48_whepoi.png"
  ],
  "the witcher 3: wild hunt": [
    "https://bdjogos.com.br/capas/6265-the-witcher-3-wild-hunt-capa-1.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg",
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1775455305/pngimg.com_-_witcher_PNG48_whepoi.png"
  ],
  "elden ring": [
    "https://www.fonomag.com.br/image/cache/data/eftr/Img_ftr_rp_427901-1160x1160.JPG?version=20250102153827",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
    "https://assets.xboxservices.com/assets/7b/54/7b54f5e4-0857-4ce3-8a18-2b8c431e8a9e.jpg"
  ],
  "ghost of tsushima": [
    "https://cdn1.epicgames.com/offer/6e6aa039c73347b885803de65ac5d3db/EGS_GhostofTsushima_SuckerPunchProductions_S2_1200x1600-e23e02c1d70be7b528dba50860f87d39",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/pt/d/d0/Horizon_Zero_Dawn_capa.png"
  ],
  "horizon forbidden west": [
    "https://assets-prd.ignimgs.com/2022/05/27/9781506732022-1653620982308.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2420110/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/pt/d/d0/Horizon_Zero_Dawn_capa.png"
  ],
  "resident evil village": [
    "https://tm.ibxk.com.br/2021/05/05/05040759331000.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1196590/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Resident_Evil_Village.png"
  ],
  "resident evil 4 remake": [
    "https://upload.wikimedia.org/wikipedia/pt/3/30/Resident_Evil_4_%28remake%29.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/capsule_616x353.jpg",
    "https://i.psnprofiles.com/guides/16426/c91425.png"
  ],
  "resident evil 7: biohazard": [
    "https://static.wikia.nocookie.net/game-pedia/images/5/59/ResidentEvil7_Biohazard.jpeg/revision/latest?cb=20230110134349&path-prefix=de",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/418370/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Resident_Evil_Village.png"
  ],
  "resident evil 5": [
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0cd47e73-13d0-4574-99e7-6989ec6ac3fc/dg675d8-f9cebeeb-76b9-4bf3-9ffc-5e05db5c9db6.png/v1/fill/w_1280,h_1815,q_80,strp/resident_evil_5__2009____poster_by_thepatchedvest_dg675d8-fullview.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/21690/capsule_616x353.jpg",
    "https://howlongtobeat.com/games/72822_Resident_Evil_3_(2020).jpg"
  ],
  "resident evil 6": [
    "https://cdn.mobygames.com/covers/2299574-resident-evil-6-xbox-one-front-cover.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/221040/capsule_616x353.jpg",
    "https://howlongtobeat.com/games/72822_Resident_Evil_3_(2020).jpg"
  ],
  "resident evil 2 (2019)": [
    "https://m.media-amazon.com/images/I/71D76nsyDOL._AC_UF1000,1000_QL80_.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/883710/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/fr/3/3e/Logo_Resident_Evil_2_%282019%29.png"
  ],
  "mortal kombat 1": [
    "https://m.media-amazon.com/images/I/71kj4+Y5bHL._AC_UF1000,1000_QL80_.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/pt/d/dc/Capa_de_Forza_Horizon_5.jpg"
  ],
  "mortal kombat 11": [
    "https://pixelstore.cl/cdn/shop/files/Disenosintitulo_25.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/976310/capsule_616x353.jpg",
    "https://m.media-amazon.com/images/I/71kj4+Y5bHL._AC_UF1000,1000_QL80_.jpg"
  ],
  "mortal kombat x": [
    "https://images.gog.com/3272c0976e5651c0629daf5eab1ac4b2c49d7154b0a316886a1c7fa8b26af702_glx_vertical_cover.webp?namespace=gamesdb",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/307780/capsule_616x353.jpg",
    "https://pixelstore.cl/cdn/shop/files/Disenosintitulo_25.png"
  ],
  "tekken 8": [
    "https://cdn.europosters.eu/image/1300/230759.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/capsule_616x353.jpg",
    "https://image.api.playstation.com/cdn/UP0700/CUSA05972_00/4yfeeKKfJdD5WzDQsoiM3xrcqPlpDLm7.png"
  ],
  "tekken 7": [
    "https://image.api.playstation.com/cdn/UP0700/CUSA05972_00/4yfeeKKfJdD5WzDQsoiM3xrcqPlpDLm7.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/389730/capsule_616x353.jpg",
    "https://cdn.europosters.eu/image/1300/230759.jpg"
  ],
  "dragon ball z: kakarot": [
    "https://http://cdn.awsli.com.br/2500x2500/22/22652/produto/295227042/dragon-ball-z-kakarot-legendary-edition-cover-vxuco0ery4.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/851850/capsule_616x353.jpg",
    "https://us-east-1-bandai.graphassets.com/AXzioIclSWilEjFtsMJPwz/ykzF6UdISOaowX5LniPz"
  ],
  "injustice 2": [
    "https://static.wikia.nocookie.net/dublagempedia/images/8/85/Packshot-4f17aa8af0f3631bd8367b226c0fd263.jpg/revision/latest?cb=20191024001337&path-prefix=pt-br",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/627690/capsule_616x353.jpg",
    "https://www.pngplay.com/wp-content/uploads/11/Injustice-2-Logo-Transparent-File.png"
  ],
  "days gone": [
    "https://res.cloudinary.com/dlt1gqwnc/image/upload/v1775710602/days-gone-remastered-2025--30418_ubwfjm.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1259420/capsule_616x353.jpg",
    "https://media.gamestop.com/i/gamestop/days-gone-logo/days-gone.png"
  ],
  "black myth: wukong": [
    "https://hobbygames.ru/image/enaza/19184698/box2.jpg.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/capsule_616x353.jpg",
    "https://www.pngall.com/wp-content/uploads/15/Black-Myth-Wukong-Logo-Chinese-Game-PNG.png"
  ],
  "hogwarts legacy": [
    "https://www.europanet.com.br/upload/id_produto/60_____/6000201g.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/capsule_616x353.jpg",
    "https://cdn-hogwartslegacy.warnerbrosgames.com/home/hero-logo.png"
  ],
  "gta san andreas": [
    "https://upload.wikimedia.org/wikipedia/pt/d/d3/Grand_Theft_Auto_San_Andreas_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/12120/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Grand_Theft_Auto_San_Andreas_logo.svg/500px-Grand_Theft_Auto_San_Andreas_logo.svg.png"
  ],
  "forza horizon 5 ": [
    "https://upload.wikimedia.org/wikipedia/pt/d/dc/Capa_de_Forza_Horizon_5.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg",
    "https://azitech.com.br/wp-content/uploads/2024/08/Forza-Horizon-6-lancamento.jpg"
  ],
  "forza horizon 6": [
    "https://azitech.com.br/wp-content/uploads/2024/08/Forza-Horizon-6-lancamento.jpg",
    "https://upload.wikimedia.org/wikipedia/pt/d/dc/Capa_de_Forza_Horizon_5.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg"
  ],
  "gran turismo 7": [
    "https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/3mjMyRiJaq8lw1EFWiTCUJRV.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1281260/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo_thumb/22d8c2229625f3fbfc8626b376b65deb.png"
  ],
  "assassin's creed valhalla": [
    "https://upload.wikimedia.org/wikipedia/pt/e/e9/Assassins_Creed_Valhalla_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2208920/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo_thumb/7a963088b715398a4438ad53935af1cb.png"
  ],
  "assassin's creed odyssey": [
    "https://upload.wikimedia.org/wikipedia/pt/8/84/Assassins_Creed_Odyssey_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/812140/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/f4693942620b18fb077b314ab3b8f369.png"
  ],
  "assassin's creed origins": [
    "https://cdn1.epicgames.com/offer/camellia/ACOrigins_STD_Store_Portrait_1200x1600_1200x1600-4a79f9f393f7a3a9e5be3a0ae581f3d5",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582160/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/20d71db174155578799901e0af9b24c7.png"
  ],
  "assassin's creed iv: black flag": [
    "https://upload.wikimedia.org/wikipedia/pt/c/ca/Assassins_Creed_4_Black_Flag_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo_thumb/3e3c7e0018567873b322c3c00e51deda.png"
  ],
  "tomb raider (2013)": [
    "https://universocroft.com.br/wp-content/uploads/2023/06/tr_2013_packshot-725x1024-1.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/203160/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9f/Tomb_Raider_%282013_video_game%29_%E2%80%93_Game%E2%80%99s_logo.svg"
  ],
  "metal gear solid v: the phantom pain": [
    "https://cdn.europosters.eu/image/750/26603.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/287700/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/0e189c35adab992d274c294586143ec9.png"
  ],
  "hitman": [
    "https://upload.wikimedia.org/wikipedia/pt/1/1e/Hitman_2016_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/236870/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo_thumb/53092cbc9ebb151dc54c48c07788e0de.png"
  ],
  "left 4 dead 2": [
    "https://wallpapers.com/images/hd/left-4-dead-2-zombie-hand-t5rhv5o4w42ii7pg.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/capsule_616x353.jpg",
    "https://developer.valvesoftware.com/w/images/thumb/9/95/Logo-Left_4_Dead_2.png/420px-Logo-Left_4_Dead_2.png"
  ],
  "dying light 2: stay human": [
    "https://cdn1.epicgames.com/offer/87b7846d2eba4bc49eead0854323aba8/EGS_DyingLight2StayHumanReloadedEdition_Techland_S2_1200x1600-76cef594ff94fbac64a8af1ebe4c7590",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/534380/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/d773061e2a645bc7db7508d45aec693d.png"
  ],
  "spider-man: miles morales": [
    "https://upload.wikimedia.org/wikipedia/pt/7/74/Spider-Man_Miles_Morales_capa.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1817070/capsule_616x353.jpg",
    "https://image.api.playstation.com/vulcan/ap/rnd/202306/1301/0a5face6e59f61c2ed7f9423c778b10f2e4b8cada54d164f.png"
  ],
  "spider-man remastered": [
    "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/BtsjAgHT9pqHRXtN9FCk7xc8.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1817070/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo_thumb/3fd6083ec914187fb775df5103ffb95d.png"
  ],
  "assetto corsa": [
    "https://e.snmc.io/lk/f/x/2f5dbf23974d6391c11c7b5b2fce6bb0/9667231",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/244210/capsule_616x353.jpg",
    "https://upload.wikimedia.org/wikipedia/fi/a/a0/Assetto_Corsa_Logo.png"
  ],
  "plants vs. zombies": [
    "https://img.elo7.com.br/product/685x685/2797F06/capa-pirulito-plants-vs-zombies-capa-para-pirulito.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3590/capsule_616x353.jpg",
    "https://static.wikia.nocookie.net/logopedia/images/0/01/Pvz_logo_stacked_rgb.png/revision/latest?cb=20120408101754"
  ],
  "the sims 2": [
    "https://images.g2a.com/360x600/1x1x1/the-sims-2-legacy-collection-p10000509694/f0cedf020a3f4f29af84c3cb",
    "https://upload.wikimedia.org/wikipedia/commons/c/c2/The_Sims_2_logo_%282024%29.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3590/capsule_616x353.jpg"
  ],
  "dark souls iii": [
    "https://image.api.playstation.com/cdn/HP0700/CUSA03434_00/9Lvijwqww6gvFTsciIzMWqs61DlOg8xIAsomficGKF6g7z6bYgrYGAoG80gr87pw.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/374320/capsule_616x353.jpg",
    "https://media.gamestop.com/i/gamestop/dark-souls-3-logo/dark-souls-3.png"
  ],
  "dark souls remastered": [
    "https://sm.ign.com/ign_pt/gallery/d/dark-souls/dark-souls-remastered-box-art_pr4m.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570940/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/7d1cbc0cb9bc3fa1ee6fa52d5e21808c.png"
  ],
  "watch dogs 2": [
    "https://cdn1.epicgames.com/offer/angelonia/WDA_StorePortrait_1200x1600_1200x1600-75d21fb44d647ad69967ae1bb0ab0cbc",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/447040/capsule_616x353.jpg",
    "https://www.nicepng.com/png/full/813-8135353_watch-dogs-multiple-save-slots-watch-dogs-2.png"
  ],
  "mad max": [
    "https://bdjogos.com.br/capas/5689-mad-max-capa-1.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/234140/capsule_616x353.jpg",
    "https://pluspng.com/img-png/mad-max-png-madmax-icon-png-1129.png"
  ],
  "ufc 5": [
    "https://meups.com.br/wp-content/uploads/2023/09/Israel-Mobolaji-Temitayo-Odunayo-Oluwafemi-Owolabi-Adesanya-UFC.jpeg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2287520/capsule_616x353.jpg",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5fbef0ad-821e-42ff-bd50-c54a0742abc7/dg8bpww-e5ed7e7f-ef58-4a02-923e-a2dbce86ab7b.png"
  ],
  "escape the backrooms": [
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2835530/54a47a9c7f91ae79f5c131d75df9d0e2feb9133e/capsule_616x353.jpg?t=1771657999",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1800567/capsule_616x353.jpg",
    "https://backroomsextractions.com/images/logo.png"
  ],
  "dead island 2": [
    "https://image.api.playstation.com/vulcan/ap/rnd/202208/1118/eqqPM2rRA1KnVNQuNkh4BhFn.png",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1310100/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/316134129f3d51513c1f9c5d8b2d7ee8.png"
  ],
  "tom clancy's ghost recon wildlands": [
    "https://cdn1.epicgames.com/offer/hyacinth/GRW_StorePortrait_1200x1600_1200x1600-78b13dd96e208170ca3ed32b3034fcc2",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/460930/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo/a3a8381281635a1926bd3ea09f29f4d9.png"
  ],
  "need for speed heat": [
    "https://cdnb.artstation.com/p/assets/images/images/019/956/143/large/mighoet-sundback-nfs-heat-cover.jpg",
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222680/capsule_616x353.jpg",
    "https://cdn2.steamgriddb.com/logo_thumb/946c375daff5856fbf406371179bb997.png"
  ]
};

/**
 * Abre o modal com os dados do jogo (VERSÃO ATUALIZADA)
 */
function openGameDetail(title, desc, logo, cover, drive) {
  var modal    = document.getElementById('gameDetailModal');
  var heroImg  = document.getElementById('gdHeroImg');
  var logoImg  = document.getElementById('gdLogoImg');
  var titleEl  = document.getElementById('gdTitle');
  var descEl   = document.getElementById('gdDesc');
  var carousel = document.getElementById('gdCarousel');
  var actionBtn= document.getElementById('gdActionBtn');

  // Busca o card que foi clicado para pegar os novos dados (Galeria, Banner Horizontal, etc)
  var activeCard = document.querySelector(`.game-card[data-title="${title}"]`);
  
  // Puxa os novos campos se eles existirem, senão usa o padrão
  var fullDescription = activeCard?.getAttribute('data-full-desc') || desc;
  var popupBanner = activeCard?.getAttribute('data-popup-banner') || cover || logo;
  var galleryData = activeCard?.getAttribute('data-gallery') || "";

  titleEl.textContent = title || '';
  descEl.textContent  = fullDescription || '';

  // Usa a imagem horizontal (popup-banner) no destaque do modal
  heroImg.src = popupBanner;
  heroImg.alt = title || '';

  if (logo) {
    logoImg.src = logo;
    logoImg.style.display = 'block';
  } else {
    logoImg.style.display = 'none';
  }

  // Monta carrossel dinâmico da Galeria
  carousel.innerHTML = '';
  
  if (galleryData) {
    // Se você definiu data-gallery="foto1.jpg, foto2.jpg" no HTML
    var images = galleryData.split(',');
    images.forEach(function(src) {
      var img = document.createElement('img');
      img.src = src.trim();
      img.alt = title + ' screenshot';
      carousel.appendChild(img);
    });
  } else {
    // Caso não tenha galeria no HTML, usa o comportamento antigo (fotos padrão)
    var key = (title || '').toLowerCase().trim();
    var shots = (typeof gdScreenshots !== 'undefined' && gdScreenshots[key]) || [cover, logo].filter(Boolean);
    shots.forEach(function(src) {
      if (!src) return;
      var img = document.createElement('img');
      img.src = src;
      img.alt = title + ' screenshot';
      carousel.appendChild(img);
    });
  }

  // Botão de ação (Download ou Comprar)
  if (drive && drive.indexOf('javascript') === -1 && drive.length > 5) {
    actionBtn.href   = drive;
    actionBtn.target = '_blank';
    actionBtn.textContent = '⬇ DOWNLOAD GRATUITO';
  } else {
    actionBtn.href   = 'https://gameflix2.github.io/ESCOLHA-SEU-PACK/';
    actionBtn.target = '_blank';
    actionBtn.textContent = '▶ QUERO JOGAR AGORA';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Abre o modal lendo o estado atual do banner
 */
function openGameDetailFromBanner(e) {
  if (e) e.preventDefault();

  var bannerLogoEl = document.getElementById('banner-logo');
  var bannerDescEl = document.getElementById('banner-desc');
  var bannerLink   = document.getElementById('banner-link');

  var drive = '';
  if (bannerLink && bannerLink.href && bannerLink.href.indexOf('javascript') === -1 && bannerLink.href.indexOf('#') === -1) {
    drive = bannerLink.href;
  }

  var logo  = bannerLogoEl ? bannerLogoEl.src  : '';
  var desc  = bannerDescEl ? bannerDescEl.textContent : '';
  var title = bannerLogoEl ? (bannerLogoEl.getAttribute('data-title') || bannerLogoEl.alt || '') : '';
  var cover = window._gdLastCover || logo;

  openGameDetail(title || 'GAMEFLIX', desc, logo, cover, drive);
}

/** Fecha o modal */
function closeGameDetail() {
  document.getElementById('gameDetailModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Fechar clicando fora
document.getElementById('gameDetailModal').addEventListener('click', function(e) {
  if (e.target === this) closeGameDetail();
});

// ESC fecha
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeGameDetail();
});

// Guarda a última capa clicada como hero do banner
document.addEventListener('click', function(e) {
  var card = e.target.closest('.game-card, .poster-img, .card-container');
  if (card) {
    var img = card.tagName === 'IMG' ? card : card.querySelector('img');
    if (img && img.src) window._gdLastCover = img.src;
    // Guarda também o data-title no banner-logo para o popup identificar o jogo
    if (img && img.getAttribute('data-title')) {
      var bannerLogo = document.getElementById('banner-logo');
      if (bannerLogo) bannerLogo.setAttribute('data-title', img.getAttribute('data-title'));
    }
  }
}, true);
