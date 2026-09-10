import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Apagar a conta: remove da nuvem TUDO da pessoa — comprovantes, registros e
// o próprio login. É a única operação de apagar do sistema, e é a exigência
// da LGPD (direito de eliminação) e da Google Play (app com login precisa
// oferecer apagar conta dentro do app e por um link na web: /apagar-conta).
//
// Só roda no servidor, com a chave de serviço do Supabase (SUPABASE_SERVICE_ROLE_KEY),
// que passa por cima da RLS — por isso ela NUNCA vai para o navegador e NUNCA
// entra no código: fica só nas variáveis de ambiente do Vercel.
//
// Quem pede tem que provar que é a dona: manda o token da própria sessão.

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chaveServico = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chaveServico) {
    return NextResponse.json({ erro: "nao_configurado" }, { status: 503 });
  }

  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return NextResponse.json({ erro: "sem_token" }, { status: 401 });

  let corpo: { confirmacao?: string } = {};
  try {
    corpo = (await req.json()) as { confirmacao?: string };
  } catch {
    // sem corpo: cai na checagem abaixo
  }
  if (corpo.confirmacao !== "APAGAR") return NextResponse.json({ erro: "sem_confirmacao" }, { status: 400 });

  const admin = createClient(url, chaveServico, { auth: { persistSession: false, autoRefreshToken: false } });

  // 1. Quem é? O token só vale se for de uma sessão viva desta pessoa.
  const { data: quem, error: erroQuem } = await admin.auth.getUser(token);
  const uid = quem?.user?.id;
  if (erroQuem || !uid) return NextResponse.json({ erro: "sessao_invalida" }, { status: 401 });

  // 2. Comprovantes (pasta <uid>/ no bucket privado), em páginas de 1000.
  let arquivos = 0;
  for (;;) {
    const { data: lista, error } = await admin.storage.from("comprovantes").list(uid, { limit: 1000 });
    if (error) return NextResponse.json({ erro: "storage_list", detalhe: error.message }, { status: 500 });
    if (!lista || lista.length === 0) break;
    const caminhos = lista.map((o) => `${uid}/${o.name}`);
    const { error: erroRemover } = await admin.storage.from("comprovantes").remove(caminhos);
    if (erroRemover) return NextResponse.json({ erro: "storage_remove", detalhe: erroRemover.message }, { status: 500 });
    arquivos += caminhos.length;
    if (lista.length < 1000) break;
  }

  // 3. Registros (despesas, pagamentos, combinado, filhos).
  const { count, error: erroRegistros } = await admin.from("registros").delete({ count: "exact" }).eq("dono", uid);
  if (erroRegistros) return NextResponse.json({ erro: "registros", detalhe: erroRegistros.message }, { status: 500 });

  // 4. O login. Depois disso o token deixa de valer em todos os aparelhos.
  const { error: erroUsuario } = await admin.auth.admin.deleteUser(uid);
  if (erroUsuario) return NextResponse.json({ erro: "usuario", detalhe: erroUsuario.message }, { status: 500 });

  return NextResponse.json({ ok: true, registros: count ?? 0, arquivos });
}
