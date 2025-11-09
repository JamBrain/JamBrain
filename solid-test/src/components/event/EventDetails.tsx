import getNode, { EventNode, NodeId } from "~/api/getNode";

const userLocale = navigator.languages[0];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
});

const timeFormat = new Intl.DateTimeFormat(userLocale, {
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

export default function EventDetails(props: { event: NodeId<EventNode> }) {
  const node = getNode(() => ({
    id: props.event,
  }));

  // TODO handle invalid dates
  const start = () => new Date(node.data?.meta?.["event-start"]);
  const end = () => new Date(node.data?.meta?.["event-end"]);

  return (
    <div>
      {/* TODO theme undefined */}
      <div>
        Theme: <strong>{node.data?.meta?.["event-theme"]}</strong>
      </div>
      <div>{node.data && dateFormat.formatRange(start(), end())}</div>
      <div>
        Starts at {/* TOOD check solid */}
        <time
          dateTime={node.data?.meta?.["event-start"]}
          title={start.toString()}
        >
          {node.data && strongifyTime(timeFormat.formatToParts(start()))}
        </time>
      </div>
    </div>
  );
}

function strongifyTime(time: Intl.DateTimeFormatPart[]) {
  const result = [];
  let nextEntry = "";
  let literal = "";
  let wasStrong = false;
  for (const part of time) {
    if (part.type === "literal") {
      literal += part.value;
      continue;
    }
    const isStrong = part.type !== "timeZoneName";
    if (isStrong !== wasStrong) {
      if (wasStrong) {
        result.push(<strong>{nextEntry}</strong>);
      } else {
        result.push(nextEntry + literal);
        literal = "";
      }
      nextEntry = "";
    }
    nextEntry += literal + part.value;
    literal = "";
    wasStrong = isStrong;
  }
  if (wasStrong) {
    result.push(<strong>{nextEntry}</strong>);
    result.push(literal);
  } else {
    result.push(nextEntry + literal);
  }
  return result;
}
