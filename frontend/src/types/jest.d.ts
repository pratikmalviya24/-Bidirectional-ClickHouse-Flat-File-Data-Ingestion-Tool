import '@testing-library/jest-dom';

declare global {
  namespace NodeJS {
    interface Global {
      describe: jest.Describe;
      it: jest.It;
      expect: jest.Expect;
    }
  }
} 