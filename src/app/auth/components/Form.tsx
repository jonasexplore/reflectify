import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const AuthForm = () => {
  const router = useRouter();

  const [lastStep, setLastStep] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .email("Você deve informar um email válido para prosseguir"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.replace("/board");
  }

  useEffect(() => {
    return () => {
      form.resetField("email");
      form.resetField("password");
    };
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-sm w-full my-4 space-y-4"
      >
        <div hidden={lastStep}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <Input
                  className="bg-container font-bold cursor-text"
                  type="text"
                  size={1}
                  placeholder="name@example.com.br"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div hidden={!lastStep}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <Input
                  className="bg-container font-bold cursor-text"
                  type="password"
                  size={1}
                  placeholder="digite uma senha"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          {lastStep && (
            <Button
              type="button"
              onClick={() => setLastStep(false)}
              className="bg-container"
            >
              Voltar
            </Button>
          )}
          <Button
            type="submit"
            className="w-full"
            onClick={() => {
              if (!lastStep) {
                const { invalid, isTouched } = form.getFieldState("email");

                if (invalid || !isTouched) return;

                setLastStep(true);
              }
            }}
          >
            {lastStep ? "Criar conta com email" : "Continuar"}
          </Button>
        </div>

        {lastStep && (
          <div className="text-sm text-muted-foreground text-center">
            <span>
              Ao clicar em criar conta, você concorda com os nossos{" "}
              <span className="underline">Termos de Serviço</span> e{" "}
              <span className="underline">Política de Privacidade</span>.
            </span>
          </div>
        )}
      </form>
    </Form>
  );
};
