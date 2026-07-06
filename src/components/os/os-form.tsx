"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createOs, updateOs } from "@/actions/os";
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
import {
  ARCHITECTURES,
  OS_TYPES,
  PACKAGE_MANAGERS,
  TERMINALS,
} from "@/lib/constants";
import { osSchema, type OsInput } from "@/lib/validations";
import type { OperatingSystem } from "@/types";

interface OsFormProps {
  initial?: OperatingSystem;
  onDone?: () => void;
}

export function OsForm({ initial, onDone }: OsFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OsInput>({
    resolver: zodResolver(osSchema),
    defaultValues: {
      name: initial?.name ?? "",
      os_type: (initial?.os_type as OsInput["os_type"]) ?? "linux",
      distribution: initial?.distribution ?? "",
      version: initial?.version ?? "",
      architecture: initial?.architecture ?? "",
      package_manager: initial?.package_manager ?? "",
      terminal: initial?.terminal ?? "",
      shell: initial?.shell ?? "",
      notes: initial?.notes ?? "",
      tags: initial?.tags ?? [],
    },
  });

  async function onSubmit(values: OsInput) {
    const res = isEdit ? await updateOs(initial!.id, values) : await createOs(values);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(isEdit ? "Ambiente atualizado." : "Ambiente criado.");
    if (onDone) onDone();
    if (!isEdit && "data" in res && res.data?.id) {
      router.push(`/os/${res.data.id}`);
    } else {
      router.push("/os");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nome do ambiente *</Label>
          <Input id="name" placeholder="Ex.: Notebook principal, WSL trabalho" {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Controller
            control={control}
            name="os_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {OS_TYPES.map((o) => (
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
          <Label htmlFor="distribution">Distribuicao</Label>
          <Input id="distribution" placeholder="Ubuntu, Fedora, Windows 11..." {...register("distribution")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Versao</Label>
          <Input id="version" placeholder="24.04, 14.5..." {...register("version")} />
        </div>

        <div className="space-y-2">
          <Label>Arquitetura</Label>
          <Controller
            control={control}
            name="architecture"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ARCHITECTURES.map((o) => (
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
          <Label>Gerenciador de pacotes</Label>
          <Controller
            control={control}
            name="package_manager"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_MANAGERS.map((o) => (
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
          <Label>Terminal</Label>
          <Controller
            control={control}
            name="terminal"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {TERMINALS.map((o) => (
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
          <Label htmlFor="shell">Shell</Label>
          <Input id="shell" placeholder="bash, zsh, pwsh..." {...register("shell")} />
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
              placeholder="Ex.: trabalho, pessoal, cliente-x"
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observacoes</Label>
        <Textarea id="notes" rows={3} placeholder="Notas sobre este ambiente..." {...register("notes")} />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => (onDone ? onDone() : router.back())}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEdit ? "Salvar alteracoes" : "Criar ambiente"}
        </Button>
      </div>
    </form>
  );
}
