import { describe, it, expect } from "vitest";
import {
  cn,
  animationPresets,
  getAnimationPreset,
  springToCss,
  getCssTransition,
  createPersistenceAdapter,
  STORAGE_KEY_PREFIX,
  DEFAULT_WIDGET_SIZE,
  DEFAULT_WIDGET_POSITION,
} from "../../utils/index";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  it("should deduplicate tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("constants", () => {
  it("should export STORAGE_KEY_PREFIX", () => {
    expect(STORAGE_KEY_PREFIX).toBe("dashcraft-layout-");
  });

  it("should export DEFAULT_WIDGET_SIZE", () => {
    expect(DEFAULT_WIDGET_SIZE).toEqual({ width: 300, height: 200 });
  });

  it("should export DEFAULT_WIDGET_POSITION", () => {
    expect(DEFAULT_WIDGET_POSITION).toEqual({ x: 0, y: 0 });
  });
});

describe("animationPresets", () => {
  it("should have all preset keys", () => {
    expect(animationPresets).toHaveProperty("spring");
    expect(animationPresets).toHaveProperty("snappy");
    expect(animationPresets).toHaveProperty("gentle");
    expect(animationPresets).toHaveProperty("tween");
    expect(animationPresets).toHaveProperty("bounce");
    expect(animationPresets).toHaveProperty("stiff");
    expect(animationPresets).toHaveProperty("slow");
  });

  it("should return spring preset via getAnimationPreset", () => {
    const preset = getAnimationPreset("spring");
    expect(preset.type).toBe("spring");
    expect(preset.stiffness).toBe(400);
    expect(preset.damping).toBe(25);
  });

  it("should return tween preset", () => {
    const preset = getAnimationPreset("tween");
    expect(preset.type).toBe("tween");
    expect(preset.duration).toBe(0.2);
  });
});

describe("springToCss", () => {
  it("should return cubic-bezier string", () => {
    const css = springToCss();
    expect(css).toMatch(/^cubic-bezier\(/);
  });

  it("should use defaults when no args", () => {
    const css1 = springToCss();
    const css2 = springToCss(400, 25);
    expect(css1).toBe(css2);
  });
});

describe("getCssTransition", () => {
  it("should return CSS transition string", () => {
    const transition = getCssTransition("spring");
    expect(transition).toMatch(/^all .+s cubic-bezier/);
  });

  it("should accept custom properties", () => {
    const transition = getCssTransition("spring", "transform, opacity");
    expect(transition).toMatch(/^transform, opacity .+s cubic-bezier/);
  });

  it("should accept custom duration", () => {
    const transition = getCssTransition("tween", "all", 0.5);
    expect(transition).toContain("0.5s");
  });
});

describe("createPersistenceAdapter", () => {
  it("should return localStorage adapter by default", () => {
    const adapter = createPersistenceAdapter();
    expect(adapter.getItem).toBeInstanceOf(Function);
    expect(adapter.setItem).toBeInstanceOf(Function);
    expect(adapter.removeItem).toBeInstanceOf(Function);
  });

  it("should return sessionStorage adapter when specified", () => {
    const adapter = createPersistenceAdapter("sessionStorage");
    expect(adapter.getItem).toBeInstanceOf(Function);
    expect(adapter.setItem).toBeInstanceOf(Function);
    expect(adapter.removeItem).toBeInstanceOf(Function);
  });
});
