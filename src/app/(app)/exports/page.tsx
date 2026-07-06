import { Download } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function ExportsPage() {
  return (
    <div>
      <PageHeader
        title="Exportar"
        description="Gere arquivos do seu setup para versionar ou reinstalar rapidamente."
      />
      <EmptyState
        icon={Download}
        title="Exportacao chega na fase 2"
        description="Vamos gerar JSON, Markdown e scripts (.sh / .ps1) a partir dos seus ambientes, ferramentas e pacotes. A base de dados ja esta pronta para isso."
      />
    </div>
  );
}
