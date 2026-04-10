/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ─── Design tokens lifted from the HTML prototypes ───
      // Use these by name (e.g. `bg-brand-blue`, `text-text-primary`, `border-border-default`).
      // NEVER hardcode hex values inside components — if a color is missing, add it here.
      colors: {
        brand: {
          blue: '#0044B3',         // primary CTA, links, focus rings
          'blue-dark': '#003399',  // hover state for primary buttons
          'blue-light': '#f0f5ff', // subtle highlight backgrounds
        },
        text: {
          primary: '#2d2d2d',   // body copy, headings
          secondary: '#595959', // labels, helper text
          tertiary: '#767676',  // muted/disabled labels
          inverse: '#ffffff',   // text on dark surfaces
        },
        border: {
          default: '#ebebeb',   // most card borders
          strong: '#d4d2d0',    // top bar separator, stronger dividers
          subtle: '#f3f2ef',    // hover backgrounds (also surface.sunken)
        },
        surface: {
          raised: '#ffffff',    // cards, modals
          sunken: '#f3f2ef',    // hover, page background tint
          gray: '#f9fafb',      // step backgrounds
        },
        status: {
          success: '#16a34a',
          'success-dark': '#166534',
          warning: '#f59e0b',
          danger: '#dc2626',
          'danger-bg': '#fef2f2',
          'danger-border': '#fecaca',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      fontSize: {
        // Spec-aligned with HTML prototypes
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        md: ['15px', { lineHeight: '1.5' }],
        lg: ['16px', { lineHeight: '1.5' }],
        xl: ['18px', { lineHeight: '1.4' }],
        '2xl': ['20px', { lineHeight: '1.4' }],
        '3xl': ['24px', { lineHeight: '1.3' }],
        '4xl': ['28px', { lineHeight: '1.3' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04)',
        modal: '0 20px 60px rgba(0,0,0,0.25)',
        menu: '0 4px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
