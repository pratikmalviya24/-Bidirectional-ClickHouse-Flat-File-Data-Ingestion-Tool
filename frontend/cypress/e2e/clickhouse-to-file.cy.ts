describe('ClickHouse to Flat File Flow', () => {
  const clickHouseConfig = {
    host: 'localhost',
    port: '9000',
    database: 'test_db',
    username: 'test_user',
    password: 'test_password',
  };

  beforeEach(() => {
    cy.login('admin', 'admin');
  });

  it('should successfully transfer data from ClickHouse to Flat File', () => {
    // Select ClickHouse as source
    cy.selectSource('clickhouse');

    // Configure ClickHouse connection
    cy.configureClickHouse(clickHouseConfig);

    // Select columns
    cy.selectColumns(['id', 'name', 'email']);

    // Wait for progress to complete
    cy.waitForProgress(100);

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should handle connection errors gracefully', () => {
    cy.selectSource('clickhouse');

    // Configure with invalid credentials
    cy.configureClickHouse({
      ...clickHouseConfig,
      password: 'wrong_password',
    });

    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should validate required fields in ClickHouse configuration', () => {
    cy.selectSource('clickhouse');

    // Try to connect without filling required fields
    cy.get('[data-testid="connect-button"]').click();

    // Verify validation messages
    cy.get('[data-testid="host-error"]').should('be.visible');
    cy.get('[data-testid="port-error"]').should('be.visible');
    cy.get('[data-testid="database-error"]').should('be.visible');
  });
}); 