function joinPath(a: string, b: string) {
  const baseUrl = "https://example.com";
  const path = new URL(b, `${baseUrl}${a}/`).href.slice(baseUrl.length);
  if (path.endsWith("/") && path !== "/") return path.slice(0, -1);
  return path;
}

let nextNodeId = 2;

export function defineNode(
  getDef: (props: { getId(path: string): number }) => {
    node: any;
    comments?: {
      author: number;
      created: string;
      modified: string;
      body: string;
    }[];
    theme?: {
      allowed: number[];
      pages: number;
      names: Record<string, string>;
      lists: Record<
        string,
        {
          id: number;
          node: number;
          idea: number;
          theme: string;
        }[]
      >;
    };
    stats?: {
      signups: number;
      authors: number;
      unpublished: number;
      game: number;
      craft: number;
      tool: number;
      demo: number;
      jam: number;
      compo: number;
      warmup: number;
      extra: number;
      release: number;
      unfinished: number;
      "grade-20-plus": number;
      "grade-15-20": number;
      "grade-10-15": number;
      "grade-5-10": number;
      "grade-0-5": number;
      "grade-0-only": number;
      timestamp: string;
    };
  },
) {
  return (localPath: string, pathToIdMap: Map<string, number>) => {
    function getId(path: string) {
      const absolutePath = joinPath(localPath, path);
      if (absolutePath === "/") return 1;

      if (!pathToIdMap.has(absolutePath)) {
        pathToIdMap.set(absolutePath, nextNodeId++);
      }
      return pathToIdMap.get(absolutePath)!;
    }

    const def = getDef({ getId });

    const segments = localPath.split("/").slice(1);
    // getting [0] for "/" is intended here
    const parents = segments.map((_, i) =>
      getId(new Array(segments.length - i).fill("..").join("/")),
    );

    return {
      ...def,
      node: {
        id: getId("."),
        parent: parents.at(-1) ?? 0,
        _superparent: parents.at(-2) ?? 0,
        path: localPath === "/" ? "/root" : localPath,
        parents,
        ...def.node,
      },
    };
  };
}
