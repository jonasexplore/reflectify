import { useMemo } from "react";
import { Loader } from "lucide-react";

import { GoogleIcon } from "@/components/icons";

type Props = {
  loading: boolean;
  onClick: () => void;
};

export const SignInButton = ({ loading, onClick }: Props) => {
  const icon = useMemo(() => {
    if (loading) {
      return <Loader className="w-5 h-5 animate-spin duration-2000" />;
    }

    return <GoogleIcon className="w-5 h-5" />;
  }, [loading]);

  return (
    <button
      disabled={loading}
      className="flex items-center h-10 gap-[10px] justify-center rounded-full border py-[10px] px-[12px] hover:bg-container transition-colors disabled:bg-button-disabled disabled:cursor-not-allowed"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">Continuar com o Google</span>
    </button>
  );
};
