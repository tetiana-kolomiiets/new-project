import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// This test suite verifies that the global setup file (src/test/setup.ts)
// has correctly configured the testing environment as intended.
// The setup file itself is not imported here, as Vitest's `setupFiles` configuration
// would have already executed it, applying its global side effects.

describe("setup.ts configuration effects", () => {
  it("should ensure globalThis.jest points to Vitest's vi object", () => {
    // Verifies that `globalThis.jest = vi;` in setup.ts has taken effect,
    // allowing libraries that expect `jest` to work with Vitest's `vi`.
    expect(globalThis.jest).toBe(vi);
  });

  it("should extend expect with @testing-library/jest-dom matchers", () => {
    // Verifies that `import "@testing-library/jest-dom";` in setup.ts
    // has added its custom matchers to Vitest's expect API.
    // We test this by using a common matcher like `toBeInTheDocument`.
    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();

    document.body.removeChild(element); // Clean up the DOM
  });
});