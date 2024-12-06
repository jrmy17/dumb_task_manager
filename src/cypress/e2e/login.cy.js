describe("Test de connexion", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("devrait afficher la page d'accueil avec les liens de connexion", () => {
    cy.get('header a[href="/login"]').should("be.visible");
    cy.get('header a[href="/register"]').should("be.visible");
  });

  it("devrait permettre la connexion et afficher le nom d'utilisateur", () => {
    cy.get('header a[href="/login"]').first().click();

    cy.url().should("include", "/login");

    cy.get("#username").type("admin");
    cy.get("#password").type("fezq265e1rgAZZFS45$&d5az");

    cy.get("form").submit();

    cy.url().should("eq", Cypress.config().baseUrl + "/");

    cy.get(".text-gray-700").should("contain", "Bienvenue, admin");

    cy.get('a[href="/tasks"]').should("be.visible");
    cy.get('a[href="/logout"]').should("be.visible");
    cy.get('header a[href="/login"]').should("not.exist");
    cy.get('header a[href="/register"]').should("not.exist");
  });
});
