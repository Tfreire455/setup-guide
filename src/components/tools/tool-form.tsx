"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createTool, updateTool } from "@/actions/tools";
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
import { TOOL_CATALOG, TOOL_CATEGORIES, TOOL_STATUS } from "@/lib/constants";
import { toolSchema, type ToolInput } from "@/lib/validations";
import type { Tool } from "@/types";

interface OsOption {
  id: string;
  name: string;
}

interface ToolFormProps {
  initial?: Tool;
  osOptions?: OsOption[];
  fixedOsId?: string;
  onDone?: () => void;
}

export function ToolForm({ initial, osOptions = [], fixedOsId, onDone }: ToolFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ToolInput>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      os_id: initial?.os_id ?? fixedOsId ?? "",
      name: initial?.name ?? "",
      category: initial?.category ?? "",
      installed_version: initial?.installed_version ?? "",
      version_check_command: initial?.version_check_command ?? "",
      install_command: initial?.install_command ?? "",
      update_command: initial?.update_command ?? "",
      documentation_url: initial?.documentation_url ?? "",
      status: (initial?.status as ToolInput["status"]) ?? "installed",
      notes: initial?.notes ?? "",
    },
  });

  // Autopreenche a partir do catalogo ao escolher uma ferramenta conhecida
  function applyCatalog(name: string) {
    const hit = TOOL_CATALOG.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (hit) {
      setValue("category", hit.category);
      setValue("version_check_command", hit.check);
      setValue("documentation_url", hit.docs);
    }
  }

  async function onSubmit(values: ToolInput) {
    const res = isEdit ? await updateTool(initial!.id, values) : await createTool(values);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(isEdit ? "Ferramenta atualizada." : "Ferramenta adicionada.");
    onDone?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!fixedOsId ? (
        <div className="space-y-2">
          <Label>Ambiente *</Label>
          <Controller
            control={control}
            name="os_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  {osOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.os_id ? (
            <p className="text-xs text-destructive">{errors.os_id.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tname">Nome *</Label>
          <Input
            id="tname"
            list="tool-catalog"
            placeholder="Node.js, Docker, Git..."
            {...register("name", { onBlur: (e) => applyCatalog(e.target.value) })}
          />
          <datalist id="tool-catalog">
            {TOOL_CATALOG.map((t) => (
              <option key={t.name} value={t.name} />
            ))}
          </datalist>
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_CATEGORIES.map((o) => (
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
          <Label htmlFor="iv">Versao instalada</Label>
          <Input id="iv" placeholder="20.11.0" {...register("installed_version")} />
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
                  {TOOL_STATUS.map((o) => (
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
          <Label htmlFor="vcheck">Comando para checar versao</Label>
          <Input id="vcheck" className="font-mono text-xs" placeholder="node -v" {...register("version_check_command")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icmd">Comando de instalacao</Label>
          <Input id="icmd" className="font-mono text-xs" placeholder="apt install nodejs" {...register("install_command")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ucmd">Comando de atualizacao</Label>
          <Input id="ucmd" className="font-mono text-xs" placeholder="npm i -g npm@latest" {...register("update_command")} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="docs">Documentacao (URL)</Label>
          <Input id="docs" type="url" placeholder="https://..." {...register("documentation_url")} />
          {errors.documentation_url ? (
            <p className="text-xs text-destructive">{errors.documentation_url.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tnotes">Observacoes</Label>
        <Textarea id="tnotes" rows={2} {...register("notes")} />
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
