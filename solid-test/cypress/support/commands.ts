/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
///
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//     visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { type defineNode } from "./utils";

function ensureArray<T>(value: T[]): T[];
function ensureArray<T>(value: T): T[];
function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

Cypress.Commands.add("mockApi", () => {
  cy.task<string[]>("getNodes")
    .then((paths) =>
      Promise.all(
        paths.map((p) =>
          Promise.all([
            p === "/root" ? "/" : p,
            import(`../fixtures/nodes${p}`),
          ] as const),
        ),
      ),
    )
    .then((modules) =>
      modules.map(
        (m) => [m[0], m[1].default as ReturnType<typeof defineNode>] as const,
      ),
    )
    .then((fixturesList) => {
      const pathToIdMap = new Map<string, number>();
      const idToPathMap = new Map<number, string>();
      const idToNodeDefMap = new Map<
        number,
        ReturnType<ReturnType<typeof defineNode>>
      >();

      fixturesList.forEach(([path, defFn]) => {
        const def = defFn(path, pathToIdMap);
        const id = def.node.id;
        idToPathMap.set(id, path);
        idToNodeDefMap.set(id, def);
      });

      // WHAT
      cy.intercept("GET", "https://api.ldjam.com/vx/node2/what/1", (req) => {
        const root = idToNodeDefMap.get(1)!.node;
        req.reply({
          body: {
            root,
            featured: idToNodeDefMap.get(+root.meta.featured)?.node,
          },
        });
      }).as("what:root");

      // WALK
      const walkPath = "https://api.ldjam.com/vx/node2/walk/1";
      cy.intercept("GET", `${walkPath}/**`, (req) => {
        const path = req.url
          .slice(walkPath.length, `${req.url}?`.indexOf("?"))
          .split("/");
        const query = Object.keys(req.query);

        do {
          const nodeId = pathToIdMap.get(path.join("/"));
          if (nodeId) {
            const node = idToNodeDefMap.get(nodeId)!.node;
            req.reply({
              body: {
                node_id: nodeId,
                node: [
                  query.includes("node") && node,
                  query.includes("author") &&
                    idToNodeDefMap.get(node.author)?.node,
                  query.includes("parent") &&
                    idToNodeDefMap.get(node.parent)?.node,
                  query.includes("superparent") &&
                    idToNodeDefMap.get(node._superparent)?.node,
                ].filter(Boolean),
              },
            });
            break;
          }
        } while (path.pop() != null);
      }).as("walk");
      fixturesList.forEach(([path]) => {
        cy.intercept("GET", `${walkPath}${path}?*`).as(`walk:${path}`);
      });

      // GET
      const getPath = "https://api.ldjam.com/vx/node2/get";
      cy.intercept("GET", `${getPath}/**`, (req) => {
        const ids = req.url
          .slice(getPath.length + 1, `${req.url}?`.indexOf("?"))
          .split("+");
        const query = Object.keys(req.query);
        req.reply({
          body: {
            node: ids.flatMap((id) => {
              const node = idToNodeDefMap.get(+id)?.node;
              return [
                node,
                query.includes("author") &&
                  idToNodeDefMap.get(node?.author)?.node,
                query.includes("parent") &&
                  idToNodeDefMap.get(node?.parent)?.node,
                query.includes("superparent") &&
                  idToNodeDefMap.get(node?._superparent)?.node,
              ].filter(Boolean);
            }),
          },
        });
      }).as("get");
      pathToIdMap.forEach((id, path) => {
        cy.intercept("GET", `${getPath}/${id}`).as(`get:${path}`);
        cy.intercept("GET", `${getPath}/${id}+**`).as(`get:${path}`);
        cy.intercept("GET", `${getPath}/**+${id}+**`).as(`get:${path}`);
        cy.intercept("GET", `${getPath}/**+${id}`).as(`get:${path}`);
      });
      console.log(idToNodeDefMap);

      // FEED
      const feedPath = "https://api.ldjam.com/vx/node/feed/";
      idToNodeDefMap.forEach((def, id) => {
        cy.intercept("GET", `${feedPath}/${id}/**`, (req) => {
          const [query, type, subtype, subsubtype] = req.url
            .slice(`${feedPath}/${id}/`.length, `${req.url}?`.indexOf("?"))
            .split("/");

          const field = query
            .split("+")
            .find((entry) => ["parent", "author", "authors"].includes(entry));
          // TODO support sort and reverse

          req.reply({
            body: {
              feed: idToNodeDefMap
                .values()
                .map(({ node }) => node)
                .filter(
                  (node) =>
                    field == null || ensureArray(node[field]).includes(id),
                )
                .filter(
                  (node) => type == null || type.split("+").includes(node.type),
                )
                .filter(
                  (node) =>
                    subtype == null ||
                    subtype.split("+").includes(node.subtype),
                )
                .filter(
                  (node) =>
                    subsubtype == null ||
                    subsubtype.split("+").includes(node.subsubtype),
                )
                .drop(+(req.query.offset ?? "0"))
                .take(+(req.query.limit ?? "10"))
                .toArray(),
            },
          });
        }).as(`feed:${idToPathMap.get(id)}`);
      });

      // COMMENTS
      idToNodeDefMap.forEach((def, id) => {
        cy.intercept(
          "GET",
          `https://api.ldjam.com/vx/comment/getbynode/${id}`,
          (req) => {
            req.reply({
              body: {
                comment: def.comments,
              },
            });
          },
        ).as(`comments:${idToPathMap.get(id)}`);
      });

      // THEME
      idToNodeDefMap.forEach((def, id) => {
        cy.intercept(
          "GET",
          `https://api.ldjam.com/vx/theme/list/get/${id}`,
          (req) => {
            req.reply({
              body: def.theme,
            });
          },
        ).as(`theme:${idToPathMap.get(id)}`);
      });

      // STATS
      idToNodeDefMap.forEach((def, id) => {
        cy.intercept("GET", `https://api.ldjam.com/vx/stats/${id}`, (req) => {
          req.reply({
            body: {
              id,
              stats: def.stats,
            },
          });
        }).as(`stats:${idToPathMap.get(id)}`);
      });
    });
});

declare global {
  // Augment the Cypress Chainable interface for TypeScript
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mockApi(): Chainable<void>;
    }
  }
}
