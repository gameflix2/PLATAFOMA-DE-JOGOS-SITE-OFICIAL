/* ============================================================
   GAMEFLIX — TRACKING.JS
   Rastreia apenas:
     1. Downloads de jogos grátis
     2. Jogos adicionados aos favoritos
   Preparado para Supabase + automação via WhatsApp.
   ============================================================ */

/* ── HELPER: PEGAR EMAIL DO USUÁRIO LOGADO ────────────────── */
function getUsuarioLogado() {
  try {
    var raw = localStorage.getItem('gameflix_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/* ============================================================
   1. DOWNLOAD DE JOGO GRÁTIS
   ============================================================ */

/**
 * Chame esta função quando o usuário clicar para baixar um jogo grátis.
 *
 * Exemplo de uso no seu HTML ou script.js:
 *   registrar_download_gratis('Battlefield 6');
 *
 * @param {string} nomeJogo - Nome do jogo baixado
 */
function registrar_download_gratis(nomeJogo) {
  var usuario = getUsuarioLogado();
  if (!usuario) {
    console.warn('[Tracking] Usuário não autenticado — evento ignorado.');
    return;
  }

  var evento = {
    tipo:       'download_gratis',
    jogo:       nomeJogo,
    email:      usuario.email,
    timestamp:  new Date().toISOString()
  };

  console.info('[Tracking] Download grátis registrado:', evento);

  // ── Envia ao Supabase (quando configurado)
  if (typeof supabaseRegistrarEvento === 'function') {
    supabaseRegistrarEvento(usuario.email, 'download_gratis', nomeJogo);
  }

  // ── Dispara automação WhatsApp (quando configurada)
  sendWhatsappEvent('download_gratis', usuario, nomeJogo);
}

/* ============================================================
   2. JOGO ADICIONADO AOS FAVORITOS
   ============================================================ */

/**
 * Chame esta função quando o usuário adicionar um jogo à lista.
 *
 * Exemplo de uso:
 *   registrar_favorito('Red Dead Redemption 2');
 *
 * @param {string} nomeJogo - Nome do jogo favoritado
 */
function registrar_favorito(nomeJogo) {
  var usuario = getUsuarioLogado();
  if (!usuario) {
    console.warn('[Tracking] Usuário não autenticado — evento ignorado.');
    return;
  }

  var evento = {
    tipo:      'favorito',
    jogo:      nomeJogo,
    email:     usuario.email,
    timestamp: new Date().toISOString()
  };

  console.info('[Tracking] Favorito registrado:', evento);

  // ── Envia ao Supabase (quando configurado)
  if (typeof supabaseRegistrarEvento === 'function') {
    supabaseRegistrarEvento(usuario.email, 'favorito', nomeJogo);
  }

  // Nota: WhatsApp NÃO é disparado para favoritos, apenas para downloads.
}

/* ============================================================
   3. AUTOMAÇÃO WHATSAPP (PREPARADA — NÃO FUNCIONAL AINDA)
   ============================================================ */

/**
 * sendWhatsappEvent()
 * Envia mensagem automática ao WhatsApp do usuário após um evento.
 *
 * ── COMO INTEGRAR NO FUTURO ──────────────────────────────────
 *
 * OPÇÃO A — Twilio WhatsApp API:
 *   Endpoint: https://api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json
 *   Token:    Basic Auth com ACCOUNT_SID:AUTH_TOKEN
 *   Docs:     https://www.twilio.com/docs/whatsapp/api
 *
 * OPÇÃO B — Evolution API (self-hosted):
 *   Endpoint: https://sua-evolution-api.com/message/sendText/INSTANCE
 *   Header:   { apikey: 'SUA_KEY' }
 *   Docs:     https://doc.evolution-api.com
 *
 * OPÇÃO C — WhatsApp Business API (Meta oficial):
 *   Endpoint: https://graph.facebook.com/v19.0/PHONE_NUMBER_ID/messages
 *   Header:   { Authorization: 'Bearer TOKEN_META' }
 *   Docs:     https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * ── ONDE INSERIR CREDENCIAIS ─────────────────────────────────
 *   Linha marcada com: // [INSIRA_TOKEN_AQUI]
 *
 * @param {string} tipoEvento - 'download_gratis' | 'favorito'
 * @param {object} usuario    - { primeiro_nome, whatsapp, email }
 * @param {string} nomeJogo   - Nome do jogo relacionado ao evento
 */
function sendWhatsappEvent(tipoEvento, usuario, nomeJogo) {
  // ── Verificação de segurança
  if (!usuario || !usuario.whatsapp || !usuario.primeiro_nome) {
    console.warn('[WhatsApp] Dados insuficientes para enviar mensagem.');
    return;
  }

  // ── Monta a mensagem personalizada
  var mensagem = '';
  if (tipoEvento === 'download_gratis') {
    mensagem =
      'Olá ' + usuario.primeiro_nome + '! 🎮\n' +
      'Vimos que você começou o download de *' + nomeJogo + '*.\n' +
      'Qualquer dúvida na instalação, é só chamar! 👊\n' +
      '— Equipe Gameflix';
  }

  if (!mensagem) return; // Evento sem template definido

  // ── Log local (ativo mesmo sem integração real)
  console.info('[WhatsApp] Mensagem preparada para ' + usuario.whatsapp + ':', mensagem);

  /* ═══════════════════════════════════════════════════════════
     BLOCO DE INTEGRAÇÃO — descomente e configure uma das opções
     ═══════════════════════════════════════════════════════════

  // ── TWILIO ──────────────────────────────────────────────────
  // var TWILIO_ACCOUNT_SID = 'ACxxxxxx';  // [INSIRA_TOKEN_AQUI]
  // var TWILIO_AUTH_TOKEN  = 'xxxxxxxx';  // [INSIRA_TOKEN_AQUI]
  // var TWILIO_FROM        = 'whatsapp:+14155238886';
  //
  // fetch('https://api.twilio.com/2010-04-01/Accounts/' + TWILIO_ACCOUNT_SID + '/Messages.json', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': 'Basic ' + btoa(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN),
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: new URLSearchParams({
  //     From: TWILIO_FROM,
  //     To:   'whatsapp:+55' + usuario.whatsapp,
  //     Body: mensagem
  //   })
  // });

  // ── EVOLUTION API ────────────────────────────────────────────
  // var EVOLUTION_URL = 'https://sua-api.com';  // [INSIRA_URL_AQUI]
  // var EVOLUTION_KEY = 'SUA_KEY';              // [INSIRA_TOKEN_AQUI]
  // var INSTANCE_NAME = 'gameflix';
  //
  // fetch(EVOLUTION_URL + '/message/sendText/' + INSTANCE_NAME, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_KEY },
  //   body: JSON.stringify({ number: '55' + usuario.whatsapp, text: mensagem })
  // });

     ═══════════════════════════════════════════════════════════ */
}

/* ── HOOK NO BOTÃO "+ Minha Lista" EXISTENTE ─────────────── */
/*
  O botão ".btn-info" já existe no index.html com texto "+ Minha Lista".
  Este hook intercepta o clique e registra o favorito automaticamente.
*/
document.addEventListener('DOMContentLoaded', function () {
  var btnLista = document.querySelector('.btn-info');
  if (btnLista) {
    btnLista.addEventListener('click', function () {
      // Pega o título do jogo atualmente no banner
      var bannerLogo = document.getElementById('banner-logo');
      var nomeJogo = bannerLogo ? (bannerLogo.alt || 'Jogo') : 'Jogo';
      registrar_favorito(nomeJogo);
    });
  }
});
