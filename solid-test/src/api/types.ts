export type IncludeOptions = {
  author?: boolean;
  parent?: boolean;
  superParent?: boolean;
};

export type NodeId<
  type extends Node,
  forbid extends "node" | "author" | "parent" | "_superparent" = never,
> = number & { type: type; forbid: forbid };

export type UserNode = {
  id: number;
  type: "user";
  path: string;
  slug: string;
  name: string;
  meta: {
    avatar?: string;
  };
  author: NodeId<UserNode>;
  parent: number;
  body: string;
};

export type PostNode = {
  id: number;
  type: "post";
  path: string;
  name: string;
  author: NodeId<UserNode>;
  parent: NodeId<GameNode>;
  _superparent: NodeId<EventNode>;
  body: string;
};

export type GameNode = {
  id: number;
  type: "game";
  path: string;
  author: NodeId<UserNode>;
  parent: NodeId<EventNode>;
  body: string;
};

export type EventNode = {
  id: number;
  type: "event";
  path: string;
  author: NodeId<UserNode>;
  // parent: number,
  body: string;
};

export type PageNode = {
  id: number;
  type: "page";
  path: string;
  name: string;
  author: NodeId<UserNode>;
  body: string;
  modified: string;
};

export type Node = UserNode | PostNode | GameNode | EventNode | PageNode;
