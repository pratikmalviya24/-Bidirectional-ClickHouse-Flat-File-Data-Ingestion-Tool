describe('Flat File to ClickHouse Flow', () => {
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

  it('should successfully transfer data from Flat File to ClickHouse', () => {
    // Select Flat File as source
    cy.selectSource('file');

    // Upload test file
    cy.configureFile('test-data.csv');

    // Configure ClickHouse target
    cy.configureClickHouse(clickHouseConfig);

    // Select columns
    cy.selectColumns(['id', 'name', 'email']);

    // Wait for progress to complete
    cy.waitForProgress(100);

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should handle invalid file format', () => {
    cy.selectSource('file');

    // Upload invalid file
    cy.configureFile('invalid-file.txt');

    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle large file uploads', () => {
    cy.selectSource('file');

    // Upload large file
    cy.configureFile('large-data.csv');

    // Configure ClickHouse target
    cy.configureClickHouse(clickHouseConfig);

    // Select columns
    cy.selectColumns(['id', 'name', 'email']);

    // Wait for progress to complete
    cy.waitForProgress(100);

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
}); 