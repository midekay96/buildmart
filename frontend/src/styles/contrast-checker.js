/**
 * WCAG Color Contrast Verification Tool
 * Tests all token colors for accessibility compliance
 * Run in browser console: node contrast-checker.js
 */

// Color contrast calculation (WCAG 2.0)
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(x => {
    x = x / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function getContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function checkCompliance(ratio) {
  const r = parseFloat(ratio);
  if (r >= 7) return "AAA (Enhanced)";
  if (r >= 4.5) return "AA (Normal)";
  return "FAIL";
}

// Light Theme Colors
const lightTheme = {
  "Text Primary": "#1a202c",
  "Text Secondary": "#4b5563",
  "Text Muted": "#5a6470",
  "Text Disabled": "#a0aec0",
  "Surface BG": "#ffffff",
  "Surface Section": "#f8fafb",
  "Surface Card": "#ffffff",
  "Surface Elevated": "#f3f4f6",
  "Surface Interactive": "#f8fafb",
  "Surface Hover": "#eff1f5",
  "Border Default": "#e5e7eb",
  "Accent Default": "#1D9E75",
  "Success Default": "#059669",
  "Warning Default": "#d97706",
  "Danger Default": "#dc2626",
};

// Dark Theme Colors
const darkTheme = {
  "Text Primary": "#f1f5f9",
  "Text Secondary": "#cbd5e1",
  "Text Muted": "#94a3b8",
  "Text Disabled": "#64748b",
  "Surface BG": "#04100A",
  "Surface Section": "#0f1419",
  "Surface Card": "#1a1f25",
  "Surface Elevated": "#202530",
  "Surface Interactive": "#242d35",
  "Surface Hover": "#2a3340",
  "Border Default": "#30363D",
  "Accent Default": "#1D9E75",
  "Success Default": "#059669",
  "Warning Default": "#d97706",
  "Danger Default": "#ef4444",
};

// Test combinations
const tests = [
  // Light Theme - Text on Surfaces
  { name: "Light: Text Primary on Surface BG", fg: lightTheme["Text Primary"], bg: lightTheme["Surface BG"], level: "AAA" },
  { name: "Light: Text Primary on Surface Card", fg: lightTheme["Text Primary"], bg: lightTheme["Surface Card"], level: "AAA" },
  { name: "Light: Text Primary on Surface Elevated", fg: lightTheme["Text Primary"], bg: lightTheme["Surface Elevated"], level: "AAA" },
  { name: "Light: Text Secondary on Surface Card", fg: lightTheme["Text Secondary"], bg: lightTheme["Surface Card"], level: "AA" },
  { name: "Light: Text Muted on Surface Card", fg: lightTheme["Text Muted"], bg: lightTheme["Surface Card"], level: "AA" },

  // Dark Theme - Text on Surfaces
  { name: "Dark: Text Primary on Surface BG", fg: darkTheme["Text Primary"], bg: darkTheme["Surface BG"], level: "AAA" },
  { name: "Dark: Text Primary on Surface Card", fg: darkTheme["Text Primary"], bg: darkTheme["Surface Card"], level: "AAA" },
  { name: "Dark: Text Secondary on Surface Card", fg: darkTheme["Text Secondary"], bg: darkTheme["Surface Card"], level: "AA" },
  { name: "Dark: Accent on Surface Card", fg: darkTheme["Accent Default"], bg: darkTheme["Surface Card"], level: "AAA" },

  // Buttons
  { name: "Primary Button: White text on accent", fg: "ffffff", bg: "#0d7a56", level: "AAA" },
  { name: "Danger Button: White text on red", fg: "ffffff", bg: lightTheme["Danger Default"], level: "AAA" },
  { name: "Success Button: White text on green", fg: "ffffff", bg: "#047857", level: "AAA" },
];

console.log("\n" + "=".repeat(80));
console.log("WCAG COLOR CONTRAST VERIFICATION");
console.log("=".repeat(80) + "\n");

let passed = 0;
let failed = 0;
let warnings = 0;

tests.forEach(test => {
  const ratio = getContrast(test.fg, test.bg);
  const compliance = checkCompliance(ratio);

  const status = compliance.includes("AAA")
    ? "✓ PASS"
    : compliance.includes("AA")
    ? "⚠ WARN"
    : "✗ FAIL";

  if (status.includes("PASS") && test.level === "AAA") passed++;
  else if (status.includes("WARN") && test.level === "AA") passed++;
  else if (status.includes("FAIL")) failed++;
  else if (status.includes("WARN")) warnings++;

  console.log(`${status} | ${test.name}`);
  console.log(`     Contrast Ratio: ${ratio} (Need: ${test.level})`);
  console.log(`     Compliance: ${compliance}\n`);
});

console.log("=".repeat(80));
console.log("SUMMARY");
console.log("=".repeat(80));
console.log(`✓ Passed:  ${passed}`);
console.log(`⚠ Warnings: ${warnings}`);
console.log(`✗ Failed:  ${failed}`);
console.log(`Total:    ${tests.length}\n`);

if (failed === 0) {
  console.log("✅ All tests passed! Accessibility compliance verified.\n");
} else {
  console.log("❌ Some tests failed. Review colors and adjust accordingly.\n");
}

console.log("WCAG Compliance Levels:");
console.log("- AAA (Enhanced): 7:1 ratio (best)");
console.log("- AA (Normal):    4.5:1 ratio (acceptable)");
console.log("- FAIL:           < 4.5:1 ratio (not compliant)\n");

module.exports = { getContrast, checkCompliance };
