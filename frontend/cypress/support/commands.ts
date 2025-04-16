Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add('selectSource', (sourceType: 'clickhouse' | 'file') => {
  cy.visit('/');
  cy.get(`[data-testid="${sourceType}-button"]`).click();
});

Cypress.Commands.add('configureClickHouse', (config) => {
  cy.get('[data-testid="host-input"]').type(config.host);
  cy.get('[data-testid="port-input"]').type(config.port);
  cy.get('[data-testid="database-input"]').type(config.database);
  cy.get('[data-testid="username-input"]').type(config.username);
  cy.get('[data-testid="password-input"]').type(config.password);
  cy.get('[data-testid="connect-button"]').click();
});

Cypress.Commands.add('configureFile', (filePath) => {
  cy.get('[data-testid="file-input"]').attachFile(filePath);
  cy.get('[data-testid="upload-button"]').click();
});

Cypress.Commands.add('selectColumns', (columns) => {
  columns.forEach((column) => {
    cy.get(`[data-testid="column-checkbox-${column}"]`).click();
  });
  cy.get('[data-testid="next-button"]').click();
});

Cypress.Commands.add('waitForProgress', (progress) => {
  cy.get('[data-testid="progress-bar"]').should('have.attr', 'aria-valuenow', progress.toString());
}); 