import { useEffect, useRef, useState } from "react";
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

const formSchema = z.object({
  email: z.string().email("O email digitado deve ser válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export const AuthForm = () => {
  const router = useRouter();

  const [lastStep, setLastStep] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
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
            <Button onClick={() => setLastStep(false)} className="bg-container">
              Voltar
            </Button>
          )}
          <Button
            className="w-full"
            onClick={() => {
              if (!lastStep) {
                const { invalid } = form.getFieldState("email");

                if (invalid) {
                  return;
                }

                setLastStep(true);
              }
            }}
            {...(lastStep && { type: "submit" })}
          >
            {lastStep ? "Criar conta com email" : "Continuar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
