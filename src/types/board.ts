import { UniqueIdentifier } from "@dnd-kit/core";

type LikeCardProps = {
  id: string;
  timestamp: string;
  userId: string;
  boardId: string;
  cardId: string;
};

type LikeCommentProps = {
  id: string;
  timestamp: string;
  boardId: string;
  userId: string;
  commentId: string;
};

export type CommentProps = {
  id: string;
  content: string;
  timestamp: string;
  boardId: string;
  userId: string;
  cardId: UniqueIdentifier;
  commentLikes: LikeCommentProps[];
};

export type CardProps = {
  id: UniqueIdentifier;
  content: string;
  userId: string;
  boardId: string;
  columnId: UniqueIdentifier;
  likes: LikeCardProps[];
  comments: CommentProps[];
};

type ColumnProps = {
  id: string;
  name: string;
  position: number;
  boardId: string;
  cards: CardProps[];
};

export type BoardProps = {
  id: string;
  name: string;
  created: string;
  updated: string;
  userId: string;
  isPublic: boolean;
  columns: ColumnProps[];
};
