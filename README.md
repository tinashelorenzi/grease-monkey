# Grease Monkey - React Native App

A professional automotive services app built with React Native and Expo, featuring a comprehensive design system based on the Grease Monkey brand identity.

## 🎨 Design System

The app uses a carefully crafted design system that reflects the Grease Monkey brand:

### Brand Colors
- **Primary Dark Blue** (`#1a365d`) - Main brand color from the logo background
- **Light Brown** (`#d4a574`) - Monkey fur color
- **Tan** (`#f4d03f`) - Monkey face and hands
- **Silver** (`#cbd5e0`) - Wrench color
- **Cream** (`#f7fafc`) - Background color

### Typography
- Clean, modern font system with proper hierarchy
- Responsive font sizes and weights
- Optimized for readability across devices

### Components
- Reusable, themed components
- Consistent spacing and shadows
- Cross-platform compatibility

## 📁 Project Structure

```
src/
├── theme/                 # Design system
│   ├── colors.ts         # Color palette
│   ├── typography.ts     # Typography system
│   ├── spacing.ts        # Spacing values
│   ├── borders.ts        # Border styles
│   ├── shadows.ts        # Shadow system
│   └── index.ts          # Theme exports
├── components/
│   └── common/           # Reusable components
│       ├── Button.tsx    # Button component
│       ├── Card.tsx      # Card component
│       ├── Text.tsx      # Text component
│       └── index.ts      # Component exports
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd grease-monkey
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🎯 Usage

### Using the Theme

```typescript
import { theme } from './src/theme';

// Using colors
const backgroundColor = theme.colors.primary.darkBlue;

// Using typography
const textStyle = theme.typography.textStyles.h1;

// Using spacing
const padding = theme.spacing.lg;

// Using shadows
const shadowStyle = theme.shadows.component.card;
```

### Using Components

```typescript
import { Button, Card, Text } from './src/components/common';

// Button with different variants
<Button
  title="Primary Action"
  onPress={() => {}}
  variant="primary"
  size="lg"
/>

// Card with content
<Card variant="elevated" padding="lg">
  <Text variant="h3">Card Title</Text>
  <Text variant="body1">Card content goes here</Text>
</Card>

// Text with styling
<Text variant="h1" color="primary" align="center">
  Heading Text
</Text>
```

## 🎨 Component Variants

### Button Variants
- `primary` - Dark blue background with white text
- `secondary` - Silver background with dark text
- `outline` - Transparent with blue border
- `ghost` - Transparent with blue text

### Button Sizes
- `sm` - Small (32px height)
- `md` - Medium (44px height)
- `lg` - Large (52px height)

### Card Variants
- `default` - Standard card with subtle shadow
- `elevated` - Card with prominent shadow
- `outlined` - Card with border only

### Text Variants
- `h1` through `h6` - Heading styles
- `body1`, `body2` - Body text styles
- `caption` - Small caption text
- `button` - Button text style
- `overline` - Small uppercase text

## 🔧 Customization

### Adding New Colors
Edit `src/theme/colors.ts` to add new color values:

```typescript
export const colors = {
  primary: {
    // ... existing colors
    newColor: '#your-color',
  },
  // ... rest of colors
};
```

### Adding New Components
Create new components in `src/components/common/` and export them from the index file.

### Modifying Typography
Edit `src/theme/typography.ts` to adjust font sizes, weights, or add new text styles.

## 📱 Platform Considerations

The design system automatically handles platform differences:
- **Shadows**: iOS uses `shadowColor/Offset/Opacity/Radius`, Android uses `elevation`
- **Fonts**: iOS uses System font, Android uses Roboto
- **Touch feedback**: Proper `activeOpacity` and `TouchableOpacity` usage

## 🎯 Best Practices

1. **Use theme values**: Always use theme colors, spacing, and typography instead of hardcoded values
2. **Component composition**: Build complex UIs by composing simple, themed components
3. **Consistent spacing**: Use the spacing system for all margins and padding
4. **Accessibility**: Ensure proper contrast ratios and touch target sizes
5. **Performance**: Use `StyleSheet.create()` for all styles

## 🤝 Contributing

1. Follow the existing design system patterns
2. Use the theme values for consistency
3. Test on both iOS and Android
4. Update documentation for new components

## 📄 License

This project is licensed under the MIT License.
