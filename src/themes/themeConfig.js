// Three Modern UX Theme Options for Jays Footy Stats

export const themes = {
  // OPTION 1: Vibrant Gradient Theme (Enhanced version of current design)
  // Bold gradients, glassmorphism effects, and vibrant AFL colors
  vibrantGradient: {
    id: 'vibrantGradient',
    name: 'Vibrant Gradient',
    description: 'Bold and energetic with vibrant gradients and glassmorphism',
    colors: {
      // Background colors
      bgPrimary: 'from-purple-900 via-blue-900 to-indigo-900',
      bgSecondary: 'from-blue-600 to-purple-600',
      bgCard: 'bg-white/10 backdrop-blur-md border-white/20',
      bgCardHover: 'hover:bg-white/15',
      
      // Text colors
      textPrimary: 'text-white',
      textSecondary: 'text-gray-200',
      textAccent: 'text-pink-400',
      
      // Button colors
      btnPrimary: 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600',
      btnSecondary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
      
      // Stats colors
      statSuccess: 'text-green-400',
      statWarning: 'text-yellow-400',
      statInfo: 'text-blue-400',
      
      // Border colors
      border: 'border-white/20',
      borderAccent: 'border-pink-500/50',
    },
    styles: {
      card: 'rounded-2xl shadow-2xl backdrop-blur-xl',
      button: 'rounded-xl font-bold shadow-lg transform transition-all hover:scale-105',
      input: 'rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-300',
      badge: 'rounded-full px-3 py-1 text-xs font-semibold',
    }
  },

  // OPTION 2: Minimalist Clean Theme
  // Light, clean, and content-focused with subtle colors
  minimalistClean: {
    id: 'minimalistClean',
    name: 'Minimalist Clean',
    description: 'Light and clean design with focus on content and readability',
    colors: {
      // Background colors
      bgPrimary: 'bg-gray-50',
      bgSecondary: 'bg-blue-600',
      bgCard: 'bg-white border-gray-200',
      bgCardHover: 'hover:shadow-lg hover:border-gray-300',
      
      // Text colors
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textAccent: 'text-blue-600',
      
      // Button colors
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
      btnSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      
      // Stats colors
      statSuccess: 'text-green-600',
      statWarning: 'text-amber-600',
      statInfo: 'text-blue-600',
      
      // Border colors
      border: 'border-gray-200',
      borderAccent: 'border-blue-500',
    },
    styles: {
      card: 'rounded-lg shadow-sm border',
      button: 'rounded-lg font-medium shadow-sm transition-all',
      input: 'rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
      badge: 'rounded-md px-2.5 py-0.5 text-xs font-medium',
    }
  },

  // OPTION 3: Material Design Theme
  // Google Material Design inspired with depth and elevation
  materialDesign: {
    id: 'materialDesign',
    name: 'Material Design',
    description: 'Material Design with depth, shadows, and floating elements',
    colors: {
      // Background colors
      bgPrimary: 'bg-slate-100',
      bgSecondary: 'bg-blue-700',
      bgCard: 'bg-white',
      bgCardHover: 'hover:shadow-2xl',
      
      // Text colors
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textAccent: 'text-blue-700',
      
      // Button colors
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl',
      btnSecondary: 'bg-teal-500 hover:bg-teal-600 text-white hover:shadow-lg',
      
      // Stats colors
      statSuccess: 'text-green-700',
      statWarning: 'text-orange-700',
      statInfo: 'text-blue-700',
      
      // Border colors
      border: 'border-transparent',
      borderAccent: 'border-blue-600',
    },
    styles: {
      card: 'rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300',
      button: 'rounded-md font-medium shadow-md transition-all duration-200 uppercase text-sm',
      input: 'rounded border-b-2 border-gray-300 focus:border-blue-600 bg-gray-50 text-gray-900',
      badge: 'rounded px-2 py-1 text-xs font-medium uppercase tracking-wide',
    }
  },

  // OPTION 4: Modern Premium Theme
  // Inspired by Notion, Linear, and Stripe - Clean, contemporary, and sophisticated
  modernPremium: {
    id: 'modernPremium',
    name: 'Modern Premium',
    description: 'Clean, contemporary design inspired by Notion, Linear, and Stripe',
    colors: {
      // Background colors
      bgPrimary: 'bg-modern-bg-primary',
      bgSecondary: 'bg-gradient-to-r from-modern-accent-primary to-modern-accent-secondary',
      bgCard: 'bg-modern-bg-card',
      bgCardHover: 'hover:shadow-modern-md hover:border-modern-border-medium',
      
      // Text colors
      textPrimary: 'text-modern-text-primary',
      textSecondary: 'text-modern-text-secondary',
      textAccent: 'text-modern-accent-primary',
      textInverse: 'text-modern-text-inverse',
      
      // Button colors
      btnPrimary: 'bg-modern-accent-primary hover:bg-indigo-600 text-white shadow-modern hover:shadow-modern-md active:scale-[0.98]',
      btnSecondary: 'bg-modern-bg-tertiary hover:bg-neutral-200 text-modern-text-primary border border-modern-border-light hover:border-modern-border-medium shadow-modern-sm hover:shadow-modern',
      btnSuccess: 'bg-modern-accent-success hover:bg-emerald-600 text-white shadow-modern',
      
      // Stats colors
      statSuccess: 'text-modern-accent-success',
      statWarning: 'text-modern-accent-warning',
      statInfo: 'text-modern-accent-info',
      statError: 'text-modern-accent-error',
      
      // Border colors
      border: 'border-modern-border-light',
      borderMedium: 'border-modern-border-medium',
      borderAccent: 'border-modern-accent-primary',
    },
    styles: {
      card: 'rounded-modern-lg shadow-modern border border-modern-border-light transition-all duration-300 ease-out',
      button: 'rounded-modern font-medium transition-all duration-200 ease-out transform',
      input: 'rounded-modern border border-modern-border-light focus:border-modern-accent-primary focus:ring-2 focus:ring-modern-accent-primary/20 bg-modern-bg-secondary text-modern-text-primary placeholder-modern-text-tertiary transition-all duration-200',
      badge: 'rounded-md px-2.5 py-1 text-modern-xs font-medium tracking-wide',
      hero: 'rounded-modern-xl shadow-modern-lg border border-modern-border-light bg-gradient-to-br from-white to-neutral-50',
      section: 'space-y-6 animate-modern-fade-in',
    }
  }
};

// Default theme
export const defaultTheme = 'modernPremium';

// Helper function to get theme by id
export function getTheme(themeId) {
  return themes[themeId] || themes[defaultTheme];
}

// Helper function to get all theme options for selection
export function getThemeOptions() {
  return Object.values(themes).map(theme => ({
    id: theme.id,
    name: theme.name,
    description: theme.description
  }));
}
