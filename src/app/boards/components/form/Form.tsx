"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TokensIcon } from "@radix-ui/react-icons";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do quadro deve ter pelo menos 2 caracteres")
    .max(64, "O nome do quadro deve ter no máximo 64 caracteres"),
  isPublic: z.boolean().default(false),
});

type Props = {
  onSubmit: (values: any) => void;
  loadingButton: boolean;
};

export const BoardForm = ({ onSubmit, loadingButton }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isPublic: false,
    },
  });

  return (
    <Form {...form}>
      <FormDescription>Defina o nome do quadro abaixo:</FormDescription>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do quadro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Público</FormLabel>
                <FormDescription>
                  Permite que outras pessoas acessem seu quadro
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button className="flex gap-2" type="submit" disabled={loadingButton}>
            {loadingButton && (
              <TokensIcon className="w-4 h-4 animate-spin duration-2000" />
            )}
            Criar
          </Button>
        </div>
      </form>
    </Form>
  );
};
