"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";

import { ModeToggle } from "@/app/boards/components/toggle";
import { createUser, getUser } from "@/app/services/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import logo from "../../../../public/logo.svg";
import AuthLoading from "../loading";

type AuthContentProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export const AuthContent = ({ providers }: AuthContentProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  const handleCheckUserExists = useCallback(async () => {
    try {
      setLoading(true);

      const output = await getUser(session?.user?.email as string);

      if (!output) {
        return setCreateAccount(true);
      }

      console.log("cai aqui");

      router.push("/boards");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [router, session?.user?.email]);

  const handleCreateAccount = useCallback(async () => {
    try {
      setCreateLoading(true);

      await createUser(session?.user?.email as string);

      router.push("/boards");
    } catch (error) {
      console.log(error);
    } finally {
      setCreateLoading(false);
    }
  }, [router, session?.user?.email]);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    handleCheckUserExists();
  }, [handleCheckUserExists, session?.user]);

  if (loading) {
    return <AuthLoading />;
  }

  return (
    <div className="h-screen">
      <div className="grid grid-cols-2">
        <div className="h-screen bg-container flex flex-col justify-between">
          <div className="py-6 mx-6">
            <div className="flex gap-2 items-center ">
              <Image alt="logo" src={logo} className="w-4 h-4" />
              <span className="font-bold">reflectify</span>
            </div>
          </div>

          <div className="p-4 text-muted-foreground">
            <span>
              Reflectify é a ferramenta perfeita para equipes de desenvolvimento
              otimizarem suas retrospectivas. Facilitando a criação de cards
              personalizados, a aplicação web torna as reuniões mais eficientes,
              promovendo uma reflexão colaborativa e identificação de melhorias.
              Transforme suas retrospectivas com o Reflectify.
            </span>
          </div>
        </div>
        <div className="h-screen border-l flex flex-col items-center justify-center">
          <div className="w-full px-6 py-4 flex gap-2 justify-end">
            <ModeToggle />
          </div>
          <div className=" flex-1 flex flex-col justify-center gap-4 space-y-2">
            <div className="flex flex-col">
              <span className="text-center text-2xl font-semibold tracking-tight">
                Acessar conta
              </span>
              <span className="text-center text-muted-foreground">
                Selecione uma opção abaixo de login para acessar sua conta
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div>
                <button
                  onClick={() => signIn(providers?.google.id)}
                  className="flex items-center h-10 gap-[10px] justify-center rounded-full border py-[10px] px-[12px] hover:bg-container transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  <span className="text-sm">Continuar com o Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        onOpenChange={(value) => setCreateAccount(value)}
        open={createAccount}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar conta</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4">
                <span>Eu concordo em criar uma conta!</span>
                <Button disabled={createLoading} onClick={handleCreateAccount}>
                  {createLoading && <Loader className="w-4 h-4 animate-spin" />}{" "}
                  Aceito
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
