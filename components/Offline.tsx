"use client";

// Liga o service worker (public/sw.js), que deixa o app abrir sem internet.
// Montado no layout, sem interface. Se o navegador não suportar, não faz nada.

import { useEffect } from "react";

export default function Offline() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Sem service worker o app continua funcionando — só não abre offline.
    });
  }, []);
  return null;
}
