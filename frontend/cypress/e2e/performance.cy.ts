describe('Performance Testing with Large Datasets', () => {
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

  it('should handle large dataset import from ClickHouse', () => {
    const startTime = Date.now();

    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Select all columns
    cy.get('[data-testid="select-all-checkbox"]').click();
    cy.get('[data-testid="next-button"]').click();

    // Wait for progress to complete
    cy.waitForProgress(100);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log performance metrics
    cy.log(`Large dataset import completed in ${duration}ms`);

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should handle large file upload and processing', () => {
    const startTime = Date.now();

    cy.selectSource('file');
    cy.configureFile('large-dataset.csv');

    // Configure ClickHouse target
    cy.configureClickHouse(clickHouseConfig);

    // Select all columns
    cy.get('[data-testid="select-all-checkbox"]').click();
    cy.get('[data-testid="next-button"]').click();

    // Wait for progress to complete
    cy.waitForProgress(100);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log performance metrics
    cy.log(`Large file processing completed in ${duration}ms`);

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should maintain performance with concurrent operations', () => {
    // Start multiple operations simultaneously
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Start another operation in parallel
    cy.window().then((win) => {
      win.open('/');
    });

    // Select columns and proceed
    cy.get('[data-testid="select-all-checkbox"]').click();
    cy.get('[data-testid="next-button"]').click();

    // Wait for progress to complete
    cy.waitForProgress(100);

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should handle memory usage with large datasets', () => {
    cy.selectSource('clickhouse');
    cy.configureClickHouse(clickHouseConfig);

    // Monitor memory usage
    cy.window().then((win) => {
      const initialMemory = win.performance.memory;
      cy.log(`Initial memory usage: ${initialMemory.usedJSHeapSize}`);

      // Select all columns
      cy.get('[data-testid="select-all-checkbox"]').click();
      cy.get('[data-testid="next-button"]').click();

      // Wait for progress to complete
      cy.waitForProgress(100);

      const finalMemory = win.performance.memory;
      cy.log(`Final memory usage: ${finalMemory.usedJSHeapSize}`);
    });

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
}); 