/* ============================================================
   GAMEFLIX — AUTH.JS
   Sistema de acesso obrigatório por nome, email e WhatsApp.
   Salva sessão em localStorage para login único por dispositivo.
   Preparado para integração futura com Supabase.
   ============================================================ */

/* ── CHAVE DE ARMAZENAMENTO LOCAL ─────────────────────────── */
var GF_AUTH_KEY = 'gameflix_user';

/* ── VALIDAÇÕES ───────────────────────────────────────────── */

/**
 * Valida formato de e-mail (RFC básico).
 * Exige: texto @ texto.extensão
 */
function validarEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
}

/**
 * Valida WhatsApp brasileiro.
 * Aceita: 11 dígitos numéricos, DDD válido (11-99), nono dígito obrigatório.
 * Exemplos válidos: 11999999999 / 51987654321
 */
function validarWhatsApp(wpp) {
  var digitos = String(wpp).replace(/\D/g, '');
  if (digitos.length !== 11) return false;

  var ddd = parseInt(digitos.substring(0, 2), 10);
  // DDDs brasileiros válidos: 11 a 99
  if (ddd < 11 || ddd > 99) return false;

  // Nono dígito obrigatório
  var nono = digitos.charAt(2);
  if (nono !== '9') return false;

  return true;
}

/* ── MÁSCARA DE WHATSAPP ──────────────────────────────────── */
/**
 * Formata o campo WhatsApp conforme o usuário digita.
 * Resultado visual: (DDD) 9XXXX-XXXX
 */
function mascaraWhatsApp(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 11);
  var out = '';
  if (v.length > 0)  out = '(' + v.substring(0, 2);
  if (v.length >= 3) out += ') ' + v.substring(2, 7);
  if (v.length >= 8) out += '-' + v.substring(7, 11);
  input.value = out;
}

/* ── EXIBIR / OCULTAR ERRO ────────────────────────────────── */
function mostrarErro(inputId, msg) {
  var erroId = inputId + '-error';
  var el = document.getElementById(erroId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
  el.style.opacity = msg ? '1' : '0';
}

function limparErro(inputId) {
  mostrarErro(inputId, '');
}

/* ── SESSÃO: SALVAR / CARREGAR ────────────────────────────── */
function salvarSessao(dados) {
  dados.timestamp = new Date().toISOString();
  dados.last_login = dados.timestamp;
  try {
    localStorage.setItem(GF_AUTH_KEY, JSON.stringify(dados));
  } catch (e) {
    console.warn('[GameflixAuth] Erro ao salvar sessão:', e);
  }
}

function carregarSessao() {
  try {
    var raw = localStorage.getItem(GF_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function limparSessao() {
  localStorage.removeItem(GF_AUTH_KEY);
}

/* ── LIBERAR A PLATAFORMA (ocultar login-screen) ─────────── */
function liberarPlataforma() {
  var loginScreen = document.getElementById('login-screen');
  if (!loginScreen) return;

  // Animação suave de saída
  loginScreen.style.transition = 'opacity 0.5s ease';
  loginScreen.style.opacity = '0';
  setTimeout(function () {
    loginScreen.style.display = 'none';
    loginScreen.style.opacity = '1';
  }, 500);

  // Inicia vídeo do banner (replica comportamento original)
  var bannerVideo = document.getElementById('banner-video');
  if (bannerVideo && bannerVideo.tagName === 'VIDEO') {
    bannerVideo.muted = true;
    bannerVideo.play().catch(function () {});
  }
  if (typeof setupUnmuteButton === 'function') setupUnmuteButton();
  if (typeof showUnmuteBtn === 'function') showUnmuteBtn();

  // Atualiza last_login no Supabase (quando integrado)
  var sessao = carregarSessao();
  if (sessao && typeof supabaseAtualizarLogin === 'function') {
    supabaseAtualizarLogin(sessao.email);
  }
}

/* ── INIT: VERIFICAR SE JÁ ESTÁ AUTENTICADO ──────────────── */
function initAuth() {
  var sessao = carregarSessao();

  if (sessao && sessao.email && sessao.primeiro_nome && sessao.whatsapp) {
    // Usuário já autenticado → libera diretamente
    liberarPlataforma();
    console.log('[GameflixAuth] Sessão restaurada para:', sessao.primeiro_nome);
    return;
  }

  // Nenhuma sessão → prepara o formulário de login
  prepararFormularioLogin();
}

/* ── PREPARAR FORMULÁRIO ──────────────────────────────────── */
function prepararFormularioLogin() {
  var form = document.getElementById('login-form');
  if (!form) return;

  // Escuta máscara no campo WhatsApp
  var wppInput = document.getElementById('user-whatsapp');
  if (wppInput) {
    wppInput.addEventListener('input', function () {
      mascaraWhatsApp(this);
      limparErro('user-whatsapp');
    });
  }

  // Limpa erros ao digitar nos outros campos
  var emailInput = document.getElementById('user-email');
  var nomeInput = document.getElementById('user-nome');
  if (emailInput) emailInput.addEventListener('input', function () { limparErro('user-email'); });
  if (nomeInput) nomeInput.addEventListener('input', function () { limparErro('user-nome'); });

  // Submit do formulário
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleLoginSubmit();
  });
}

/* ── HANDLER DO SUBMIT ────────────────────────────────────── */
function handleLoginSubmit() {
  var nome  = (document.getElementById('user-nome')      || {}).value || '';
  var email = (document.getElementById('user-email')     || {}).value || '';
  var wpp   = (document.getElementById('user-whatsapp')  || {}).value || '';
  var salvar = document.getElementById('remember');

  nome  = nome.trim();
  email = email.trim();

  var valido = true;

  if (!nome || nome.length < 2) {
    mostrarErro('user-nome', 'Digite seu primeiro nome');
    valido = false;
  }

  if (!validarEmail(email)) {
    mostrarErro('user-email', 'Digite um email válido');
    valido = false;
  }

  if (!validarWhatsApp(wpp)) {
    mostrarErro('user-whatsapp', 'Digite um WhatsApp válido com DDD');
    valido = false;
  }

  if (!valido) return;

  // Dados validados
  var dadosUsuario = {
    primeiro_nome: nome,
    email: email,
    whatsapp: wpp.replace(/\D/g, '') // salva apenas dígitos
  };

  // Salva localmente (checkbox sempre marcado por padrão)
  if (!salvar || salvar.checked) {
    salvarSessao(dadosUsuario);
  }

  // Envia para o Supabase (quando integrado)
  if (typeof supabaseRegistrarUsuario === 'function') {
    supabaseRegistrarUsuario(dadosUsuario);
  }

  // Libera plataforma
  liberarPlataforma();
  console.log('[GameflixAuth] Novo acesso registrado:', dadosUsuario.primeiro_nome);
}

/* ── INICIALIZA AO CARREGAR A PÁGINA ─────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initAuth();
});
