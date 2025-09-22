import { useCurrentMatches, useNavigate, useParams } from "@solidjs/router";

export function useSetParams() {
  const currentParams = useParams();
  const navigate = useNavigate();
  const matches = useCurrentMatches();

  return (newParams: object) => {
    const params = {
      ...currentParams,
      ...newParams,
    };
    const segments = matches()
      .map((match) => match.route.originalPath)
      .join("")
      .split("/");

    const path = segments
      .map((seg) => {
        if (!seg.startsWith(":")) {
          return seg;
        }
        if (seg.endsWith("?")) {
          seg = seg.slice(0, -1);
        }
        return params[seg.slice(1)];
      })
      .join("/");

    navigate(path, {
      replace: true,
      scroll: false,
    });
  };
}
