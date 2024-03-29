"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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

const formSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do quadro deve ter pelo menos 2 caracteres")
    .max(64, "O nome do quadro deve ter no máximo 64 caracteres"),
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
        <div className="flex justify-end">
          <Button type="submit" disabled={loadingButton}>
            {loadingButton && <Loader className="w-4 h-4 animate-spin" />}
            Criar
          </Button>
        </div>
      </form>
    </Form>
  );
};
