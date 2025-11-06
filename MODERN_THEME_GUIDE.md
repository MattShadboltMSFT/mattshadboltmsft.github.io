# Modern Premium Theme - Design Guide

## Overview

The Modern Premium theme brings a visually stunning, contemporary design to Jays Footy Stats, inspired by leading web applications like Notion, Linear, and Stripe. This theme emphasizes clean aesthetics, excellent readability, and smooth interactions.

## Design Philosophy

### Core Principles
- **Clean & Minimalist**: Focus on content with minimal visual noise
- **Soft & Accessible**: Neutral backgrounds with rich, accessible accent colors
- **Smooth Interactions**: Subtle animations and hover states for better UX
- **Responsive**: Optimized for desktop, tablet, and mobile devices

## Visual Design System

### Color Palette

#### Backgrounds
- **Primary**: `#FAFAFA` - Soft off-white for main background
- **Secondary**: `#FFFFFF` - Pure white for cards and panels
- **Tertiary**: `#F5F5F5` - Light gray for subtle differentiation

#### Text Colors
- **Primary**: `#171717` - Near black for main content (WCAG AAA compliant)
- **Secondary**: `#737373` - Medium gray for secondary text
- **Tertiary**: `#A3A3A3` - Light gray for tertiary information

#### Accent Colors
- **Primary**: `#6366F1` (Indigo) - Main call-to-action color
- **Secondary**: `#8B5CF6` (Purple) - Secondary actions
- **Success**: `#10B981` (Emerald) - Success states and positive metrics
- **Warning**: `#F59E0B` (Amber) - Warnings and attention
- **Error**: `#EF4444` (Red) - Errors and critical information
- **Info**: `#3B82F6` (Blue) - Informational elements

#### Borders
- **Light**: `#E5E5E5` - Subtle borders for cards
- **Medium**: `#D4D4D4` - More prominent borders
- **Dark**: `#A3A3A3` - Strong borders when needed

### Typography

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

#### Font Sizes
- **modern-xs**: 0.75rem (12px) - Small labels, badges
- **modern-sm**: 0.875rem (14px) - Secondary text, descriptions
- **modern-base**: 1rem (16px) - Body text, buttons
- **modern-lg**: 1.125rem (18px) - Emphasized text
- **modern-xl**: 1.25rem (20px) - Subheadings
- **modern-2xl**: 1.5rem (24px) - Section headings
- **modern-3xl**: 1.875rem (30px) - Page titles
- **modern-4xl**: 2.25rem (36px) - Hero headings

All sizes include optimized line heights and letter spacing for readability.

### Shadows

The theme uses a progressive shadow system for depth and hierarchy:

- **modern-sm**: Subtle shadow for slight elevation
- **modern**: Standard card shadow
- **modern-md**: Medium elevation for interactive elements
- **modern-lg**: Large shadow for modals and important elements
- **modern-xl**: Extra large shadow for maximum emphasis
- **modern-inner**: Inset shadow for inputs

### Border Radius

- **modern**: 12px - Standard rounded corners
- **modern-lg**: 16px - Large rounded corners for cards
- **modern-xl**: 20px - Extra large for hero sections

### Animations

- **modern-fade-in**: Smooth fade-in (0.3s)
- **modern-slide-up**: Slide up with fade (0.4s)
- **modern-scale**: Subtle scale effect (0.2s)

## Component Styling

### Hero Section
- Gradient background (white to neutral-50)
- Large, bold headings with negative letter spacing
- Dual CTA buttons (primary + secondary)
- Generous padding and spacing

### Cards
- White background with subtle border
- Shadow on hover for interactivity
- Rounded corners (12-16px)
- Smooth transitions

### Buttons

#### Primary Button
- Indigo background (#6366F1)
- White text
- Shadow elevation
- Hover: Darker shade + increased shadow
- Active: Slight scale down (0.98)

#### Secondary Button
- Light gray background
- Dark text
- Light border
- Hover: Darker background + medium border

### Forms & Inputs
- Rounded corners (12px)
- Light border
- Focus: Indigo border + subtle ring
- Smooth transitions on all states

### Navigation Cards
- Icon badge with gradient background
- Large, readable labels
- Descriptive subtitle
- Hover: Color accent on text

### Stat Cards
- Color-coded backgrounds for different metrics
  - Goals: Emerald background
  - Kicks: Blue background
  - Marks: Purple background
- Large, bold numbers
- Small, uppercase labels

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Primary text meets AAA standards (7:1+)
- Interactive elements have sufficient contrast

### Focus States
- Visible focus rings on all interactive elements
- 2px ring with accent color at 20% opacity
- Never remove focus indicators

### Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between clickable items

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Hero CTAs stack vertically
- Navigation cards use full width
- Reduced padding on smaller screens
- Touch-friendly spacing

## Usage Examples

### Using Theme in Components
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, currentTheme } = useTheme();
  
  return (
    <div className={`${theme.colors.bgCard} ${theme.styles.card}`}>
      <h2 className={theme.colors.textPrimary}>Heading</h2>
      <button className={`${theme.colors.btnPrimary} ${theme.styles.button}`}>
        Click Me
      </button>
    </div>
  );
}
```

### Conditional Modern Styling
```jsx
{currentTheme === 'modernPremium' && (
  <div className="bg-gradient-to-br from-white to-neutral-50">
    Modern-specific content
  </div>
)}
```

## Best Practices

1. **Consistency**: Use theme tokens instead of hardcoded values
2. **Spacing**: Use generous padding (6-8 Tailwind units)
3. **Hierarchy**: Differentiate sections with backgrounds and borders
4. **Animations**: Keep transitions smooth but not too slow (200-400ms)
5. **Icons**: Use emoji or simple SVG icons for visual interest
6. **Whitespace**: Don't be afraid of empty space - it improves readability

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- CSS is fully Tailwind-based (no custom CSS files)
- Font smoothing enabled for crisp text rendering
- Minimal JavaScript for theme switching
- Shadows and transitions are GPU-accelerated

## Future Enhancements

- Dark mode variant
- Custom theme builder
- Accessibility presets
- Team color customization
- Seasonal themes
