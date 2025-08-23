export const colors = {
  // Primary Brand Colors (from logo)
  primary: {
    darkBlue: '#1a365d',      // Main background circle and overalls
    lightBrown: '#d4a574',    // Monkey fur
    tan: '#f4d03f',           // Monkey face and hands
    silver: '#cbd5e0',        // Wrench color
    cream: '#f7fafc',         // Background color
  },
  
  // Secondary Colors
  secondary: {
    blue: '#2d3748',          // Darker blue for depth
    brown: '#a0522d',         // Darker brown for contrast
    gray: '#718096',          // Medium gray
    lightGray: '#e2e8f0',     // Light gray for borders
  },
  
  // Semantic Colors
  semantic: {
    success: '#48bb78',       // Green for success states
    warning: '#ed8936',       // Orange for warnings
    error: '#e53e3e',         // Red for errors
    info: '#3182ce',          // Blue for info
  },
  
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
  
  // Background Colors
  background: {
    primary: '#f7fafc',       // Main background (cream)
    secondary: '#edf2f7',     // Secondary background
    card: '#ffffff',          // Card background
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  
  // Text Colors
  text: {
    primary: '#1a202c',       // Primary text
    secondary: '#4a5568',     // Secondary text
    tertiary: '#718096',      // Tertiary text
    inverse: '#ffffff',       // Text on dark backgrounds
    disabled: '#a0aec0',      // Disabled text
  },
  
  // Border Colors
  border: {
    primary: '#e2e8f0',       // Primary borders
    secondary: '#cbd5e0',     // Secondary borders
    focus: '#3182ce',         // Focus state borders
  },
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = typeof colors[ColorKey];
