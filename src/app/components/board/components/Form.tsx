"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  message: z
    .string()
    .min(2, "A mensagem deve ter pelo menos 2 caracteres")
    .max(512, "A mesagem deve ter no máximo 512 caracteres"),
});

type Props = {
  onSubmit: (values: any) => void;
};

export const CardForm = ({ onSubmit }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  return (
    <Form {...form}>
      <FormDescription>
        Adicione novos cards preenchendo o campo abaixo
      </FormDescription>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className="max-h-[512px]"
                  placeholder="Digite sua mensagem aqui."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Adicionar</Button>
        </div>
      </form>
    </Form>
  );
};
