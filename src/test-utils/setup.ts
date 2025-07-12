import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';

// Mock matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage and sessionStorage
const createStorageMock = () => {
  const storage = new Map();
  return {
    getItem: vi.fn((key) => storage.get(key) || null),
    setItem: vi.fn((key, value) => storage.set(key, value)),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    get length() {
      return storage.size;
    },
    key: vi.fn((index) => Array.from(storage.keys())[index] || null),
  };
};

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
  configurable: true,
});

// Mock URL APIs for file operations
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  },
});

// Mock ResizeObserver for Mantine components
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  value: MockResizeObserver,
});

// Mock scrollIntoView for better UX testing
HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock getComputedStyle for style-related tests
Object.defineProperty(window, 'getComputedStyle', {
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(''),
    setProperty: vi.fn(),
    removeProperty: vi.fn(),
  })),
});

// Mock IntersectionObserver for viewport-related functionality
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
});

// Mock document.execCommand for copy/paste functionality
Object.defineProperty(document, 'execCommand', {
  value: vi.fn().mockReturnValue(true),
});

// Mock Clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
  configurable: true,
});

// Mock for date-fns locale if needed
vi.mock('date-fns/locale', () => ({
  enUS: {},
  ja: {},
}));

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  vi.clearAllMocks();

  // Clear storage mocks
  localStorageMock.clear();
  sessionStorageMock.clear();

  // Reset console mocks
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
Object.assign(globalThis, {
  testUtils: {
    // Helper to simulate localStorage data
    setLocalStorageData: (key: string, value: unknown) => {
      localStorageMock.setItem(key, JSON.stringify(value));
    },

    // Helper to get localStorage data
    getLocalStorageData: (key: string) => {
      const value = localStorageMock.getItem(key);
      return value ? JSON.parse(value) : null;
    },

    // Helper to simulate different screen sizes
    setScreenSize: (width: number, height = 768) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
      });
      window.dispatchEvent(new Event('resize'));
    },
  },
});

// Types for global test utilities
declare global {
  var testUtils: {
    setLocalStorageData: (key: string, value: unknown) => void;
    getLocalStorageData: (key: string) => unknown;
    setScreenSize: (width: number, height?: number) => void;
  };
}
