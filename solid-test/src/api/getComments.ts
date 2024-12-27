import { createQuery } from "@tanstack/solid-query";
import { Accessor } from "solid-js";
import { GET } from "./methods";

export default function getComments(id: Accessor<number>) {
  return createQuery(() => ({
    queryKey: ["comments", id()],
    enabled: id() != null,
    async queryFn() {
      const json = await GET(`/vx/comment/getbynode/${id()}`);
      return json.comment;
    },
  }));
}
