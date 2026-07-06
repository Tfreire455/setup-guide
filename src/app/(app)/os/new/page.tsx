import { PageHeader } from "@/components/shared/page-header";
import { OsForm } from "@/components/os/os-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewOsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Novo ambiente"
        description="Descreva o sistema onde voce desenvolve."
      />
      <Card>
        <CardContent className="pt-6">
          <OsForm />
        </CardContent>
      </Card>
    </div>
  );
}
