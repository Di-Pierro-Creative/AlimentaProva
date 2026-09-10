import Link from "next/link";

// Política de privacidade (LGPD). Página pública, exigida pela Google Play e
// linkada na tela Conta. Texto em português claro; cada seção diz o que o app
// faz de fato — quando o app mudar, esta página muda junto.
//
// >>> CONFIRMAR ANTES DE PUBLICAR NA LOJA: e-mail de contato e razão social. <<<

export const metadata = { title: "Privacidade — AlimentaProva" };

const ATUALIZADA_EM = "10 de setembro de 2026";
const CONTATO = "dipierrocreative@gmail.com";
const CONTROLADORA = "Di Pierro Creative (Virginia Di Pierro), São Paulo, SP";

export default function PrivacidadePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="safe-t sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-paper/95 px-4 pb-3 backdrop-blur">
        <Link href="/" className="-ml-2 rounded-lg px-2 py-2 text-sm font-medium text-ink-2 active:bg-rule/50" aria-label="Voltar">
          ← Voltar
        </Link>
        <h1 className="text-base font-semibold">Privacidade</h1>
        <span className="w-16" aria-hidden="true" />
      </header>

      <main className="flex-1 px-4 pb-16 pt-4">
        <article className="space-y-6 text-sm leading-relaxed text-ink-2 [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink [&_p]:mt-2 [&_strong]:text-ink">
          <p className="text-xs text-ink-3">Última atualização: {ATUALIZADA_EM}</p>

          <p>
            O <strong>AlimentaProva</strong> é um aplicativo para quem administra a pensão alimentícia de um filho registrar as despesas
            da criança, com comprovante, e a pensão que entra — e, quando precisar, exportar uma pasta organizada para o advogado. Esta
            página explica, em linguagem direta, quais dados o app trata, onde ficam e o que você pode fazer com eles. Ela segue a Lei
            Geral de Proteção de Dados (Lei 13.709/2018).
          </p>

          <h2>Quem é responsável</h2>
          <p>
            A controladora dos dados é <strong>{CONTROLADORA}</strong>. Para qualquer pedido ou dúvida sobre seus dados, escreva para{" "}
            <a href={`mailto:${CONTATO}`} className="font-medium text-accent underline">
              {CONTATO}
            </a>
            .
          </p>

          <h2>O que o app é — e o que não é</h2>
          <p>
            O app registra e calcula: guarda cada despesa e cada pagamento com data, valor e comprovante, soma por mês e por filho, e
            monta a pasta para exportar. Ele <strong>não dá parecer jurídico</strong> nem diz se um valor é devido ou suficiente — isso é
            do advogado. O app também não pertence a nenhum escritório: o acervo é seu e vai com você se trocar de advogado.
          </p>

          <h2>Dados que você registra</h2>
          <p>
            <strong>Despesas:</strong> valor, data, categoria, observação, a parte que cabe ao filho em despesas compartilhadas, e o
            comprovante (foto, print ou PDF). <strong>Pensão:</strong> valor recebido, data, mês de referência, forma de pagamento,
            observação (por exemplo, quem pagou) e o print do comprovante. <strong>Valor combinado:</strong> valor ou percentual do
            salário mínimo, dia de vencimento, desde quando vale e de onde vem (acordo, sentença).
          </p>
          <p>
            <strong>Perfil do filho:</strong> nome (ou apelido), data de nascimento, tamanhos de roupa e calçado, escola e observações.
            Estes dados são de uma criança e são inseridos por você, responsável legal, no interesse dela (art. 14 da LGPD). Só o nome e
            a idade entram na pasta exportada; tamanhos, escola e observações ficam com você. O app{" "}
            <strong>não pede e não deve receber dados de saúde</strong> (alergias, remédios, laudos) — o campo de observações avisa isso.
          </p>
          <p>
            Dados de outras pessoas que você anotar (por exemplo, o nome de quem fez um pagamento) servem apenas ao seu registro e são de
            sua responsabilidade.
          </p>

          <h2>Dados da conta</h2>
          <p>
            Para usar a nuvem, o app pede só o seu <strong>e-mail</strong>. Não há senha: a cada entrada você recebe um código de seis
            dígitos por e-mail. Sem conta, o app funciona igual, só que os dados ficam apenas no aparelho.
          </p>

          <h2>Onde os dados ficam</h2>
          <p>
            <strong>No seu aparelho, sempre.</strong> Tudo é gravado primeiro no armazenamento do próprio navegador ou app (IndexedDB) e
            funciona sem internet.
          </p>
          <p>
            <strong>Na nuvem, se você entrar com uma conta.</strong> Aí cada registro e comprovante ganha uma cópia em servidores da
            Supabase localizados em <strong>São Paulo, Brasil</strong>. A cópia é só de acréscimo: nada é alterado nem apagado na nuvem —
            corrigir cria uma versão nova e a anterior fica no histórico, porque é assim que o registro serve como prova. Cada conta só
            enxerga os próprios dados (regras de acesso no banco); os comprovantes ficam em armazenamento privado, sem endereço público.
          </p>

          <h2>Leitura automática do comprovante</h2>
          <p>
            Quando você tira a foto, o app pode ler valor, data e estabelecimento sozinho. Para isso a imagem é enviada ao nosso servidor
            (hospedado pela Vercel, nos Estados Unidos) e dali a um serviço de inteligência artificial da Anthropic (Estados Unidos),
            que devolve os campos lidos. Nosso servidor <strong>não guarda a imagem</strong>; a Anthropic{" "}
            <strong>não usa o que recebe para treinar seus modelos</strong> e a descarta segundo a política de retenção dela. Você
            sempre confere e pode corrigir o que foi lido. Trata-se de uma transferência internacional de dados (art. 33 da LGPD),
            necessária para prestar essa função; se preferir não enviar, use o modo manual e digite os valores.
          </p>

          <h2>Google Drive (opcional)</h2>
          <p>
            Se você escolher enviar a pasta para o Google Drive, o app pede permissão apenas para criar arquivos no{" "}
            <strong>seu</strong> Drive (escopo <code>drive.file</code>): ele não lê nem vê o resto da sua conta Google. A autorização
            fica na memória do navegador durante a sessão e você pode revogá-la a qualquer momento em myaccount.google.com.
          </p>

          <h2>Outros serviços</h2>
          <p>
            Para atualizar valores em atraso, o servidor busca os índices INPC e IPCA no IBGE — dados públicos, nenhum dado seu é
            enviado. O site é hospedado pela Vercel, que mantém registros técnicos de acesso (endereço IP, data e hora) por prazo curto,
            para segurança. O app <strong>não usa cookies de rastreamento, não tem análise de comportamento nem anúncios</strong>.
          </p>

          <h2>Com quem compartilhamos</h2>
          <p>
            Com ninguém, além dos operadores citados acima (Supabase, Vercel, Anthropic e, se você escolher, Google), que tratam os
            dados só para prestar o serviço. Não vendemos dados. Quem decide quando exportar a pasta e a quem entregá-la é você.
          </p>

          <h2>Base legal</h2>
          <p>
            Tratamos seus dados para prestar o serviço que você pediu (execução de contrato) e para que você exerça regularmente seus
            direitos em processo judicial ou administrativo (art. 7º, incisos V e VI, da LGPD). A leitura automática e o envio ao Drive
            são funções opcionais, usadas quando você as aciona.
          </p>

          <h2>Por quanto tempo</h2>
          <p>
            Enquanto sua conta existir. Ao <strong>apagar a conta</strong>, removemos imediatamente todos os registros, comprovantes e
            o seu e-mail da nuvem; cópias de segurança automáticas do provedor são descartadas em seguida, dentro do prazo da política
            dele. O que está no aparelho é apagado junto, e você pode também apagar os dados do site ou desinstalar o app.
          </p>

          <h2>Seus direitos</h2>
          <p>
            Pela LGPD (art. 18) você pode: <strong>ver</strong> tudo que temos — o app mostra todos os registros e o histórico de cada
            um; <strong>corrigir</strong> — criando uma versão nova (a anterior permanece no histórico, como explicado acima);{" "}
            <strong>levar</strong> seus dados — a exportação gera planilhas, relatório e comprovantes em formatos abertos (CSV, PDF,
            imagens); <strong>apagar</strong> — pela tela Conta ou por{" "}
            <Link href="/apagar-conta" className="font-medium text-accent underline">
              este link
            </Link>
            ; <strong>revogar</strong> as permissões opcionais; e <strong>saber</strong> com quem compartilhamos. Pedidos podem ser
            feitos pelo e-mail acima e são atendidos em até 15 dias. Você também pode se dirigir à Autoridade Nacional de Proteção de
            Dados (ANPD).
          </p>

          <h2>Segurança</h2>
          <p>
            Conexão sempre criptografada (HTTPS). Cada comprovante recebe um selo SHA-256 no momento do registro, que permite provar
            depois que o arquivo não foi alterado. Na nuvem, regras de acesso por conta, armazenamento privado e entrada por código
            temporário, sem senha para vazar.
          </p>

          <h2>Mudanças nesta política</h2>
          <p>
            Se o app passar a tratar dados de outra forma, esta página é atualizada antes, com a data no topo. Mudanças relevantes são
            avisadas dentro do app.
          </p>

          <p className="mt-8 text-xs text-ink-3">
            AlimentaProva · {CONTROLADORA} ·{" "}
            <a href={`mailto:${CONTATO}`} className="underline">
              {CONTATO}
            </a>
          </p>
        </article>
      </main>
    </div>
  );
}
