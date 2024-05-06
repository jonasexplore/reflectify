import { useState } from "react";
import { HeartFilledIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentProps } from "@/types/board";

type Props = {
  comment: CommentProps;
};

export const CardCommentItem = ({ comment }: Props) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-container p-2">
      <div className="flex gap-4 items-start">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <span className="text-sm">{comment.content}</span>
          <div className="hidden flex justify-end items-center gap-2">
            <span className="text-sm font-semibold">
              {comment?.commentLikes?.length}
            </span>
            <button
              onClick={() => setLiked(!liked)}
              className="flex gap-1 items-center text-sm cursor-pointer"
            >
              <HeartFilledIcon
                className={
                  liked
                    ? "w-4 h-4 text-red-500 transition-colors ease-in-out"
                    : "w-4 h-4"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
