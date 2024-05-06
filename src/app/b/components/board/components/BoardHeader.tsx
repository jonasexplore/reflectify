import { useState } from "react";
import {
  ArchiveIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  PlusIcon,
  Share1Icon,
  TokensIcon,
} from "@radix-ui/react-icons";

import { useStoreAuth } from "@/store";

import { useBoardHeader } from "../hooks/useBoardHeader";

export const BoardHeader = () => {
  const [clickShare, setClickShare] = useState(false);
  const {
    board,
    loading,
    hideCards,
    setHideCards,
    handleUpdate,
    handleAddColumn,
  } = useBoardHeader();
  const { user } = useStoreAuth();

  const isCreator = user?.id === board.userId;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 rounded-lg">
        <div>
          <span className="text-md font-bold">{board.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {isCreator && (
            <div className="flex items-center">
              <button
                className="flex gap-1 p-2 rounded-lg items-center text-sm hover:bg-container transition-all ease-linear delay-100"
                onClick={handleAddColumn}
              >
                <PlusIcon className="w-4 h-4" /> Nova coluna
              </button>
            </div>
          )}
          {isCreator && (
            <div className="flex items-center gap-2">
              <button
                className={`flex gap-1 p-2 rounded-lg items-center text-sm hover:bg-container transition-all ease-linear delay-100 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <TokensIcon className="w-4 h-4 animate-spin duration-2000" />
                ) : (
                  <ArchiveIcon className="w-4 h-4" />
                )}
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
          {isCreator && (
            <div className="flex items-center gap-2">
              <button
                className={`flex gap-1 p-2 rounded-lg items-center text-sm hover:bg-container transition-all ease-linear delay-100`}
                onClick={() => setHideCards(!hideCards)}
              >
                {hideCards ? (
                  <EyeClosedIcon className="w-4 h-4" />
                ) : (
                  <EyeOpenIcon className="w-4 h-4" />
                )}
                {hideCards ? "Mostrar" : "Esconder"}
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              className="flex gap-1 p-2 rounded-lg items-center text-sm hover:bg-container transition-all ease-linear delay-100"
              onClick={() => {
                setClickShare(true);
                navigator.clipboard.writeText(window.location.href);
                !clickShare && setTimeout(() => setClickShare(false), 2000);
              }}
            >
              <Share1Icon className="w-4 h-4" />
              {clickShare ? "Copiado!" : "Compartilhar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
