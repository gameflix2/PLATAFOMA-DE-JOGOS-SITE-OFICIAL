/* ============================================================
   GAMEFLIX — SUPABASE.JS
   Estrutura preparada para integração futura com Supabase.
   Nenhuma chave real exposta aqui — use variáveis de ambiente
   ou preencha as constantes abaixo antes de publicar.
   ============================================================ */

/* ── CONFIGURAÇÃO (preencha antes de ativar) ──────────────── */

/*
  COMO CONFIGURAR:
  1. Acesse https://supabase.com e crie um projeto
  2. Vá em: Project Settings > API
  3. Copie a "Project URL" e cole em SUPABASE_URL
  4. Copie a "anon/public" key e cole em SUPABASE_ANON_KEY
  5. Remova os comentários das linhas abaixo
*/




// var SUPABASE_URL      = 'https://SEU-PROJETO.supabase.co';
// var SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

var SUPABASE_URL      = 'https://fhtpeacjxpcghykojgic.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodHBlYWNqeHBjZ2h5a29qZ2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3OTc4ODcsImV4cCI6MjA5NDM3Mzg4N30.s4zUoICN1agjMaiGj-d_YH92cFq-RO7kYZm0eGgpZ-o';
/**
 * Faz uma chamada REST ao Supabase.
 * @param {string} tabela  - Nome da tabela
 * @param {object} dados   - Objeto a inserir
 * @param {string} metodo  - 'POST' (insert) | 'PATCH' (update)
 * @param {string} filtro  - ex: '?email=eq.foo@bar.com' (opcional)
 */
function supabaseRequest(tabela, dados, metodo, filtro) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Supabase não configurado ainda — log silencioso
    console.info('[Supabase] Não configurado. Dados locais salvos:', dados);
    return Promise.resolve(null);
  }

  var url = SUPABASE_URL + '/rest/v1/' + tabela + (filtro || '');

  return fetch(url, {
    method: metodo || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Prefer': 'resolution=merge-duplicates' // upsert seguro
    },
    body: JSON.stringify(dados)
  })
  .then(function (res) {
    if (!res.ok) throw new Error('Supabase error: ' + res.status);
    return res.json().catch(function () { return {}; });
  })
  .catch(function (err) {
    console.warn('[Supabase] Erro na requisição:', err);
    return null;
  });
}

/* ── TABELA: users ────────────────────────────────────────── */

/*
  SQL para criar a tabela no Supabase:

  CREATE TABLE users (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    primeiro_nome TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    whatsapp   TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ DEFAULT now()
  );
*/

/**
 * Registra um novo usuário no Supabase (upsert por email).
 * Chamado automaticamente por auth.js após login válido.
 */
function supabaseRegistrarUsuario(dados) {
  var payload = {
    primeiro_nome: dados.primeiro_nome,
    email:         dados.email,
    whatsapp:      dados.whatsapp,
    created_at:    new Date().toISOString(),
    last_login:    new Date().toISOString()
  };
return supabaseRequest('clientes', payload, 'POST');
}

/**
 * Atualiza o campo last_login de um usuário existente.
 * Chamado quando usuário retorna ao site (sessão já salva).
 */
function supabaseAtualizarLogin(email) {
  var payload = { last_login: new Date().toISOString() };
  var filtro  = '?email=eq.' + encodeURIComponent(email);
return supabaseRequest('clientes', payload, 'PATCH', filtro);
}

/* ── TABELA: events ───────────────────────────────────────── */

/*
  SQL para criar a tabela no Supabase:

  CREATE TABLE events (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    event_type TEXT NOT NULL,   -- 'download_gratis' | 'favorito'
    game_name  TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
*/

/**
 * Registra um evento genérico na tabela events.
 * Usado internamente por tracking.js.
 */
function supabaseRegistrarEvento(userEmail, eventType, gameName) {
  var usuario = JSON.parse(localStorage.getItem('gameflix_user') || '{}');
  var payload = {
    user_email:    userEmail,
    event_type:    eventType,
    game_name:     gameName || null,
    primeiro_nome: usuario.primeiro_nome || null,
    whatsapp:      usuario.whatsapp || null,
    created_at:    new Date().toISOString()
  };
  retur
