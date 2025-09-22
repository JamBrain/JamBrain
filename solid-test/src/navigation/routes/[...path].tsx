import {
  createMemoryHistory,
  MemoryRouter,
  RouteDefinition,
  RoutePreloadFuncArgs,
  useNavigate,
  useParams,
} from "@solidjs/router";
// TODO this is too hacky!
import {
  createBranches,
  getRouteMatches,
} from "../../../node_modules/@solidjs/router/dist/routing";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, useQueryClient } from "@tanstack/solid-query";
import {
  createEffect,
  Resource,
  createResource,
  Show,
  getOwner,
  runWithOwner,
  useContext,
} from "solid-js";
import { type Node } from "~/api/types";
import { fetchPath } from "~/api/getPath";
import { PageContext } from "~/context/PageContext";
import { useViewTransition } from "~/lib/viewTransition";

const Pages = () =>
  (FileRoutes() as RouteDefinition[])
    .filter((route) => route.path.startsWith("/pages"))
    .map((route) => ({
      ...route,
      path: route.path.slice("/pages".length),
    }));

const branches = () => createBranches(Pages());

async function preload({ params, location, intent }: RoutePreloadFuncArgs) {
  const owner = getOwner();

  const url = `/${params.path}`;
  const rootNode = await getRootNodeAtPath(url);

  // TODO is replace ok?
  const pageUrl = url.replace(rootNode.path, rootNode.type);
  const matches = getRouteMatches(branches(), pageUrl);

  await Promise.all(
    matches.flatMap((match) => [
      // fetch component
      match.route.component?.preload(),
      // run preload function
      runWithOwner(owner, () => {
        const pageContext = useContext(PageContext);
        // set pageContext for preload call
        pageContext[1]({
          path: rootNode.path,
          id: rootNode.id,
        });
        const promise = match.route.preload?.({
          params: match.params,
          location: Object.assign(
            {
              pathname: location.pathname.slice("/routes".length),
            },
            location,
          ),
          intent,
        });
        // clear pageContext
        pageContext[1](null);
        return promise;
      }),
    ]),
  );
}

export const route = {
  preload,
} satisfies RouteDefinition;

export default function Path() {
  const [renderBlocker] = useViewTransition(preload);

  const params = useParams();
  const [node] = createResource(() => `/${params.path}`, getRootNodeAtPath);

  return (
    <>
      {renderBlocker()}
      {/* keep page state if node does not change */}
      <Show when={node()?.id} keyed>
        <PageRouter node={node} path={params.path} />
      </Show>
    </>
  );
}

function walkCacheUp(path: string, queryClient: QueryClient) {
  // walk up cache to see if node is cached
  const segments = path.split("/");
  while (segments.length > 1) {
    const data: Node | undefined = queryClient.getQueryData([
      "path",
      segments.join("/"),
    ]);
    if (data) {
      const matches = getRouteMatches(
        branches(),
        path.replace(data.path, `/${data.type}`),
      );
      if (matches[0].route.pattern !== "/*404") {
        return data;
      }
    }
    segments.pop();
  }
  return null;
}

async function getRootNodeAtPath(path: string) {
  const queryClient = useQueryClient();

  const cachedNode = walkCacheUp(path, queryClient);
  if (cachedNode) {
    // TODO check if cached node matches a path
    return cachedNode;
  }

  return queryClient.fetchQuery({
    queryKey: ["path", path],
    async queryFn() {
      return fetchPath(path, {
        author: true,
        parent: true,
        superParent: true,
      });
    },
  });
}

function PageRouter(props: { path: string; node: Resource<Node> }) {
  const path = () => `/${props.path}`;
  const node = () => props.node();

  const history = createMemoryHistory();
  createEffect(() => {
    history.set({
      value: path(),
    });
  });
  // the above effect does not get called immediately,
  // causing 404 to be rendered for a short moment
  history.set({
    value: path(),
  });

  // when navigate is used from within a page
  const navigate = useNavigate();
  history.listen((url) => {
    if (url !== path()) {
      navigate(url.replace(`/${node()!.type}`, node()!.path), {
        replace: true,
        scroll: false,
      });
    }
  });

  return (
    <MemoryRouter
      history={history}
      transformUrl={(url) => url.replace(node()!.path, node()!.type)}
      // would preload 404 path
      preload={false}
      // explicitLinks // TODO?
      root={(props) => {
        return (
          <PageContext.Provider
            value={[() => ({ path: node()?.path, id: node()?.id })]}
          >
            {props.children}
          </PageContext.Provider>
        );
      }}
    >
      {Pages()}
    </MemoryRouter>
  );
}
