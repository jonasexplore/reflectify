import { Save } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useStoreAuth } from "@/store";

import { useBoardHeader } from "../hooks/useBoardHeader";

export const BoardHeader = () => {
  const { board, loading, handleUpdate } = useBoardHeader();
  const { user } = useStoreAuth();

  const isCreator = user?.id === board.userId;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 py-2 rounded-lg">
        <div>
          <span className="text-md font-bold">{board.name}</span>
        </div>
        {isCreator && (
          <div className="flex items-center gap-2">
            <button
              className="flex gap-1 p-2 rounded-lg items-center text-sm hover:bg-container transition-all ease-linear delay-100"
              onClick={handleUpdate}
              disabled={loading}
            >
              <Save className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
              Salvar
            </button>
          </div>
        )}
      </div>
      <Separator />
    </div>
  );
};
