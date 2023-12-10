import {
  ChatBubbleOvalLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { CardButton } from "./CardButton";

export const CardFooter = () => {
  return (
    <div className="flex justify-end items-center gap-4">
      <div className="flex gap-2">
        <CardButton showCount icon={<HandThumbUpIcon className="h-4 w-4 " />} />
        <CardButton
          showCount
          icon={<HandThumbDownIcon className="h-4 w-4 " />}
        />
      </div>
      <CardButton icon={<ChatBubbleOvalLeftIcon className="h-4 w-4 " />} />
      <CardButton
        icon={<TrashIcon className="h-4 w-4 cursor-pointer text-red-400" />}
      />
    </div>
  );
};
