"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createCommand, updateCommand } from "@/actions/commands";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { COMMAND_CATEGORIES, RISK_LEVELS } from "@/lib/constants";
import { commandSchema, type CommandInput } from "@/lib/validations";
import type { Command } from "@/types";

interface OsOption {
  id: string;
  name: string;
}

interface CommandFormProps {
  initial?: Command;
  osOptions?: OsOption[];
  onDone?: () => void;
}

const NONE = "none";

export function CommandForm({ initial, osOptions = [], onDone }: CommandFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CommandInput>({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      os_id: initial?.os_id ?? "",
      title: initial?.title ?? "",
      command: initial?.command ?? "",
      category: initial?.category ?? "",
      explanation: initial?.explanation ?? "",
      risk_level: (initial?.risk_level as CommandInput["risk_level"]) ?? "low",
      requires_admin: initial?.requires_admin ?? false,
      is_favorite: initial?.is_favorite ?? false,
      notes: initial?.notes ?? "",
    },
  });

  async function onSubmit(values: CommandInput) {
    const res = isEdit
      ? await updateCommand(initial!.id, values)
      : await createCommand(values);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(isEdit ? "Comando atualizado." : "Comando salvo.");
    onDone?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ctitle">Titulo *</Label>
        <Input id="ctitle" placeholder="Ex.: Limpar cache do npm" {...register("title")} />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ccmd">Comando *</Label>
        <Textarea
          id="ccmd"
          rows={2}
          className="font-mono text-sm"
          placeholder="npm cache clean --force"
          {...register("command")}
        />
        {errors.command ? (
          <p className="text-xs text-destructive">{errors.command.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
                  {COMMAND_CATEGORIES.map((o) => (
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
          <Label>Nivel de risco</Label>
          <Controller
            control={control}
            name="risk_level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map((o) => (
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="cexpl">Explicacao</Label>
        <Textarea id="cexpl" rows={2} placeholder="O que este comando faz e quando usar..." {...register("explanation")} />
      </div>

      <div className="flex flex-wrap gap-6">
        <Controller
          control={control}
          name="requires_admin"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Requer admin / sudo
            </label>
          )}
        />
        <Controller
          control={control}
          name="is_favorite"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Favorito
            </label>
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
          {isSubmitting ? "Salvando..." : isEdit ? "Salvar" : "Salvar comando"}
        </Button>
      </div>
    </form>
  );
}
