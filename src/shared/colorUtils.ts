function parseAlpha(color: string): number {
  const rgbaMatch = color.match(/rgba?\(([^)]+)\)/i);
  if (rgbaMatch) {
    const parts = rgbaMatch[1].split(",").map((p) => p.trim());
    if (parts.length === 4) {
      return parseFloat(parts[3]); // rgba with alpha
    } else {
      return 1; // rgb, no alpha
    }
  }

  const hslaMatch = color.match(/hsla?\(([^)]+)\)/i);
  if (hslaMatch) {
    const parts = hslaMatch[1].split(",").map((p) => p.trim());
    if (parts.length === 4) {
      return parseFloat(parts[3]); // hsla
    } else {
      return 1; // hsl, no alpha
    }
  }

  const oklchMatch = color.match(/oklch\(([^)]+)\)/i);
  if (oklchMatch) {
    const parts = oklchMatch[1].split(" ");
    const last = parts[parts.length - 1];
    const alpha = parseFloat(last);
    return isNaN(alpha) ? 1 : alpha;
  }

  // Default: if color is hex or unknown, assume full opacity
  return 1;
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function colorWithPreservedAlpha(
  originalColor: string,
  newColor: string
): string {
  const alpha = parseAlpha(originalColor);

  let r = 0,
    g = 0,
    b = 0;

  if (newColor.startsWith("#")) {
    [r, g, b] = hexToRgb(newColor);
  } else if (newColor.startsWith("rgb")) {
    const parts = newColor
      .match(/rgba?\(([^)]+)\)/i)?.[1]
      .split(",")
      .map((p) => parseFloat(p.trim())) ?? [0, 0, 0];
    [r, g, b] = parts;
  } else {
    // If unsupported (like oklch), fallback
    console.warn("Unsupported color format for newColor:", newColor);
    return newColor;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export { parseAlpha, hexToRgb, colorWithPreservedAlpha };
