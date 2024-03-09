"use client";

import Image from "next/image";
import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";

import { ModeToggle } from "@/components/toggle";

import logo from "../../../../public/logo.svg";
import { useAuthPage } from "../hooks/useAuthPage";
import AuthLoading from "../loading";

import { SignInButton } from "./SignInButton";

type AuthContentProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export const AuthContent = ({ providers }: AuthContentProps) => {
  const { loading, handleOnClickSignIn } = useAuthPage({ providers });

  if (loading.page) {
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
              <SignInButton
                loading={loading.button}
                onClick={handleOnClickSignIn}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
