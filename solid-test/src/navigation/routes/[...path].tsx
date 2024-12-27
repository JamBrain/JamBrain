import {
  createMemoryHistory,
  MemoryRouter,
  RouteDefinition,
  useNavigate,
  useParams,
} from "@solidjs/router";
// import { createBranches, getRouteMatches } from "@solidjs/router/dist/routing";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, useQueryClient } from "@tanstack/solid-query";
import { createEffect, createResource, Show } from "solid-js";
import { fetchPath } from "~/api/getPath";
import { PageContext } from "~/context/PageContext";

export const route = {
  async preload({ params }) {
    const url = `/${params.path}`;
    const rootNode = await getRootNodeAtPath(url);

    // TODO an API to preload a child page here doesn't seem to be available
    // const pageUrl = url.replace(rootNode.path, rootNode.type);
    // const preload = usePreloadRoute();
    // preload(pageUrl);
  },
} satisfies RouteDefinition;

export default function Path() {
  const params = useParams();

  const [node] = createResource(() => `/${params.path}`, getRootNodeAtPath);

  return (
    // keep page state if node does not change
    <Show when={node()?.id} keyed>
      <PageRouter node={node} path={params.path} />
    </Show>
  );
}

const Pages = () =>
  (FileRoutes() as RouteDefinition[])
    .filter((route) => route.path.startsWith("/pages"))
    .map((route) => ({
      ...route,
      path: route.path.slice("/pages".length),
    }));

// WIP
function checkPageExists(path: string[], routes: RouteDefinition[]): boolean {
  return routes.some((route) => {
    if (route.path == "/") {
      return path.length === 1 && path[0] === "";
    }
    const routePath: string[] = route.path!.split("/");
    // does route match?
    for (let i = 0; i < routePath.length; i++) {
      const seg = routePath[i];
      if (seg.startsWith("*")) {
        // TODO not implemented yet
        return false;
      }
      if (seg == path[i]) {
        continue;
      }
      if (seg.startsWith(":") && path[i] != null) {
        continue;
      }
      if (seg.endsWith("?") && path[i] == null) {
        // TODO not checked if solid routers implementation is greedy
        continue;
      }
      // routes sometimes end with /
      if (seg === "" && i === routePath.length - 1) {
        continue;
      }
      return false;
    }
    // does a matching child exist?
    if (!route.children) {
      return true; // TODO ok?
    }
    const restPath = ["", ...path.slice(routePath.length)];
    if (!Array.isArray(route.children)) {
      return checkPageExists(restPath, [route.children]);
    }
    return checkPageExists(restPath, route.children);
  });
}

function walkCacheUp(path: string, queryClient: QueryClient) {
  // walk up cache to see if node is cached
  const segments = path.split("/");
  while (segments.length > 1) {
    const data = queryClient.getQueryData(["path", segments.join("/")]);
    // TODO ignore 404 page
    if (data) {
      if (
        checkPageExists(
          path.replace(data.path, `/${data.type}`).split("/"),
          Pages(),
        )
      ) {
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

function PageRouter(props: { path: string; node: any }) {
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
      // explicitLinks // TODO?
      root={(props) => {
        return (
          <PageContext.Provider value={node()?.path}>
            {props.children}
          </PageContext.Provider>
        );
      }}
    >
      {Pages()}
    </MemoryRouter>
  );
}
