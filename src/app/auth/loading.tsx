import { Loader } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader className="w-8 h-8 animate-spin duration-2000" />
        <div className="flex flex-col items-center">
          <span className="font-bold">Carregando</span>
          <span className="text-muted-foreground">
            Aguarde enquando buscamos algumas informações :)
          </span>
        </div>
      </div>
    </div>
  );
}
