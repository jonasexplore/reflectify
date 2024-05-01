import { useEffect } from "react";
import { TokensIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getUser } from "@/services/users";
import { useStoreAuth } from "@/store";

import { useToast } from "./use-toast";

export function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const { toast } = useToast();
    const { setUser } = useStoreAuth();

    const { isPending, data } = useQuery({
      queryKey: ["user"],
      queryFn: getUser,
      retry: false,
    });

    useEffect(() => {
      if (isPending) {
        return;
      }

      if (!data) {
        toast({
          title: "Segurança",
          description: "É necessário estar autenticado para acessar o ambiente",
        });
        sessionStorage.removeItem("identifier");
        return redirect("/auth");
      }

      setUser(data.id);
    }, [data, isPending, setUser, toast]);

    if (isPending) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <TokensIcon className="w-8 h-8 animate-spin duration-2000" />
            <div className="flex flex-col items-center">
              <span className="font-bold">Validando sessão</span>
              <span className="text-muted-foreground">
                Aguarde enquanto validamos sua sessão...
              </span>
            </div>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
