import { Boxes } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function SetupsPage() {
  return (
    <div>
      <PageHeader
        title="Setups"
        description="Modelos reproduziveis de ambiente (passo a passo) para montar uma maquina do zero."
      />
      <EmptyState
        icon={Boxes}
        title="Em breve na proxima fase"
        description="Os templates de setup (com passos ordenados, comandos e nivel de risco) fazem parte da fase 2, junto com a exportacao para .sh/.ps1 e o app desktop."
      />
    </div>
  );
}
