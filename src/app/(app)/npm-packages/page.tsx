import { PageHeader } from "@/components/shared/page-header";
import { PackageTable } from "@/components/npm/package-table";
import { createClient } from "@/lib/supabase/server";
import type { NpmPackage, OperatingSystem } from "@/types";

export default async function NpmPackagesPage() {
  const supabase = await createClient();

  const [{ data: osList }, { data: packages }] = await Promise.all([
    supabase.from("operating_systems").select("id, name").order("name"),
    supabase.from("npm_packages").select("*").order("name", { ascending: true }),
  ]);

  const osOptions = (osList ?? []) as Pick<OperatingSystem, "id" | "name">[];
  const rows = (packages ?? []) as NpmPackage[];

  return (
    <div>
      <PageHeader
        title="Pacotes npm"
        description="Pacotes globais e de projeto que voce usa com frequencia."
      />
      <PackageTable packages={rows} osOptions={osOptions} />
    </div>
  );
}
