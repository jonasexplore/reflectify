import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardProps } from "@/store";

import { useCardComment } from "../hooks/useCardCommen";

import { CardCommentItem } from ".";

type Props = {
  card: CardProps;
};

export const CardComments = ({ card }: Props) => {
  const { comment, setComment, handleComment } = useCardComment({
    id: card.id,
  });

  return (
    <div className="flex flex-col gap-2">
      <strong className="text-sm">Comentários</strong>
      <div className="m-1 flex flex-col gap-2">
        <Textarea
          rows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="max-h-[256px]"
          placeholder="Digite sua mensagem aqui."
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleComment}>
            <span className="flex gap-2 items-center">
              <Send className="h-4 w-4" />
              Comentar
            </span>
          </Button>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {card?.comments?.map((comment) => (
          <CardCommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </div>
  );
};
