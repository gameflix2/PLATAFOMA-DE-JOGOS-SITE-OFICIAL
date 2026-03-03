/* --- SCROLL INTELIGENTE DO TOP 10 --- */
const top10 = document.getElementById('top10');

function scrollLeft(){
  if(!top10) return;
  const card = top10.querySelector(".card-container");
  if(!card) return;
  top10.scrollBy({ left: -(card.offsetWidth + 45) * 2, behavior: "smooth" });
}

function scrollRight(){
  if(!top10) return;
  const card = top10.querySelector(".card-container");
  if(!card) return;
  top10.scrollBy({ left: (card.offsetWidth + 45) * 2, behavior: "smooth" });
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
  const iframe = document.getElementById("modalVideo");
  const bannerVideo = document.getElementById("banner-video");

  // PAUSA O VÍDEO DE FUNDO
  if(bannerVideo) {
    bannerVideo.pause();
    bannerVideo.muted = true; 
  }

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;

  // LÓGICA DE DETECÇÃO: YouTube ou Link Direto (Cloudinary)
  if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be") || videoSrc.length < 15) {
    // Se for um ID curto ou link do YT, usa o Iframe
    const youtubeId = videoSrc.includes("v=") ? videoSrc.split("v=")[1] : videoSrc;
    iframe.style.display = "block";
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&rel=0`;
    
    // Esconde um possível player de vídeo comum se você decidir adicionar um depois
  } else {
    // Se for link do Cloudinary (.mp4), vamos transformar o iframe em um player de vídeo
    // DICA: Para simplicidade extrema, você pode abrir o link direto no iframe, 
    // mas o ideal para o Cloudinary é que o link termine em .mp4
    iframe.style.display = "block";
    iframe.src = videoSrc; 
  }
  
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

document.querySelectorAll('.free-game-trigger').forEach(card => {
  card.addEventListener('click', function() {
    // 1. Coleta os dados novos
    const novaLogo = this.getAttribute('data-logo');
    const novaDesc = this.getAttribute('data-desc');
    const novoVideo = this.getAttribute('data-video');
    const novoLink = this.getAttribute('data-link');

    // 2. Atualiza a LOGO e a DESCRIÇÃO
    const imgLogo = document.getElementById('banner-logo');
    if (imgLogo) {
      imgLogo.src = novaLogo;
    }
    document.getElementById('banner-desc').textContent = novaDesc;
    
    // 3. Atualiza o VÍDEO
    const videoElement = document.getElementById('banner-video');
    videoElement.src = novoVideo;
    videoElement.load(); // Força o carregamento do novo vídeo
    videoElement.play();

    // 4. Atualiza o Botão de Download
    const downloadBtn = document.querySelector('.banner-content a');
    if (downloadBtn) {
      downloadBtn.href = novoLink;
    }

    // 5. Sobe para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
/* --- LÓGICA DE LOGIN --- */
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Impede a página de recarregar

  const emailInput = document.getElementById('user-email').value;
  const passwordInput = document.getElementById('user-password').value;

  // DEFINA AQUI O EMAIL E SENHA QUE VOCÊ QUER
  const emailCorreto = "testegratis@gameflix.com";
  const senhaCorreta = "l";

  if (emailInput === emailCorreto && passwordInput === senhaCorreta) {
    // Esconde a tela de login
    document.getElementById('login-screen').classList.add('hidden');
    
    // Opcional: Inicia o vídeo do banner após entrar
    const bannerVideo = document.getElementById("banner-video");
    if(bannerVideo) bannerVideo.play().catch(()=>{});
    
    alert("Bem-vindo a melhor plataforma de games do Brasil!");
  } else {
    alert("Email ou senha incorretos. Tente novamente.");
  }
});

/* --- AJUSTE EXCLUSIVO PARA O POPUP WHATSAPP (MODAL NOVO) --- */
function openWppModal() {
  const modalWpp = document.getElementById("wppModal");
  const bannerVideo = document.getElementById("banner-video");
  
  if(modalWpp) {
      modalWpp.style.display = "flex";
      document.body.style.overflow = "hidden";
  }
  if(bannerVideo) bannerVideo.pause();
}

function closeWppModal() {
  const modalWpp = document.getElementById("wppModal");
  const bannerVideo = document.getElementById("banner-video");

  if(modalWpp) {
      modalWpp.style.display = "none";
      document.body.style.overflow = "auto";
  }
  if(bannerVideo) bannerVideo.play().catch(()=>{});
}

/* FECHAR MODAIS CLICANDO FORA */
window.addEventListener('click', function(event) {
    const modalWpp = document.getElementById("wppModal");
    const modalNetflix = document.getElementById("netflixModal");
    if (event.target === modalWpp) closeWppModal();
    if (event.target === modalNetflix) closeModal();
});
