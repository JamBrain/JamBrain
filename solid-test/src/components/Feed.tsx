import { For, JSXElement, Match, Suspense, Switch } from "solid-js";
import { createInfiniteQuery } from "@tanstack/solid-query";

interface FeedProps<T> {
  fetch(offset: number, limit: number): Promise<T[]>;
  key: string[];
  children: (entry: T) => JSXElement;
}

export default function Feed<T>(props: FeedProps<T>) {
  const pageSize = 5;

  const query = createInfiniteQuery(() => {
    return {
      queryKey: props.key,
      queryFn(context) {
        return props.fetch(context.pageParam.offset, pageSize);
      },
      initialPageParam: {
        offset: 0,
      },
      getNextPageParam(lastPage, pages, lastPageParam, allPageParams) {
        if (lastPage.length < pageSize) {
          return null;
        }
        return {
          offset: lastPageParam.offset + lastPage.length,
        };
      },
    };
  });

  return (
    <>
      <For each={query.data?.pages}>
        {(page) => (
          <For each={page}>
            {(entry) => (
              <Suspense
                fallback={
                  <h1>
                    <div class="animate-bounce">Loading</div>
                  </h1>
                }
              >
                {props.children(entry)}
              </Suspense>
            )}
          </For>
        )}
      </For>

      <Switch>
        <Match when={query.isFetchingNextPage}>
          <h1>
            <div class="animate-bounce">Loading</div>
          </h1>
        </Match>
        <Match when={query.hasNextPage}>
          <button onClick={() => query.fetchNextPage()}>More</button>
        </Match>
      </Switch>
    </>
  );
}
