import { useCallback, useEffect } from "react";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { getUser } from "@/app/services/users";
import { useStoreAuth } from "@/app/store";

import { useToast } from "./use-toast";

export function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const { toast } = useToast();
    const session = useSession();
    const { user, setUser } = useStoreAuth();

    const handleUserAuthenticated = useCallback(async () => {
      try {
        if (
          !(
            session.status === "authenticated" &&
            session.data.user?.email &&
            !user
          )
        ) {
          return;
        }

        const output = await getUser(session.data.user.email);

        if (output) {
          setUser(output.id);
        }
      } catch (error) {
        console.log(error);
      }
    }, [session.data?.user?.email, session.status, setUser, user]);

    useEffect(() => {
      if (session.status === "unauthenticated") {
        toast({
          title: "Ação não permitida",
          description:
            "É necessário estar autenticado para acessar o ambiente :)",
        });
        return redirect("/auth");
      }

      handleUserAuthenticated();
    }, [handleUserAuthenticated, session.status, toast]);

    if (!session || session.status !== "authenticated") {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader className="w-8 h-8 animate-spin duration-2000" />
            <div className="flex flex-col items-center">
              <span className="font-bold">Carregando</span>
              <span className="text-muted-foreground">
                Aguarde enquando buscamos seus dados :)
              </span>
            </div>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
