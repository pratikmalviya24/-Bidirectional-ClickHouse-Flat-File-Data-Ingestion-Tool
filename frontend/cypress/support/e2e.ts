import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      selectSource(sourceType: 'clickhouse' | 'file'): Chainable<void>;
      configureClickHouse(config: {
        host: string;
        port: string;
        database: string;
        username: string;
        password: string;
      }): Chainable<void>;
      configureFile(filePath: string): Chainable<void>;
      selectColumns(columns: string[]): Chainable<void>;
      waitForProgress(progress: number): Chainable<void>;
    }
  }
} 