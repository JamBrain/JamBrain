import { RouteSectionProps } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { GET } from "~/api/methods";
import { EventNode } from "~/api/types";
import Content from "~/components/Content";
import Nav from "~/components/Nav";
import { useRootNode } from "~/context/PageContext";

export default function EventTheme(props: RouteSectionProps) {
  const node = useRootNode<EventNode>(() => ({
    refetchOnMount: false,
  }));

  const theme = createQuery(() => ({
    queryKey: ["theme", node.data?.id],
    enabled: node.data?.id != null,
    async queryFn() {
      return GET(`/vx/theme/list/get/${node.data?.id}`);
    },
  }));

  const pageIndex = () => props.params.page ?? "1";

  const currentName = () => theme.data?.names[pageIndex()];
  const currentList = () => theme.data?.lists[pageIndex()];

  return (
    <>
      <Nav>
        {theme.data?.names &&
          Object.entries(theme.data?.names).map(([i, name]) => ({
            href: `${node.data?.path}/theme/${i}`,
            label: name,
            icon: "icon-ticket",
            disabled: !theme.data?.allowed.includes(i), // TODO
          }))}
      </Nav>
      <Content
        header={
          <h1 class="font-header grow text-3xl font-bold">{currentName()}</h1>
        }
      >
        <ul>
          {currentList()?.map((idea) => (
            <li key={idea.ideaId}>{idea.theme}</li>
          ))}
        </ul>
      </Content>
    </>
  );
}
