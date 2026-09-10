// Service worker do AlimentaProva — deixa o app abrir sem internet.
//
// Regras, de propósito simples:
//   1. Arquivos com hash do Next (/_next/static/...) e ícones nunca mudam → cache primeiro.
//   2. Páginas e o resto → rede primeiro; sem rede, a última cópia guardada; sem cópia, /offline.
//   3. Nada de fora deste endereço (Supabase, IBGE, Google) passa pelo cache.
//   4. /api/ nunca é guardado (leitura de comprovante, índices).
//
// Os dados do cofre NÃO ficam aqui: estão no IndexedDB, que funciona offline sozinho.
// Para forçar todo mundo a baixar uma versão nova do próprio service worker, mude VERSAO.

const VERSAO = "2026-09-10";
const CACHE = `alimentaprova-${VERSAO}`;
const CONCHA = ["/offline", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png", "/icon.svg", "/manifest.webmanifest"];
const LIMITE_ENTRADAS = 400;

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(CONCHA.map((url) => cache.add(url).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  const imutavel = url.pathname.startsWith("/_next/static/") || /\.(png|svg|ico|woff2?)$/.test(url.pathname);
  evento.respondWith(imutavel ? cachePrimeiro(req) : redePrimeiro(req));
});

async function cachePrimeiro(req) {
  const cache = await caches.open(CACHE);
  const guardada = await cache.match(req);
  if (guardada) return guardada;
  const resposta = await fetch(req);
  if (resposta.ok) {
    cache.put(req, resposta.clone());
    aparar(cache);
  }
  return resposta;
}

async function redePrimeiro(req) {
  const cache = await caches.open(CACHE);
  try {
    const resposta = await fetch(req);
    if (resposta.ok && resposta.type === "basic") {
      cache.put(req, resposta.clone());
      aparar(cache);
    }
    return resposta;
  } catch {
    const guardada = await cache.match(req);
    if (guardada) return guardada;
    if (req.mode === "navigate") {
      const offline = await cache.match("/offline");
      if (offline) return offline;
    }
    return new Response("Sem conexão.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

// Sem isso o cache cresceria a cada versão publicada (os arquivos do Next têm hash novo).
async function aparar(cache) {
  const chaves = await cache.keys();
  if (chaves.length <= LIMITE_ENTRADAS) return;
  const excesso = chaves.slice(0, chaves.length - LIMITE_ENTRADAS);
  await Promise.all(excesso.map((k) => cache.delete(k)));
}
