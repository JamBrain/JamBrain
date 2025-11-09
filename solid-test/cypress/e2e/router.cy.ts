describe("router", () => {
  it("works for root page", function () {
    cy.mockApi();
    cy.visit("/");

    cy.contains("Hey folks! We're back again for 2025!");
    cy.contains("Yes, I'm in!");
  });

  it("works for event paths", function () {
    cy.mockApi();
    cy.visit("/events/ludum-dare/57");

    cy.contains("Hey folks! We're back again for 2025!");
  });

  it("works for node subpaths", function () {
    cy.mockApi();
    cy.visit("/events/ludum-dare/57/theme");

    cy.contains("Plant the seed");
  });

  it("works for game paths", function () {
    cy.mockApi();
    cy.visit("/events/ludum-dare/57/deep-game");

    cy.contains("A deep game.");
  });

  it("works for post paths", function () {
    cy.mockApi();
    cy.visit("/events/ludum-dare/57/deep-game/im-in");

    cy.contains("Yes, I'm in!");
  });
});
