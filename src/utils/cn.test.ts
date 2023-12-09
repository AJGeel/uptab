import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("should merge and concatenate class names", () => {
    const result = cn("class1", "class2", "class3");

    expect(result).toBe("class1 class2 class3");
  });

  it("should handle arrays of class names", () => {
    const result = cn(["class1", "class2"], "class3");

    expect(result).toBe("class1 class2 class3");
  });

  it("should handle falsy values", () => {
    const result = cn("class1", undefined, null, "class2", false, "class3");

    expect(result).toBe("class1 class2 class3");
  });

  it("should handle complex class name configurations", () => {
    const result = cn("class1", ["class2", "class3"], {
      class4: true,
      class5: false,
    });

    expect(result).toBe("class1 class2 class3 class4");
  });
});
