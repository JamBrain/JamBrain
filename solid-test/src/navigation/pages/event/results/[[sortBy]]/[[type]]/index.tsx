import { useParams } from "@solidjs/router";
import { createInfiniteQuery } from "@tanstack/solid-query";
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { GET } from "~/api/methods";
import { EventNode } from "~/api/types";
import GameTile from "~/components/game/GameTile";
import { useRootNode } from "~/context/PageContext";
import { useSetParams } from "~/lib/navigation";

function isRatedCategory(type: string) {
  return !["unfinished", "extra"].includes(type);
}

// TODO duplicate of results page
export default function Games() {
  const event = useRootNode<EventNode>(() => ({
    refetchOnMount: false,
  }));

  const grades = () =>
    event.data?.meta &&
    Object.keys(event.data.meta)
      .filter((key) => /^grade-\d{2}$/.test(key))
      .map((key) => ({
        key: `${key}-result`,
        value: event.data.meta[key].toLowerCase(),
        label: event.data.meta[key],
        optional: event.data.meta[`${key}-optional`] === "1",
        required: event.data.meta[`${key}-required`] === "1",
      }));

  const params = useParams();

  const [type, setType] = createSignal(params.type ?? "all");
  const [sortBy, setSortBy] = createSignal(params.sortBy);

  // TODO use resultsPublished
  const rated = () => isRatedCategory(type());

  // set sortBy to first grade if value is invalid
  createEffect(() => {
    if (
      rated() &&
      grades()?.length &&
      !grades().some((g) => g.value === sortBy())
    ) {
      setSortBy(grades()[0]?.value);
    }
  });

  // update sortBy when options change
  createEffect((prevRated) => {
    if (prevRated !== rated()) {
      setSortBy(rated() ? grades()?.[0]?.value : "smart");
    }
    return rated();
  }, rated());

  // update url based on filter
  const setParams = useSetParams();
  createEffect((initializing) => {
    if (sortBy() == null || type() == null) {
      return initializing;
    }
    // mimic behavior of current site
    if (!initializing) {
      setParams({
        sortBy: sortBy(),
        type: type(),
      });
    }
    return false;
  }, true);

  // TODO remove duplicates when using smart etc.
  const pageSize = 24;
  const queryType = () => (type() === "all" ? "compo+jam+extra" : type());
  const querySortBy = () =>
    rated() ? grades()?.find((g) => g.value == sortBy())?.key : sortBy();
  const games = createInfiniteQuery(() => ({
    queryKey: ["games", pageSize, event.data?.id, querySortBy(), queryType()],
    enabled:
      event.data?.id != null && querySortBy() != null && queryType() != null,
    async queryFn(args) {
      const offset = args.pageParam;
      const json = await GET(
        `/vx/node/feed/${event.data?.id}/${querySortBy()}+reverse+parent/item/game/${queryType()}?offset=${offset}&limit=${pageSize + 1}`,
      );

      return {
        edges: json.feed.slice(0, pageSize),
        nextCursor: json.feed.length > pageSize ? offset + pageSize : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }));

  return (
    <>
      <div class="bg-gray flex gap-2 p-2">
        <select value={type()} onChange={(e) => setType(e.target.value)}>
          <option value="all">All</option>
          <option value="jam">Jam</option>
          <option value="compo">Compo</option>
          <option value="extra">Extra</option>
          <option value="unfinished">Unfinished</option>
        </select>
        <Switch>
          {/* TODO can grades suspend? */}
          <Match when={rated() && grades() != null}>
            <select
              value={sortBy()}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <For each={grades()}>
                {(grade) => (
                  <option key={grade.key} value={grade.value}>
                    {grade.label}
                  </option>
                )}
              </For>
            </select>
          </Match>
          <Match when={!rated()}>
            <select
              value={sortBy()}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="smart">Smart</option>
              <option value="classic">Classic</option>
              <option value="danger">Danger</option>
              <option value="zero">Zero</option>
              <option value="feedback">Feedback</option>
              <option value="grade">Grade</option>
            </select>
          </Match>
        </Switch>
      </div>
      <div class="grid grid-cols-4 gap-2">
        {/* TODO suspends on fetchmore */}
        <Suspense>
          <For each={games.data?.pages}>
            {(page) => (
              <For each={page.edges}>
                {(game) => <GameTile game={game.id} />}
              </For>
            )}
          </For>
        </Suspense>
      </div>
      <Show when={games.hasNextPage}>
        <button
          onClick={() => {
            games.fetchNextPage();
          }}
          disabled={games.isFetching}
          class="justify-self-center"
        >
          {games.isFetchingNextPage ? "LOADING" : "MORE"}
        </button>
      </Show>
    </>
  );
}
