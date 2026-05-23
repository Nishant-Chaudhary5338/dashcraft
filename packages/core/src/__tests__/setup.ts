import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;
  private _elements: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element): void {
    this._elements.push(element);
    // Simulate element is intersecting
    this.callback(
      [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
      this
    );
  }

  unobserve(element: Element): void {
    this._elements = this._elements.filter((el) => el !== element);
  }

  disconnect(): void {
    this._elements = [];
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver for jsdom
class MockResizeObserver {
  private callback: ResizeObserverCallback;
  private _elements: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element): void {
    this._elements.push(element);
    // Simulate initial size
    this.callback(
      [{ contentRect: { width: 300, height: 200 } } as ResizeObserverEntry],
      this
    );
  }

  unobserve(element: Element): void {
    this._elements = this._elements.filter((el) => el !== element);
  }

  disconnect(): void {
    this._elements = [];
  }
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock requestAnimationFrame
Object.defineProperty(globalThis, "requestAnimationFrame", {
  writable: true,
  configurable: true,
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
});

Object.defineProperty(globalThis, "cancelAnimationFrame", {
  writable: true,
  configurable: true,
  value: (id: number) => clearTimeout(id),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(globalThis, "sessionStorage", {
  writable: true,
  value: { ...localStorageMock },
});

// Suppress console.error in tests unless DEBUG is set
if (!process.env.DEBUG) {
  const originalError = console.error;
  beforeEach(() => {
    console.error = (...args: unknown[]) => {
      // Allow React errors to surface
      if (typeof args[0] === "string" && args[0].includes("[DashCraft]")) {
        return;
      }
      originalError(...args);
    };
  });
}
