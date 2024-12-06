describe("Test des tâches", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('header a[href="/login"]').first().click();
    cy.get("#username").type("admin");
    cy.get("#password").type("admin123");
    cy.get("form").submit();
  });

  it("devrait permettre de créer une nouvelle tâche", () => {
    cy.get('a[href="/tasks"]').first().click();

    cy.get("button").contains("Nouvelle tâche").click();

    cy.get("#title").type("Tâche de test");
    cy.get("#description").type("Description de la tâche de test");
    cy.get("#completion").check();

    cy.get("button").contains("Ajouter").click();

    cy.get(".grid").should("contain", "Tâche de test");
    cy.get(".grid").should("contain", "Description de la tâche de test");
  });

  it("devrait permettre de décocher une tâche terminée", () => {
    cy.get('a[href="/tasks"]').first().click();

    cy.get(".grid")
      .contains("Tâche de test")
      .should("have.class", "line-through")
      .and("have.class", "text-gray-500");

    cy.get(".grid")
      .contains("Tâche de test")
      .parents(".bg-white")
      .within(() => {
        cy.get('input[type="checkbox"]').should("be.checked").click();
      });

    cy.get(".grid")
      .contains("Tâche de test")
      .should("not.have.class", "line-through")
      .and("not.have.class", "text-gray-500");

    cy.get(".grid")
      .contains("Tâche de test")
      .parents(".bg-white")
      .should("not.have.class", "border-green-500");
  });

  it("devrait permettre de supprimer une tâche", () => {
    cy.get('a[href="/tasks"]').first().click();

    cy.get(".grid")
      .contains("Tâche de test")
      .parents(".bg-white")
      .within(() => {
        cy.get("a").contains("Supprimer").click();
      });

    cy.on("window:confirm", () => true);

    cy.get(".grid").should("not.contain", "Tâche de test");
  });
});
