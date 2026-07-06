import { PageHeader } from "@/components/shared/page-header";
import { SettingsForms } from "@/components/settings/settings-forms";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user?.id ?? "")
    .single();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuracoes" description="Gerencie sua conta." />
      <SettingsForms email={user?.email ?? ""} initialName={profile?.name ?? ""} />
    </div>
  );
}
