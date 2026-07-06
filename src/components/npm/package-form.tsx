"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createPackage, updatePackage } from "@/actions/packages";
import { TagInput } from "@/components/shared/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PACKAGE_SCOPES, PACKAGE_STATUS, PACKAGE_TAGS } from "@/lib/constants";
import { packageSchema, type PackageInput } from "@/lib/validations";
import type { NpmPackage } from "@/types";

interface OsOption {
  id: string;
  name: string;
}

interface PackageFormProps {
  initial?: NpmPackage;
  osOptions?: OsOption[];
  onDone?: () => void;
}

const NONE = "none";

export function PackageForm({ initial, osOptions = [], onDone }: PackageFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      os_id: initial?.os_id ?? "",
      name: initial?.name ?? "",
      version: initial?.version ?? "",
      scope: (initial?.scope as PackageInput["scope"]) ?? "global",
      reason: initial?.reason ?? "",
      install_command: initial?.install_command ?? "",
      update_command: initial?.update_command ?? "",
      npm_url: initial?.npm_url ?? "",
      tags: initial?.tags ?? [],
      status: (initial?.status as PackageInput["status"]) ?? "active",
    },
  });

  async function onSubmit(values: PackageInput) {
    const res = isEdit
      ? await updatePackage(initial!.id, values)
      : await createPackage(values);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(isEdit ? "Pacote atualizado." : "Pacote adicionado.");
    onDone?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pname">Pacote *</Label>
          <Input id="pname" className="font-mono text-sm" placeholder="typescript, vite, eslint..." {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pversion">Versao</Label>
          <Input id="pversion" placeholder="5.4.0 / latest" {...register("version")} />
        </div>

        <div className="space-y-2">
          <Label>Escopo</Label>
          <Controller
            control={control}
            name="scope"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_SCOPES.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_STATUS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Ambiente (opcional)</Label>
          <Controller
            control={control}
            name="os_id"
            render={({ field }) => (
              <Select
                value={field.value || NONE}
                onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sem ambiente especifico</SelectItem>
                  {osOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="preason">Para que serve</Label>
          <Input id="preason" placeholder="Ex.: linter do projeto, bundler..." {...register("reason")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="picmd">Instalacao</Label>
          <Input
            id="picmd"
            className="font-mono text-xs"
            placeholder="deixe vazio p/ gerar automatico"
            {...register("install_command")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pucmd">Atualizacao</Label>
          <Input id="pucmd" className="font-mono text-xs" placeholder="npm i -g pkg@latest" {...register("update_command")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              suggestions={PACKAGE_TAGS}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onDone ? (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEdit ? "Salvar" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
