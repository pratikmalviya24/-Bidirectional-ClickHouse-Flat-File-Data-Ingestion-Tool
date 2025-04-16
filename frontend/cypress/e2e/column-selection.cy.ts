describe('Column Selection and Error Scenarios', () => {
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

  it('should allow selecting and deselecting columns', () => {
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Select all columns
    cy.get('[data-testid="select-all-checkbox"]').click();

    // Verify all columns are selected
    cy.get('[data-testid^="column-checkbox-"]').each(($checkbox) => {
      expect($checkbox).to.be.checked;
    });

    // Deselect all columns
    cy.get('[data-testid="select-all-checkbox"]').click();

    // Verify all columns are deselected
    cy.get('[data-testid^="column-checkbox-"]').each(($checkbox) => {
      expect($checkbox).not.to.be.checked;
    });
  });

  it('should prevent proceeding without selecting columns', () => {
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Try to proceed without selecting columns
    cy.get('[data-testid="next-button"]').click();

    // Verify error message
    cy.get('[data-testid="column-selection-error"]').should('be.visible');
  });

  it('should show column preview', () => {
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Click preview button
    cy.get('[data-testid="preview-button"]').click();

    // Verify preview data is shown
    cy.get('[data-testid="preview-table"]').should('be.visible');
  });

  it('should handle network errors during column selection', () => {
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Intercept and fail the column fetch request
    cy.intercept('GET', '/api/columns', {
      statusCode: 500,
      body: { error: 'Network error' },
    });

    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle invalid column selection', () => {
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Select invalid column
    cy.get('[data-testid="column-checkbox-invalid"]').click();

    // Try to proceed
    cy.get('[data-testid="next-button"]').click();

    // Verify error message
    cy.get('[data-testid="invalid-column-error"]').should('be.visible');
  });
}); 