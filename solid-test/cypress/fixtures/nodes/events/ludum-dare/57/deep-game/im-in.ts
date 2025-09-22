import { defineNode } from "../../../../../../support/utils";

export default defineNode(({ getId }) => ({
  node: {
    author: getId("/users/pov"),
    type: "post",
    subtype: "",
    subsubtype: "",
    published: "2018-08-10T08:56:30Z",
    created: "2018-08-10T08:27:01Z",
    modified: "2018-08-10T11:09:04Z",
    _trust: 5,
    version: 300915,
    slug: "im-in",
    name: "I'm in!",
    body: "Yes, I'm in!",
    scope: "public",
    "node-timestamp": "2018-08-10T08:56:30Z",
    meta: [],
    files: [],
    "files-timestamp": 0,
    love: 3,
    "love-timestamp": "2018-08-10T11:09:04Z",
    comments: 0,
  },
  comments: [
    {
      author: getId("/users/pov"),
      body: "Neat post!",
      created: "2025-04-07T05:30:59Z",
      modified: "2025-04-07T05:30:59Z",
    },
  ],
}));
