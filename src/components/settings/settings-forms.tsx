"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updatePassword, updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForms({
  email,
  initialName,
}: {
  email: string;
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = React.useState(initialName);
  const [savingProfile, setSavingProfile] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [savingPass, setSavingPass] = React.useState(false);

  async function saveProfile() {
    if (!name.trim()) {
      toast.error("Informe um nome.");
      return;
    }
    setSavingProfile(true);
    const res = await updateProfile(name.trim());
    setSavingProfile(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Perfil atualizado.");
    router.refresh();
  }

  async function savePassword() {
    if (password.length < 6) {
      toast.error("A senha precisa de ao menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas nao coincidem.");
      return;
    }
    setSavingPass(true);
    const res = await updatePassword(password);
    setSavingPass(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Senha alterada.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
          <CardDescription>Seus dados basicos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sname">Nome</Label>
            <Input id="sname" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semail">E-mail</Label>
            <Input id="semail" value={email} disabled />
            <p className="text-xs text-muted-foreground">O e-mail nao pode ser alterado aqui.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? "Salvando..." : "Salvar perfil"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Senha</CardTitle>
          <CardDescription>Defina uma nova senha de acesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="spass">Nova senha</Label>
              <Input
                id="spass"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spass2">Confirmar senha</Label>
              <Input
                id="spass2"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={savePassword} disabled={savingPass} variant="secondary">
              {savingPass ? "Salvando..." : "Alterar senha"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
