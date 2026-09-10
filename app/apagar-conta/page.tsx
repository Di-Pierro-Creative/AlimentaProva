import Conta from "@/components/Conta";

// Link público para apagar a conta (exigência da Google Play e da LGPD):
// a mesma tela Conta, com a seção "Apagar" já aberta. Quem não estiver
// logada entra primeiro, pelo e-mail, e então apaga.

export const metadata = { title: "Apagar conta — AlimentaProva" };

export default function ApagarContaPage() {
  return <Conta abrirApagar />;
}
